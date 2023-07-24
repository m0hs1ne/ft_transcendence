import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { ChatRoomsService } from './chat_rooms.service';
import { CreateChatRoomDto } from './dto/create-chat_room.dto';
import { UpdateChatRoomDto } from './dto/update-chat_room.dto';
import { BadRequestException, ForbiddenException, NotFoundException, OnModuleInit, Req, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { checkPassword, userWSAuthGuard, verifyToken } from 'src/utils/guard';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';


var clients : Map<number, Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>> = new Map()

@UseGuards(userWSAuthGuard)
@WebSocketGateway({
  cors : {
    origin: "*"
  }
}
)
export class ChatRoomsGateway{
  constructor(private readonly chatRoomsService: ChatRoomsService) {
  }

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket)
  {
    const payload = verifyToken(socket.handshake.headers.cookie)
    console.log(payload.sub)
    console.log("Connected")
    clients.set(payload.sub,socket)
    const invitation = await this.chatRoomsService.getInvitationOfUser(payload.sub);
    socket.emit('Notification', invitation)
  }

  handleDisconnect(socket: Socket) {
    const payload = verifyToken(socket.handshake.headers.cookie)
    console.log(`socket disconnected: ${payload.sub}`);
    clients.delete(payload.sub)
  }


  @SubscribeMessage('createChatRoom')
  async create(@MessageBody() createChatRoomDto: CreateChatRoomDto, @Req() req) {
    const payload = verifyToken(req.handshake.headers.cookie);
    try
    {
      const chatroom = await this.chatRoomsService.create(createChatRoomDto, payload)
      this.server.emit('onNewChatRoom', chatroom)
    } catch(e) {
      const client = clients.get(payload.sub)
      client.emit('Error', {error: e.message});
    }
  }

  @SubscribeMessage('findAllChatRooms')
  async findAll() {
    const chatroom = await this.chatRoomsService.findAll()
    this.server.emit('AllChatRooms', chatroom)
  }

  @SubscribeMessage('findOneChatRoom')
  findOne(@MessageBody() title: string) {
    return this.chatRoomsService.findOne(title);
  }

  
  @SubscribeMessage('updateChatRoom')
  async update(@MessageBody() updateChatRoomDto: UpdateChatRoomDto, @Req() req) {
    const payload = verifyToken(req.handshake.headers.cookie);
    try 
    {
      const chatroom = await this.chatRoomsService.update(updateChatRoomDto.title, updateChatRoomDto, payload);
      this.server.emit('updateChatRoom', chatroom)
    } catch (e) {
      const client = clients.get(payload.sub)
      client.emit('Error', {error: e.message});
    }
  }

  @SubscribeMessage('removeChatRoom')
  async remove(@MessageBody() body, @Req() req) {
    const {title} = body;
    if (!title)
      return;
    const payload = verifyToken(req.handshake.headers.cookie);
    try 
    {
      if (title && typeof title === 'string')
      {
        const chatroom = await this.chatRoomsService.remove(title, payload);
        clients[payload.sub].emit('Notification', {message: `${chatroom.affected} has been deleted.`})
      }
    } catch (e) {
      const client = clients.get(payload.sub)
      client.emit('Error', {error: e.message});
    }
  }

  /* ---------add Member to public or protected Chat----------- */
  @SubscribeMessage('enterToChat')
  async enterMember(@MessageBody() body, @Req() req)
  {
    //expected params chatId, password: if chat is protected
    const payload = await verifyToken(req.handshake.headers.cookie)
    const {chatId, password} = body;
    try
    {
      if (typeof chatId === 'number')
      {

          const chat = await this.chatRoomsService.findOneById(chatId);
          if (!chat)
            throw new NotFoundException();
          else if (chat.privacy == 'protected' && typeof password != 'string')
            throw new ForbiddenException()
          else if (chat.privacy == 'public' || (chat.privacy == 'protected' && checkPassword(password, chat.password)))
          {
            const member = await this.chatRoomsService.addMemberToChat(chatId, payload.sub)
            await this.chatRoomsService.newChatMessage(chat.owner, chatId, `${member.username} joined the chat.` , 'notification', clients);
          }
      }
      else if (typeof chatId != 'number')
        throw new BadRequestException('chatId should be a number')
    }
    catch(e)
    {
      const client = clients.get(payload.sub)
      client.emit('Error', {error: e.message});
    }
  }

  /* ---------add Member to private chat via invitation------------ */
  @SubscribeMessage('inviteToChat')
  async invite(@MessageBody() body, @Req() req) {
    const {
      toId,
      title
    } = body

    // expected params: toId: id of user to send to | title: title of chatroom
    const payload = verifyToken(req.handshake.headers.cookie)
    try
    {
      const invite = await this.chatRoomsService.inviteUserToPrivate(toId, title, payload);
      const client = clients.get(toId)
      if (client)
      {
        console.log("Socket Entered")
        client.emit('Notification', invite)
      }
    } catch(e) {
      const client = clients.get(payload.sub)
      client.emit('Error', {error: e.message});
    }
    /* return Invitation sent to toId, 
    {
      id, of invitation
      title, of chat
      from:
        {
          id,
          username,
          avatar
        }
      }
    */
  }

  @SubscribeMessage('acceptInviteToChat')
  async acceptInvite(@MessageBody() body, @Req() req)
  {
    const {id} = body;
    //expected params: id: invitation id
    const payload = verifyToken(req.handshake.headers.cookie)
    try
    {
      if (typeof id === 'string')
      {
        await this.chatRoomsService.acceptInviteToChat(body, payload);
        const invitation = await this.chatRoomsService.getInvitationById(id)
        await this.chatRoomsService.removeInvitation(id)
        if (invitation)
        {
          await this.chatRoomsService.newChatMessage(invitation.fromUser.id, invitation.chatRoom.id, `${invitation.toUser.username} joined the chat.` , 'notification', clients);
        }
      }
      else
        throw new BadRequestException('id should be a string.')
    } catch(e) {
      const client = clients.get(payload.sub)
      client.emit('Error', {error: e.message});
    }
  }

  /* ---------message handler------------ */
  @SubscribeMessage('sendMessage')
  async newChatMessage(@MessageBody() body, @Req() req)
  {
    //expected params: chatId, message
    const {
      chatId,
      message
    } = body;
    const payload = verifyToken(req.handshake.headers.cookie);
    try
    {
      if (chatId && message)
        await this.chatRoomsService.newChatMessage(payload.sub, chatId, message, "message", clients)
      else
        throw new BadRequestException()
    } catch(e) {
      const client = clients.get(payload.sub)
      client.emit('Error', {error: e.message});
    }
  }
}

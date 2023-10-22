import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { ChatRoomsService } from './chat_rooms.service';
import { UpdateChatRoomDto } from './dto/update-chat_room.dto';
import { BadRequestException, NotFoundException, Req, UnauthorizedException } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { checkPassword, verifyToken } from 'src/utils/guard';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { UsersService } from 'src/users/users.service';


var clients : Map<number, Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>> = new Map()

@WebSocketGateway({
  cors : {
    credentials: true,
    origin: "http://localhost:5173"
  }
}
)
export class ChatRoomsGateway{
  constructor(private readonly chatRoomsService: ChatRoomsService, 
    private readonly userService: UsersService) {
  }

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket)
  {
    try
    {
      const payload = verifyToken(socket.handshake.headers.cookie)
      console.log(payload.sub)
      console.log("Connected")
      clients.set(payload.sub,socket)
      const notifications = []
      const invitation = await this.chatRoomsService.getInvitationOfUser(payload.sub);
      notifications.push({type: 'invitations', invitation})
      const message = await this.chatRoomsService.messagesNotification(payload.sub)
      notifications.push({type: 'info', message: `You Got ${message} new Messages`})
      socket.emit('Notification', {type: 'list', notifications})
  } catch(e) {
    console.log(e.message)
    socket.disconnect()
  }
  }

  handleDisconnect(socket: Socket) {
    const payload = verifyToken(socket.handshake.headers.cookie)
    console.log(`socket disconnected: ${payload.sub}`);
    this.userService.updateDateDisconnect(payload.sub)
    clients.delete(payload.sub)
  }
  
  @SubscribeMessage('createChatRoom')
  async create(@MessageBody() body, @Req() req) {
    /*
    title: string;
    privacy: string;
    password: string;
    */
   const {
    title,
    privacy,
    password,
    owner
   } = body
    const payload = verifyToken(req.handshake.headers.cookie);
    try
    {
      if (typeof title === 'string' && typeof privacy === 'string')
      {
        const chatroom = await this.chatRoomsService.create({title, privacy, owner,ifProtectedPass: password}, payload)
        const client = clients.get(payload.sub)
        client.emit('ChatRoomList', {type: 'new', chatroom})
      }
    } catch(e) {
      const client = clients.get(payload.sub)
      if (client)
        client.emit('Error', {error: e.message});
    }
  }
  
  @SubscribeMessage('findAllChatRooms')
  async findAll(@Req() req) {
    const payload = verifyToken(req.handshake.headers.cookie)
    const chatroom = await this.chatRoomsService.findAll(payload)
    this.server.emit('ChatRoomList', {type: 'all', chatrooms: chatroom})
  }

  @SubscribeMessage('myChatRooms')
  async findOne(@MessageBody() body, @Req() req) {
    const payload = verifyToken(req.handshake.headers.cookie)
    try{
        const mychatRooms = await this.chatRoomsService.findMyChatRooms(payload);
        const client = clients.get(payload.sub)
        client.emit('ChatRoomList', {type: 'mylist', chatrooms: mychatRooms});
    } catch(e) {
      const client = clients.get(payload.sub)
      if (client)
        client.emit('Error', {error: e.message});
    }
  }
  @SubscribeMessage('updateChatRoom')
  async update(@MessageBody() updateChatRoomDto: UpdateChatRoomDto, @Req() req) {
    /* chatId: number;
    title: string;
    privacy: string;
    password: string; */
    const payload = verifyToken(req.handshake.headers.cookie);
    try 
    {
      const chatroom = await this.chatRoomsService.update(updateChatRoomDto.chatId, updateChatRoomDto, payload);
      if (chatroom.privacy != 'private')
        this.server.emit('ChatRoomList', {type: 'updated', chatrooms: chatroom})
    } catch (e) {
      const client = clients.get(payload.sub)
      if (client)
        client.emit('Error', {error: e.message});
    }
  }

  @SubscribeMessage('removeChatRoom')
  async remove(@MessageBody() body, @Req() req) {
    const {id} = body;
    if (!id)
      return;
    const payload = verifyToken(req.handshake.headers.cookie);
    try 
    {
      if (id && typeof id === 'number')
      {
        const chatroom = await this.chatRoomsService.remove(id, payload,clients);
        const client = clients.get(payload.sub)
        client.emit('Notification', {type: 'info', message: `${chatroom.affected} has been deleted.`})
      }
    } catch (e) {
      const client = clients.get(payload.sub)
      if (client)
        client.emit('Error', {error: e.message});
    }
  }

  /* ----------------Member Work------------------ */
  @SubscribeMessage('updateMemberRole')
  async updateRole(@MessageBody() body, @Req() req)
  {
    //memberId to change role in chatId, role = admin || member
    const {
      memberId,
      chatId,
      role
    } = body;
    const payload = verifyToken(req.handshake.headers.cookie)
    try{
      if (typeof memberId === 'number' && typeof chatId === 'number' && typeof role === 'string')
      {
        const updatedMember = await this.chatRoomsService.updateMemberRole(memberId, chatId, role, payload)
        if (updatedMember.role == 'admin')
          await this.chatRoomsService.newChatMessage(payload.sub, chatId, `${updatedMember.user.username} is an ${updatedMember.role} now.` , 'notification', clients, "role");
        else
          await this.chatRoomsService.newChatMessage(payload.sub, chatId, `${updatedMember.user.username} is a normal ${updatedMember.role} now.` , 'notification', clients, "role");
      }
      else  
        throw new BadRequestException()
    } catch(e) {
      const client = clients.get(payload.sub)
      if (client)
        client.emit('Error', {error: e.message});
    }
  }

  @SubscribeMessage('updateMemberStatus')
  async updateStatus(@MessageBody() body, @Req() req)
  {
    // memberId to change status, in chatId, status = banned || muted, if status is muted then mutedFor has to be in minutes
    const {
      memberId,
      chatId,
      status,
      mutedFor
    } = body;
    const payload = verifyToken(req.handshake.headers.cookie)
    try{
      if (typeof memberId === 'number' && typeof chatId === 'number' && typeof status === 'string')
      {
        const updatedMember = await this.chatRoomsService.updateMemberStatus(memberId, chatId, status, mutedFor, payload)
        await this.chatRoomsService.newChatMessage(payload.sub, chatId, `${updatedMember.user.username} is ${updatedMember.userStatus}.` , 'notification', clients, "status");
      }
      else
        throw new BadRequestException()
    } catch(e) {
      const client = clients.get(payload.sub)
      if (client)
        client.emit('Error', {error: e.message});
    }
  }
  
  @SubscribeMessage('kickMember')
  async kickMember(@MessageBody() body, @Req() req)
  {
    //expected params: memberId to kick can be self kick, from chatId
    const {
      memberId,
      chatId
    } = body
    const payload = verifyToken(req.handshake.headers.cookie)
    try{
      if (typeof memberId === 'number' && typeof chatId === 'number')
      {
        const kick = await this.chatRoomsService.kickMemberFromChat(memberId, chatId, payload, clients);
        if (kick === false)
          return;
        if (memberId != payload.sub)
          await this.chatRoomsService.newChatMessage(payload.sub, chatId, `${kick.user.username} was kicked from chat.` , 'notification', clients, "kick");
        else
          await this.chatRoomsService.newChatMessage(payload.sub, chatId, `${kick.user.username} left the chat.` , 'notification', clients, "kick");        
      }
      else
        throw new BadRequestException()
    } catch(e) {
      const client = clients.get(payload.sub)
      if (client)
        client.emit('Error', {error: e.message});
    }
  }

  /* ---------add Member to public or protected Chat-----------*/
  @SubscribeMessage('enterChat')
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
          let checked :boolean = false;
          if (typeof password === 'string')
             checked = await checkPassword(password, chat.ifProtectedPass)
          if (!chat)
            throw new NotFoundException();
            
          else if (chat.privacy == 'protected' && typeof password != 'string' )
            throw new UnauthorizedException()
          else if (chat.privacy == 'public' || (chat.privacy == 'protected' && checked))
          {
            const member = await this.chatRoomsService.addMemberToChat(chatId, payload.sub)
            await this.chatRoomsService.newChatMessage(chat.owner, chatId, `${member.username} joined the chat.` , 'notification', clients, 'joined');
          }
          else if (!checked)
            throw new UnauthorizedException()
      }
      else if (typeof chatId != 'number')
        throw new BadRequestException('chatId should be a number')
    }
    catch(e)
    {
      const client = clients.get(payload.sub)
      if (client)
        client.emit('Error', {error: e.message});
    }
  }

  @SubscribeMessage('getChatMessages')
  async getChatMessages(@MessageBody() body, @Req() req)
  {
    const {
      chatId
    }  = body

    const payload = verifyToken(req.handshake.headers.cookie)
    try
    {
      if (typeof chatId === 'number')
      {

        const messages = await this.chatRoomsService.getMessages('chat', chatId, payload)
        const client = clients.get(payload.sub)
        if (client)
          client.emit('receiveMessage', {type: "ChatMessages", chatId, messages})

      }
    } catch(e) {
      const client = clients.get(payload.sub)
      if (client)
        client.emit('Error', {error: e.message});
    }
  }

  @SubscribeMessage('getDMMessages')
  async getDMMessages(@MessageBody() body, @Req() req)
  {
    const {
      userId
    }  = body

    const payload = verifyToken(req.handshake.headers.cookie)
    try
    {
      if (typeof userId === 'number')
      {

        const messages = await this.chatRoomsService.getMessages('DM', userId, payload)
        const client = clients.get(payload.sub)
        if (client)
        {
          client.emit('receiveMessage', {type: "DMMessages", user: userId, messages})
        }

      }
    } catch(e) {
      const client = clients.get(payload.sub)
      if (client)
        client.emit('Error', {error: e.message});
    }
  }

  /* ---------add Member to private chat via invitation------------*/
  
  @SubscribeMessage('sendInvite')
  async invite(@MessageBody() body, @Req() req) {
    const {
      toId,
      chatId
    } = body

    // expected params: toId: id of user to send to | title: title of chatroom
    const payload = verifyToken(req.handshake.headers.cookie)
    try
    {
      if (typeof toId === 'number' && typeof chatId === 'number')
      {
        const invitation = await this.chatRoomsService.inviteUserToChat(toId, chatId, payload);
        const client = clients.get(toId)
        if (client)
        {
          client.emit('Notification', {type: "invitation", invitation})
        }
      }
      else 
        throw new BadRequestException()
    } catch(e) {
      const client = clients.get(payload.sub)
      if (client)
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

  @SubscribeMessage('acceptInvite')
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
        await this.chatRoomsService.removeInvitation(id, payload.sub)
        if (invitation)
        {
          await this.chatRoomsService.newChatMessage(invitation.fromUser.id, invitation.chatRoom.id, `${invitation.toUser.username} joined the chat.` , 'notification', clients, "joined");
        }
      }
      else
        throw new BadRequestException('id should be a string.')
    } catch(e) {
      const client = clients.get(payload.sub)
      if (client)
        client.emit('Error', {error: e.message});
    }
  }

  @SubscribeMessage('declineInvite')
  async declineInvite(@MessageBody() body, @Req() req)
  {
    const {id} = body;
    //expected params: id: invitation id
    const payload = verifyToken(req.handshake.headers.cookie)
    try
    {
      if (typeof id === 'string')
      {
        await this.chatRoomsService.removeInvitation(id,payload.sub)
      }
      else
        throw new BadRequestException('id should be a string.')
    } catch(e) {
      const client = clients.get(payload.sub)
      if (client)
        client.emit('Error', {error: e.message});
    }
  }

  /* ---------message handler------------*/
  
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
        await this.chatRoomsService.newChatMessage(payload.sub, chatId, message, "message", clients, "message")
      else
        throw new BadRequestException()
    } catch(e) {
      const client = clients.get(payload.sub)
      if (client)
        client.emit('Error', {error: e.message});
    }
  }

  @SubscribeMessage('sendDM')
  async newDMMessage(@MessageBody() body, @Req() req)
  {
    //expected params: toId, message
    const {
      toId,
      message
    } = body;
    const payload = verifyToken(req.handshake.headers.cookie);
    try
    {
      if (typeof toId === 'number' && typeof message === 'string')
      {
        const msg = await this.chatRoomsService.newDMMessage(payload.sub, toId, message, clients)
      }
      else
        throw new BadRequestException()
    } catch(e) {
      const client = clients.get(payload.sub)
      if (client)
        client.emit('Error', {error: e.message});
    }
  }

  // Send Game Challenge in notificatio
  @SubscribeMessage('sendChallenge')
  async challenge(@MessageBody() body, @Req() req) {
    const {
      toId,
      mode
    } = body

    // expected params: toId: id of user to send to | title: title of chatroom
    const payload = verifyToken(req.handshake.headers.cookie)
    try
    {
      if (typeof toId === 'number' && typeof mode === 'string')
      {
        const to = await this.userService.profile(toId, payload)
        const from = await this.userService.myprofile(payload.sub)
        const client = clients.get(toId)
        if (client)
        {
          const invitation = {
            mode,
            from: {
              id: from.id,
              avatar: from.avatar,
              username: from.username
            },
            to: {
              id: to.id,
              avatar: to.avatar,
              username: to.username
            }
          }
          client.emit('Notification', {type: "challenge", invitation})
        }
      }
      else 
        throw new BadRequestException()
    } catch(e) {
      const client = clients.get(payload.sub)
      if (client)
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
}

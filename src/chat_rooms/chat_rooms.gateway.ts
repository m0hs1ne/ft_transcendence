import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { ChatRoomsService } from './chat_rooms.service';
import { CreateChatRoomDto } from './dto/create-chat_room.dto';
import { UpdateChatRoomDto } from './dto/update-chat_room.dto';
import { OnModuleInit, Req, UseGuards } from '@nestjs/common';
import { Server } from 'socket.io';
import { userAuthGuard, userWSAuthGuard, verifyToken } from 'src/utils/guard';
import { UsersService } from 'src/users/users.service';

var clients = {}

@UseGuards(userWSAuthGuard)
@WebSocketGateway({
  cors : {
    origin: "*"
  }
}
)
export class ChatRoomsGateway implements OnModuleInit{
  constructor(private readonly chatRoomsService: ChatRoomsService) {
  }

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket =>
    {
      const payload = verifyToken(socket.handshake.headers.cookie)
      console.log(payload.sub)
      console.log("Connected")
      clients[payload.sub] = socket
    }))
  }

  @SubscribeMessage('createChatRoom')
  async create(@MessageBody() createChatRoomDto: CreateChatRoomDto, @Req() req) {
    const chatroom = await this.chatRoomsService.create(createChatRoomDto, req)
    if (chatroom == 'Not Acceptable')
    {
      const payload = verifyToken(req.handshake.headers.cookie)
      var client = clients[payload.sub]
      client.emit('Error', 'Not Acceptable')
    }
    else
      this.server.emit('onNewChatRoom', chatroom)
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
    const chatroom = await this.chatRoomsService.update(updateChatRoomDto.title, updateChatRoomDto, req);
    if (chatroom == 'Not Acceptable' || chatroom == 'Not Found')
    {
      const payload = verifyToken(req.handshake.headers.cookie)
      var client = clients[payload.sub]
      client.emit('Error', chatroom)
    }
    else
      this.server.emit('updateChatRoom', chatroom)
  }

  @SubscribeMessage('removeChatRoom')
  async remove(@MessageBody() title, @Req() req) {
    const chatroom = await this.chatRoomsService.remove(title, req);
    if (chatroom == 'Not Acceptable')
    {
      const payload = verifyToken(req.handshake.headers.cookie)
      var client = clients[payload.sub]
      client.emit('Error', chatroom)
    }
    else
      this.server.emit('removeChatRoom', chatroom)
  }

  /* ---------invitation handler------------ */
  @SubscribeMessage('acceptInviteToChat')
  async acceptInvite(@MessageBody() body, @Req() req)
  {
    // id: invitation id
    if (body.id)
    {
      const payload = verifyToken(req.handshake.headers.cookie)
      this.chatRoomsService.acceptInviteToChat(body, payload);
      this.chatRoomsService.removeInvitation(body.id)
    }
  }
  
  @SubscribeMessage('inviteToChat')
  async invite(@MessageBody() body, @Req() req) {
    // toId: id of user to send to | title: title of chatroom
    const socketClient = clients[body.toId]
    if (socketClient)
    {
      const payload = verifyToken(req.handshake.headers.cookie)
      const invite = await this.chatRoomsService.inviteUserToPrivate(body.toId, body.title, payload);
      if (invite == "Not Owner Or Admin" || invite == "Failed to send")
      {
        const socket = clients[payload.sub];
        socket.emit('Error', invite)
      }
      else
        socketClient.emit('ChatInvitations', invite)
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
    /* ---------message handler------------ */
  @SubscribeMessage('sendMessage')
  async newChatMessage(@MessageBody() body, @Req() req)
  {
    
  }
}

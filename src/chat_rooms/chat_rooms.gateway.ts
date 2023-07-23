import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { ChatRoomsService } from './chat_rooms.service';
import { CreateChatRoomDto } from './dto/create-chat_room.dto';
import { UpdateChatRoomDto } from './dto/update-chat_room.dto';
import { OnModuleInit, Req, UseGuards } from '@nestjs/common';
import { Server } from 'socket.io';
import { userAuthGuard, userWSAuthGuard } from 'src/utils/guard';

var clients = {}

@UseGuards(userWSAuthGuard)
@WebSocketGateway({
  cors : {
    origin: "*"
  }
}
)
export class ChatRoomsGateway implements OnModuleInit{
  constructor(private readonly chatRoomsService: ChatRoomsService) {}

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket =>
    {
      console.log(socket.handshake.headers.cookie)
      console.log("Connected")
      clients[socket.handshake.headers.cookie] = socket
    }))
  }

  @SubscribeMessage('createChatRoom')
  async create(@MessageBody() createChatRoomDto: CreateChatRoomDto, @Req() req) {
    const chatroom = await this.chatRoomsService.create(createChatRoomDto, req)
    if (chatroom == 'Not Acceptable')
    {
      var client = clients[req.handshake.headers.cookie]
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
      var client = clients[req.handshake.headers.cookie]
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
      var client = clients[req.handshake.headers.cookie]
      client.emit('Error', chatroom)
    }
    else
      this.server.emit('removeChatRoom', chatroom)
  }
}

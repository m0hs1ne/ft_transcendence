import { Socket } from 'socket.io';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Namespace } from 'socket.io';
import { Room } from './room';
import { v4 as uuidv4 } from 'uuid';
import { GameService } from './game.service';
import { verifyToken } from 'src/utils/guard';



@WebSocketGateway({
  namespace: '/game',
  cors: {
    credentials: true,
    origin: "http://localhost:5173"
  }
})
export class GameGateway {
  constructor(private readonly gameService: GameService) {
  }

  @WebSocketServer() server: Server;
  private rooms: Map<string, Room> = new Map();
  private clients: Map<number, string> = new Map()
  private roomsqueu: Socket[] = [];

  
  handleConnection(client: Socket)
  {
    console.log(`Client Connected ${client.id}`); 
  }

  handleDisconnect(client: Socket) 
  {
    try {
      const payload1 = verifyToken(client.handshake.headers.cookie);
      if (this.rooms[this.clients[payload1.sub]] != undefined) {
        this.rooms[this.clients[payload1.sub]].closeroom = true;
        this.rooms.delete(this.clients.get(payload1.sub));
      }
      if (this.roomsqueu.includes(client)) {
        this.roomsqueu.splice(this.roomsqueu.indexOf(client), 1);
      }
      if (this.clients.get(payload1.sub) != undefined) {
        this.clients.delete(payload1.sub);
      }
      console.log(`Game Socket => Client disconnected: ${client.id}`);
    } catch (err) {
      console.log(err);
    }
  }


  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, payload: any): void 
  {
    if(this.ValidateClient(client, payload))
      this.roomsqueu.push(client);
    if (this.roomsqueu.length == 2) {
      try {
        const { v4: uuidv4 } = require('uuid');
        const payload1 = verifyToken(this.roomsqueu.at(0).handshake.headers.cookie);
        const payload2 = verifyToken(this.roomsqueu.at(1).handshake.headers.cookie);

        let room: Room = new Room(this.roomsqueu.pop(), this.roomsqueu.pop());
        room.roomsId = uuidv4();
        room.GameMode = payload1.mode;

        this.clients[payload1.sub] = room.roomsId;
        this.clients[payload2.sub] = room.roomsId;
        this.rooms[room.roomsId] = room;
        this.rooms[room.roomsId].Play();
        console.log("Game Started");
      } catch (err) {
        console.log(err);
      }
    }
    else {
      console.log("Waiting");
    }
  }

  ValidateClient(client: Socket, payload: any): number
  {
    try {
      const payload = verifyToken(client.handshake.headers.cookie);
      if (this.clients.get(payload.sub) != undefined) {
        console.log(`Client: ${client.id} Already Joined a room`);
        return 0;
      }
      else {
        this.clients.set(payload.sub, "room");
        console.log(`Game Socket => A Client Joined: ${client.id}`);
        return 1;
      }
    } catch (err) {
      console.log(err);
    }

  }
  @SubscribeMessage('PaddleUpdates')
  HandlePaddlesData(client: any, payload: any): void {
    if (payload.pos == "Left") {
      this.rooms[payload.roomId].LeftPlayer.Paddle = payload.Paddle;
      this.rooms[payload.roomId].RightPlayer.socket.emit('OpponentPaddle', {
        Paddle: payload.Paddle,
      })
      // console.log(payload.Paddle, payload.pos, payload.roomId);
    }
    else if (payload.pos == "Right") {
      this.rooms[payload.roomId].RightPlayer.Paddle = payload.Paddle;
      this.rooms[payload.roomId].LeftPlayer.socket.emit('OpponentPaddle', {
        Paddle: payload.Paddle,
      })
    }

  }

  @SubscribeMessage('EndGame')
  HandlePlayerLeave(client: any, payload: any): void
  {

  }


}

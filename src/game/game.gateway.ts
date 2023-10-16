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

  handleConnection(client: Socket) {
    if (client.handshake.headers.cookie == undefined) 
    {
      console.log("Undefined Player");
      client.disconnect();
    }
    else {
      try {
        console.log(client.handshake.headers);
        const payload = verifyToken(client.handshake.headers.cookie);
        if (this.clients.get(payload.sub) != undefined) {
          client.disconnect();
          console.log(`Already COnnected => Client Got diconnected: ${client.id}`);
        }
        else {
          this.clients.set(payload.sub, null);
          console.log(`Game Socket => A Client connected: ${client.id}`);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  handleDisconnect(client: Socket) {
    try {
      console.log(client.handshake.headers);
      const payload1 = verifyToken(client.handshake.headers.cookie);
      if (this.rooms[this.clients[payload1.sub]] != undefined) {
        this.rooms[this.clients[payload1.sub]].closeroom = true;
        // this.rooms.delete(this.clients.get(payload1.sub));
        console.log("==> 1");
      }
      if (this.roomsqueu.includes(client)) {
        this.roomsqueu.splice(this.roomsqueu.indexOf(client), 1);
        console.log("==> 2");

      }
      if (this.clients.get(payload1.sub) != undefined) {
        this.clients.delete(payload1.sub);
        console.log("==> 3");
      }
      console.log(`Game Socket => Client disconnected: ${client.id}`);
    } catch (err) {
      console.log(err);
    }
  }


  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, payload: any): void {
    this.roomsqueu.push(client);
    if (this.roomsqueu.length == 2) {
      try {
        const { v4: uuidv4 } = require('uuid');
        const payload1 = verifyToken(this.roomsqueu.at(0).handshake.headers.cookie);
        const payload2 = verifyToken(this.roomsqueu.at(1).handshake.headers.cookie);

        let room: Room = new Room(this.roomsqueu.pop(), this.roomsqueu.pop());
        room.roomsId = uuidv4();

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

}

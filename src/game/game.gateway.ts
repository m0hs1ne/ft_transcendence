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
    // try {
    //   this.ValidateClient(client);
    // } catch (err) {
    //   console.log(err);
    // }
  }

  handleDisconnect(client: Socket) {
    try {
      const payload = verifyToken(client.handshake.headers.cookie);

      if (this.clients.has(payload.sub)) {
        this.clients.delete(payload.sub);
      }
      console.log(`Game Socket => Client disconnected: ${client.id}`);
    } catch (err) {
      console.log(`======> ${err}`);
    }
  }


  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, payload: any): void {
    if (this.ValidateClient(client) == 0)
      console.log("Player Already Join a queu or a room")
    else if (this.roomsqueu.includes(client) != undefined) {
      this.roomsqueu.push(client);
      if (this.roomsqueu.length == 2) {
        try {
          const { v4: uuidv4 } = require('uuid');
          const payload1 = verifyToken(this.roomsqueu.at(0).handshake.headers.cookie);
          const payload2 = verifyToken(this.roomsqueu.at(1).handshake.headers.cookie);
          let room: Room = new Room(this.roomsqueu.at(0), this.roomsqueu.at(1));
          room.roomId = uuidv4();
          console.log(`Room Id ${room.roomId}`);
          room.GameMode = payload.mode;
          room.RightPlayer.id = payload1.sub;
          room.LeftPlayer.id = payload2.sub;
          this.clients.set(payload1.sub, room.roomId);
          this.clients.set(payload2.sub, room.roomId)
          this.rooms.set(room.roomId, room);
          room.Play();
          this.roomsqueu.pop();
          this.roomsqueu.pop();
          console.log("Game Started");
        } catch (err) {
          console.log(err);
        }
      }
      else {
        console.log("Waiting");
      }
    }
  }

  ValidateClient(client: Socket): number {
    try {
      const payload = verifyToken(client.handshake.headers.cookie);
      if (this.clients.has(payload.sub)) {
        console.log("ALready exist")
        return 0;
      }
      else {
        this.clients.set(payload.sub, "room");
        console.log(`Game Socket => A Client Joined: ${client.id}`);
        return 1;
      }
    } catch (err) {
      console.log(err);
      return 0;
    }

  }

  @SubscribeMessage('PaddleUpdates')
  HandlePaddlesData(client: any, payload: any): void {
    if (payload.pos == "Left") 
    {
      if (this.rooms.has(payload.roomId)) {
      this.rooms.get(payload.roomId).LeftPlayer.Paddle = payload.Paddle;
      this.rooms.get(payload.roomId).RightPlayer.socket.emit('OpponentPaddle', {
        Paddle: payload.Paddle,
        id: this.rooms.get(payload.roomId).roomId,
      })
    }
    }
    else if (payload.pos == "Right") {
      if (this.rooms.has(payload.roomId)) {
        this.rooms.get(payload.roomId).RightPlayer.Paddle = payload.Paddle;
        this.rooms.get(payload.roomId).LeftPlayer.socket.emit('OpponentPaddle', {
          Paddle: payload.Paddle,
          id: this.rooms.get(payload.roomId).roomId,
        })
      }
    }
  }

  @SubscribeMessage('PlayerLeave')
  HandlePlayerLeave(client: any, payload: any): void 
  {
    if (this.rooms.has(payload.roomId)) 
    {
      this.rooms.get(payload.roomId).PlayerLeaves(payload.pos);
      this.clients.delete(this.rooms.get(payload.roomId).LeftPlayer.id);
      this.clients.delete(this.rooms.get(payload.roomId).RightPlayer.id);
      this.rooms.delete(payload.roomId);
    }
    if (this.rooms.get(payload.roomId)) {
      console.log("room still exist");
    }
  }

  @SubscribeMessage('DeleteRoom')
  DeleteRoom(client: any, payload: any): void 
  {
    if (this.rooms.has(payload.roomId)) {
      console.log("Delete room");
      if(this.clients.has(this.rooms.get(payload.roomId).LeftPlayer.id))
          console.log("Delete Client");
      this.clients.delete(this.rooms.get(payload.roomId).LeftPlayer.id);
      this.clients.delete(this.rooms.get(payload.roomId).RightPlayer.id);
      let room: Room = this.rooms[payload.roomId];
      this.rooms.delete(payload.roomId);
      room = null;
    }
    else
      console.log("No Room Found");
  }
}

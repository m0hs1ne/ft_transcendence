import { Socket } from 'socket.io';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Namespace } from 'socket.io';
import { Room } from './room';
import { v4 as uuidv4 } from 'uuid';
import { GameService } from './game.service';
import { verifyToken } from 'src/utils/guard';



@WebSocketGateway({ namespace: '/game' })
export class GameGateway {
  constructor(private readonly gameService: GameService) {
  }

  @WebSocketServer() server: Server;
  // dashboardNamespace: Namespace = this.server.of('/dashboard');
  private rooms: Map<string, Room> = new Map();
  private clients: Map<number,Socket> = new Map()
  private roomsqueu: Socket[] = [];

  handleConnection(client: Socket) {
    const payload = verifyToken(client.handshake.headers.cookie);
    this.clients.set(payload.sub, client)

    console.log(`A Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket)
  {
    console.log(`Client disconnected: ${client.id}`);
    if(this.roomsqueu.at(0) == client)
    {
      this.roomsqueu.pop();
    }
  }


  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, payload: any): void {
    console.log("JOinRoom");
    // let room = this.FindAvailableRoom();
    // console.log(payload);
    this.roomsqueu.push(client);

    if(this.roomsqueu.length == 2)
    {
      let room: Room = new Room();
      const { v4: uuidv4 } = require('uuid');

      room.RightPlayer = this.roomsqueu.pop();
      room.LeftPlayer = this.roomsqueu.pop();
      console.log(room.RightPlayer.id);
      console.log(room.LeftPlayer.id);
      room.roomsId = uuidv4();
      this.rooms[room.roomsId] = room;
      this.rooms[room.roomsId].Play();
      console.log("Game Started");
    }
    else
    {
      console.log("Waiting");
    }
  }
  @SubscribeMessage('PaddleUpdates')
  HandlePaddlesData(client: any, payload: any): void
  {
    if(payload.pos == "Left")
    {
      this.rooms[payload.roomId].LeftPlayerPaddle = payload.Paddle;
      this.rooms[payload.roomId].RightPlayer.emit('OpponentPaddle', {
        Paddle: payload.Paddle,
      })
      // console.log(payload.Paddle, payload.pos, payload.roomId);
    }
    else if(payload.pos == "Right")
    {
      this.rooms[payload.roomId].RightPlayerPaddle = payload.Paddle;
      this.rooms[payload.roomId].LeftPlayer.emit('OpponentPaddle', {
        Paddle: payload.Paddle,
      })
    }
    
  }
  
}

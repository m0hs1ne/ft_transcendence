import { Socket } from "socket.io";
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Namespace } from "socket.io";
import { Room } from "./room";
import { v4 as uuidv4 } from "uuid";
import { GameService } from "./game.service";
import { verifyToken } from "src/utils/guard";
import { LessThanOrEqual } from "typeorm";
import { StringifyOptions } from "querystring";

@WebSocketGateway({
  namespace: "/game",
  cors: {
    credentials: true,
    origin: "http://10.32.120.112:5173",
  },
})
export class GameGateway {
  constructor(private readonly gameService: GameService) {}

  @WebSocketServer() server: Server;
  private rooms: Map<string, Room> = new Map();
  private clients: Map<number, string> = new Map();
  private Queus: Map<number, Socket[]> = new Map();
  private Challenge: Map<number, Socket> = new Map();

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
      // console.log(`======> ${err}`);
    }
  }

  @SubscribeMessage("joinRoom")
  handleJoinRoom(client: Socket, payload: any): void {
    if (this.ValidateClient(client) == 0)
      console.log("Player Already Join a queu or a room");
    else this.CheckQueus(payload.mode, client);
  }

  ValidateClient(client: Socket): number {
    try {
      const payload = verifyToken(client.handshake.headers.cookie);
      if (this.clients.has(payload.sub)) {
        console.log("ALready exist");
        return 0;
      } else {
        this.clients.set(payload.sub, "room");
        console.log(`Game Socket => A Client Joined: ${client.id}`);
        return 1;
      }
    } catch (err) {
      console.log(err);
      return 0;
    }
  }

  CheckQueus(mode: number, client: Socket) {
    if (this.Queus.has(mode) == false) {
      console.log("true");
      let Queu: Socket[] = [];
      this.Queus.set(mode, Queu);
    }
    this.Queus.get(mode).push(client);
    if (this.Queus.get(mode).length == 2) {
      try {
        const { v4: uuidv4 } = require("uuid");
        const payload1 = verifyToken(
          this.Queus.get(mode).at(0).handshake.headers.cookie,
        );
        const payload2 = verifyToken(
          this.Queus.get(mode).at(1).handshake.headers.cookie,
        );
        let room: Room = new Room(
          this.Queus.get(mode).at(0),
          this.Queus.get(mode).at(1),
        );
        room.roomId = uuidv4();
        console.log(`Room Id ${room.roomId}`);
        room.GameMode = mode;
        room.RightPlayer.id = payload1.sub;
        room.LeftPlayer.id = payload2.sub;
        this.gameService.setInGame(payload1.sub, payload2.sub, true);
        this.clients.set(payload1.sub, room.roomId);
        this.clients.set(payload2.sub, room.roomId);
        this.rooms.set(room.roomId, room);
        room.Play();
        this.Queus.get(mode).pop();
        this.Queus.get(mode).pop();
        console.log("Game Started");
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("Waiting");
    }
  }

  @SubscribeMessage("PaddleUpdates")
  HandlePaddlesData(client: any, payload: any): void {
    if (payload.pos == "Left") {
      if (this.rooms.has(payload.roomId)) {
        this.rooms.get(payload.roomId).LeftPlayer.Paddle += payload.Paddle;
        this.rooms
          .get(payload.roomId)
          .RightPlayer.socket.emit("OpponentPaddle", {
            Paddle: payload.Paddle,
          });
      }
    } else if (payload.pos == "Right") {
      if (this.rooms.has(payload.roomId)) {
        this.rooms.get(payload.roomId).RightPlayer.Paddle += payload.Paddle;
        this.rooms
          .get(payload.roomId)
          .LeftPlayer.socket.emit("OpponentPaddle", {
            Paddle: payload.Paddle,
          });
      }
      // console.log("----> ",this.rooms.get(payload.roomId).LeftPlayer.Paddle);
    }
  }

  @SubscribeMessage("PlayerLeave")
  HandlePlayerLeave(client: any, payload: any): void {
    if (this.rooms.has(payload.roomId)) {
      this.rooms.get(payload.roomId).PlayerLeaves(payload.pos);
      this.UpdateDbScore(payload.roomId);
      this.clients.delete(this.rooms.get(payload.roomId).LeftPlayer.id);
      this.clients.delete(this.rooms.get(payload.roomId).RightPlayer.id);
      this.gameService.setInGame(
        this.rooms.get(payload.roomId).LeftPlayer.id,
        this.rooms.get(payload.roomId).RightPlayer.id,
        false,
      );

      this.rooms.delete(payload.roomId);
    }
    if (this.rooms.get(payload.roomId)) {
      console.log("room still exist");
    }
    try {
      const Payload = verifyToken(client.handshake.headers.cookie);
      if (this.Queus.get(payload.mode).includes(client)) {
        this.Queus.get(payload.mode).pop();
        this.clients.delete(Payload.sub);
        console.log("Removed from the queu");
      }
    } catch (err) {
      console.log(err);
    }
  }

  @SubscribeMessage("DeleteRoom")
  DeleteRoom(client: any, payload: any): void {
    if (this.rooms.has(payload.roomId)) {
      console.log("Delete room");
      this.UpdateDbScore(payload.roomId);
      if (this.clients.has(this.rooms.get(payload.roomId).LeftPlayer.id))
        console.log("Delete Client");
      this.clients.delete(this.rooms.get(payload.roomId).LeftPlayer.id);
      this.clients.delete(this.rooms.get(payload.roomId).RightPlayer.id);
      this.gameService.setInGame(
        this.rooms.get(payload.roomId).LeftPlayer.id,
        this.rooms.get(payload.roomId).RightPlayer.id,
        false,
      );
      this.rooms.delete(payload.roomId);
    } else console.log("No Room Found");
  }

  UpdateDbScore(roomId: any) {
    let left: number = this.rooms.get(roomId).LeftPlayer.id;
    let right: number = this.rooms.get(roomId).RightPlayer.id;
    let Winner: number = this.rooms.get(roomId).Winner;
    let GameMode: number = this.rooms.get(roomId).GameMode;
    let leftSCore = this.rooms.get(roomId).LeftPlayer.Score;
    let RightSCore = this.rooms.get(roomId).RightPlayer.Score;
    let Score: string = `${leftSCore} : ${RightSCore}`;
    console.log(Winner);

    this.gameService.create(left, right, Winner, Score, GameMode);
  }
  @SubscribeMessage("Chall")
  HandlleChallenges(client: any, payload: any): void {
    // console.log(payload);
    if (payload.type == "refuse") {
      console.log(payload);
    }
    if (payload.type == "challenger") {
      this.Challenge.set(payload.challId, client);
    } else if (payload.type == "opp") {
      if (this.Challenge.has(payload.challId)) {
        let room: Room = new Room(this.Challenge.get(payload.challId), client);
        room.roomId = uuidv4();
        room.GameMode = payload.mode;
        room.RightPlayer.id = payload.challId;
        room.LeftPlayer.id = payload.oponentId;
        this.gameService.setInGame(
          room.RightPlayer.id,
          room.LeftPlayer.id,
          true,
        );
        this.clients.set(room.LeftPlayer.id, room.roomId);
        this.clients.set(room.RightPlayer.id, room.roomId);
        this.rooms.set(room.roomId, room);
        room.RightPlayer.socket.emit("start");
        room.Play();
        console.log("Challenge Game Started");
      }
    }
  }
}

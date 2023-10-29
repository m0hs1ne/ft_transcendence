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
import { clients } from "src/chat_rooms/chat_rooms.gateway";
import { Req } from "@nestjs/common";
import { UsersService } from "src/users/users.service";

@WebSocketGateway({
  namespace: "/game",
  cors: {
    credentials: true,
    origin: "http://localhost:5173",
  },
})
export class GameGateway {
  constructor(private readonly gameService: GameService,
    private readonly userService: UsersService
    ) { }

  @WebSocketServer() server: Server;
  private rooms: Map<string, Room> = new Map();
  private clients: Map<number, string> = new Map();
  private Queus: Map<string, Socket[]> = new Map();
  private Challenge: Map<number, Socket> = new Map();
  private modes: any = {
    Classic: "20",
    Rapid: "14",
    Blitz: "3",
    Bullet: "1"
  }

  handleConnection(client: Socket) {
    try {
      verifyToken(client.handshake.headers.cookie);

    } catch (err) {
      console.log(err);
    }
  }

  async handleDisconnect(client: Socket, @Req() req) {
    try {
      const Payload = verifyToken(client.handshake.headers.cookie);
      if (this.rooms.has(this.clients.get(Payload.sub))) {
        if (this.rooms.get(this.clients.get(Payload.sub)).LeftPlayer.socket == client)
          this.rooms.get(this.clients.get(Payload.sub)).PlayerLeaves("Left");
        else
          this.rooms.get(this.clients.get(Payload.sub)).PlayerLeaves("Right");
        this.UpdateDbScore(this.clients.get(Payload.sub));
        this.gameService.setInGame(
          this.rooms.get(this.clients.get(Payload.sub)).LeftPlayer.id,
          this.rooms.get(this.clients.get(Payload.sub)).RightPlayer.id,
          false,
        );
        const cookie = verifyToken(req.handshake.cookie)
        const myfriends = await this.userService.getfriends(cookie.sub);
        if (myfriends) {
          for (const friend of myfriends) {
            const client = clients.get(friend.id);
            if (client) {
              client.emit("userStatus", { id: cookie.sub, inGame: false });
            }
          }
        }

        this.clients.delete(this.rooms.get(this.clients.get(Payload.sub)).LeftPlayer.id);
        this.clients.delete(this.rooms.get(this.clients.get(Payload.sub)).RightPlayer.id);
        this.rooms.delete(this.clients.get(Payload.sub));
      }
      else {
        if (this.clients.has(Payload.sub) && (this.Queus.has(this.modes.Classic) || this.Queus.has(this.modes.Rapid)
          || this.Queus.has(this.modes.Blitz) || this.Queus.has(this.modes.Bullet))) {
          if (this.Queus.get(this.modes.Classic).includes(client))
            this.Queus.get(this.modes.Classic).pop()
          else if (this.Queus.get(this.modes.Blitz).includes(client))
            this.Queus.get(this.modes.Blitz).pop()
          else if (this.Queus.get(this.modes.Blitz).includes(client))
            this.Queus.get(this.modes.Blitz).pop()
          else if (this.Queus.get(this.modes.Bullet).includes(client))
            this.Queus.get(this.modes.Bullet).pop()
          this.clients.delete(Payload.sub);
          this.clients.delete(Payload.sub);
        }

      }
    } catch (err) {
      console.log(err);
    }
  }
  @SubscribeMessage("joinRoom")
  handleJoinRoom(client: Socket, payload: any, @Req() req) 
  {
    if (!this.ValidateClient(client)) { }
    else
      this.CheckQueus(payload, client, req);
  }

  ValidateClient(client: Socket): number {
    try {
      const payload = verifyToken(client.handshake.headers.cookie);
      if (this.clients.has(payload.sub)) {
        return 0;
      } else {
        this.clients.set(payload.sub, "room");
        return 1;
      }
    } catch (err) {
      console.log(err);
      return 0;
    }
  }

  async CheckQueus(mode: string, client: Socket, @Req() req) 
  {
    if (!this.Queus.has(mode)) {
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
        console.log("parse mode : ", parseInt(mode), "mode : ", mode);
        
        room.mode = mode;
        room.GameMode = parseInt(mode);
        room.RightPlayer.id = payload1.sub;
        room.LeftPlayer.id = payload2.sub;
        this.gameService.setInGame(payload1.sub, payload2.sub, true);
        const cookie = verifyToken(req.handshake.cookie)
        const myfriends = await this.userService.getfriends(cookie.sub);
        if (myfriends) {
          for (const friend of myfriends) {
            const client = clients.get(friend.id);
            if (client) {
              client.emit("userStatus", { id: cookie.sub, inGame: true });
            }
          }
        }

        this.clients.set(payload1.sub, room.roomId);
        this.clients.set(payload2.sub, room.roomId);
        this.rooms.set(room.roomId, room);
        room.Play();
        this.Queus.get(mode).pop();
        this.Queus.get(mode).pop();
      } catch (err) {
        console.log(err);
      }
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
    }
  }

  @SubscribeMessage("PlayerLeave")
  async HandlePlayerLeave(client: any, payload: any, @Req() req) {
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
      const cookie = verifyToken(req.handshake.cookie)
      const myfriends = await this.userService.getfriends(cookie.sub);
      if (myfriends) {
        for (const friend of myfriends) {
          const client = clients.get(friend.id);
          if (client) {
            client.emit("userStatus", { id: cookie.sub, inGame: false });
          }
        }
      }
      this.rooms.delete(payload.roomId);
    }
    if (this.rooms.get(payload.roomId)) {
    }
    try {
      const Payload = verifyToken(client.handshake.headers.cookie);
      if (this.Queus.has(payload.mode)) {
        if (this.Queus.get(payload.mode).includes(client)) {
          this.Queus.get(payload.mode).pop();
          this.clients.delete(Payload.sub);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  @SubscribeMessage("DeleteRoom")
  async DeleteRoom(client: any, payload: any, @Req() req) {
    if (this.rooms.has(payload.roomId)) {
      this.UpdateDbScore(payload.roomId);
      if (this.clients.has(this.rooms.get(payload.roomId).LeftPlayer.id))
      {
          this.clients.delete(this.rooms.get(payload.roomId).LeftPlayer.id);
      }
      if (this.clients.has(this.rooms.get(payload.roomId).RightPlayer.id))
        this.clients.delete(this.rooms.get(payload.roomId).RightPlayer.id);
      this.gameService.setInGame(
        this.rooms.get(payload.roomId).LeftPlayer.id,
        this.rooms.get(payload.roomId).RightPlayer.id,
        false,
      );
      const cookie = verifyToken(req.handshake.cookie)
      const myfriends = await this.userService.getfriends(cookie.sub);
      if (myfriends) {
        for (const friend of myfriends) {
          const client = clients.get(friend.id);
          if (client) {
            client.emit("userStatus", { id: payload.sub, inGame: false });
          }
        }
      }
      this.rooms.delete(payload.roomId);
    }
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
    const leftSocket = clients.get(left)
    const rightSocket = clients.get(right)
    if (leftSocket)
      leftSocket.emit("Notification", {type: "updated", message: "A game was added"})
    if (rightSocket)
      rightSocket.emit("Notification", {type: "updated", message: "A game was added"})
  }
  @SubscribeMessage("Chall")
  async HandlleChallenges(client: any, payload: any, @Req() req) {
    if (payload.type == "refuse") {
      if (this.Challenge.has(payload.oponentId))
        this.Challenge.delete(payload.oponentId);
    }
    else if (payload.type == "challenger") {
      this.Challenge.set(payload.oponentId, client);
    }
    else if (payload.type == "opp") {
      if (this.Challenge.has(payload.oponentId)) {
        let room: Room = new Room(this.Challenge.get(payload.oponentId), client);
        room.roomId = uuidv4();
        room.GameMode = parseInt(payload.mode);
        room.RightPlayer.id = payload.challId;
        room.LeftPlayer.id = payload.oponentId;

        this.gameService.setInGame(room.RightPlayer.id, room.LeftPlayer.id, true);
        const cookie = verifyToken(req.handshake.cookie)
        const myfriends = await this.userService.getfriends(cookie.sub);
        if (myfriends) {
          for (const friend of myfriends) {
            const client = clients.get(friend.id);
            if (client) {
              client.emit("userStatus", { id: cookie.sub, inGame: true });
            }
          }
        }
        this.clients.set(room.LeftPlayer.id, room.roomId);
        this.clients.set(room.RightPlayer.id, room.roomId);
        this.rooms.set(room.roomId, room);
        room.RightPlayer.socket.emit("start");
        room.Play();
      }
    }
  }
}

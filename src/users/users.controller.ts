import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseFilters,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
  Query,
  BadRequestException,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import {
  generateRandomString,
  userAuthGuard,
  verifyToken,
} from "../utils/guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";
import { diskStorage } from "multer";
import { MessageBody } from "@nestjs/websockets";
import { ChatRoomsService } from "src/chat_rooms/chat_rooms.service";
import { GameService } from "src/game/game.service";

@UseGuards(userAuthGuard)
@Controller("users/")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly chatroomservice: ChatRoomsService,
    private readonly gameservice: GameService,
  ) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get("profile")
  findProfile(@Req() req) {
    const payload = verifyToken(req.headers.cookie);
    return this.usersService.myprofile(payload.sub);
  }

  @Get("profile/:id")
  findOtherProfile(@Param("id") id, @Req() req) {
    const payload = verifyToken(req.headers.cookie);
    return this.usersService.profile(id, payload);
  }

  @Patch("profile/update")
  async update(@MessageBody() body, @Req() req) {
    const { username } = body;
    if (typeof username != "string") return;
    const payload = verifyToken(req.headers.cookie);
    return await this.usersService.update(payload.sub, username);
  }

  @Patch("profile/validsession")
  async updatevalidsession(@MessageBody() body, @Req() req) {
    const { validSession } = body;
    if (typeof validSession != "boolean") return;
    const payload = verifyToken(req.headers.cookie);
    return await this.usersService.updatesession(payload.sub, validSession);
  }

  //friends
  @Get("friends")
  getFriends(@Req() req) {
    const payload = verifyToken(req.headers.cookie);
    return this.usersService.getfriends(payload.sub);
  }

  @Post("/game")
  async addgame(@MessageBody() body, @Req() req) {
    const { user1Id, user2Id, winner, leftSCore, rightSCore, mode } = body;

    console.log(body);
    this.gameservice.create(
      user1Id,
      user2Id,
      winner,
      leftSCore + " : " + rightSCore,
      mode,
    );
  }

  @Post("friends")
  async addFriends(@MessageBody() body, @Req() req) {
    const { id } = body;
    if (typeof id === "number")
      return await this.usersService.addfriends(id, req);
    else throw new BadRequestException();
  }

  @Delete("friends/:id")
  removeFriends(@Param("id") id, @Req() req) {
    return this.usersService.removefriends(+id, req);
  }

  //Blocked
  @Get("blocked")
  getBlocked(@Req() req) {
    const payload = verifyToken(req.headers.cookie);
    return this.usersService.getblocked(payload.sub);
  }

  @Post("blocked")
  addBlocked(@MessageBody() body, @Req() req) {
    //expected: id: user to block
    const { id } = body;
    if (typeof id === "number") return this.usersService.addblocked(id, req);
  }

  @Delete("blocked/:id")
  removeBlocked(@Param("id") id, @Req() req) {
    if (typeof id === "number") return this.usersService.removeblocked(id, req);
  }

  @Post("upload_avatar")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "public/img",
        filename: (req, file, cb) => {
          const filename = generateRandomString(10) + "_" + file.originalname;
          cb(null, filename);
          file.originalname = filename;
        },
      }),
    }),
  )
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: ".(png|jpeg|jpg)" }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() req,
  ) {
    const payload = verifyToken(req.headers.cookie);
    this.usersService.uploadAvatar(file, payload);
    return {
      statusCode: 200,
      data: "http://10.32.120.112:3000/" + file.filename,
    };
  }
  //Leaderboard
  @Get("leaderboard")
  getleaderboard() {
    return this.usersService.getleaders();
  }

  @Post("search")
  async search(@MessageBody() body, @Req() req) {
    const { query } = body;
    const payload = verifyToken(req.headers.cookie);
    const users = await this.usersService.search(query);
    const chatrooms = await this.chatroomservice.search(query, payload.sub);
    return { users, chatrooms };
  }
}

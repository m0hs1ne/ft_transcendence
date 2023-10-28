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
  Res,
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
import { clients } from "src/chat_rooms/chat_rooms.gateway";
import { profile } from "console";

@UseGuards(userAuthGuard)
@Controller("users/")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly chatroomservice: ChatRoomsService,
    private readonly gameservice: GameService,
  ) {}

  @Get("profile")
  async findProfile(@Req() req,@Res() res) {
    try
    {
      const payload = verifyToken(req.headers.cookie);
      res.send( await this.usersService.myprofile(payload.sub));
    }
    catch(e)
    {
      //res.statusCode = e.status
      res.send({message: e.message, result: "error"})
    }
  }

  @Get("profile/:id")
  async findOtherProfile(@Param("id") id, @Req() req, @Res() res) {
    try
    {
      if (isNaN(id))
        throw new BadRequestException("Id should be an integer number.")
      const payload = verifyToken(req.headers.cookie);
      res.send( await this.usersService.profile(id, payload));
    }
    catch(e)
    {
      //res.statusCode = e.status
      res.send({message: e.message, result: "error"})
    }
  }

  @Patch("profile/update")
  async update(@MessageBody() body, @Req() req, @Res() res) {
    const { username } = body;
    try
    {
      if (typeof username != "string") throw new BadRequestException("Username should be a string.");
      const payload = verifyToken(req.headers.cookie);
      const message =await this.usersService.update(payload.sub, username);
      const client = clients.get(payload.sub)
      if (client)
        client.emit('Notification', {type: "updated", message: "Username updated Succesfully"})
      res.send(message);
    }
    catch(e)
    {
      //res.statusCode = e.status
      res.send({message: e.message, result: "error"})
    }
  }

  @Patch("profile/validsession")
  async updatevalidsession(@MessageBody() body, @Req() req, @Res() res) {
    const { validSession } = body;
    try
    {
      if (typeof validSession != "boolean") throw new BadRequestException("validSession should be a boolean.");
      const payload = verifyToken(req.headers.cookie);
      const message = await this.usersService.updatesession(payload.sub, validSession);
      const client = clients.get(payload.sub)
      if (client)
        client.emit('Notification', {type: "updated", message: "validSession updated Succesfully"})
      res.send(message);
    }
    catch(e)
    {
      //res.statusCode = e.status
      res.send({message: e.message, result: "error"})
    }
  }

  //friends
  @Get("friends")
  async getFriends(@Req() req, @Res() res) {
    try
    {
      const payload = verifyToken(req.headers.cookie);
      res.send(await this.usersService.getfriends(payload.sub));
    }
    catch(e)
    {
      //res.statusCode = e.status
      res.send({message: e.message, result: "error"})
    }
  }

  @Post("/game")
  async addgame(@MessageBody() body, @Req() req, @Res() res) {
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
  async addFriends(@MessageBody() body, @Req() req, @Res() res) {
    const { id } = body;
    try
    {
      const payload = verifyToken(req.headers.cookie);
      if (!isNaN(id))
      {
        const message =  await this.usersService.addfriends(id, req);
        const client = clients.get(payload.sub)
        const friend = clients.get(id)
        if (friend)
        {
          const me = await this.usersService.findOne(payload.sub)
          if (me)
            friend.emit('Notification', {type: "updated", message: `${me.username} added you to his friends`})
        }
        if (client)
        {
          const other = await this.usersService.findOne(id)
          if (other)
            client.emit('Notification', {type: "updated", message: `${other.username} was added to your friends`})
        }
        res.send(message);
      }
      else throw new BadRequestException("Id should be an integer number.")
    }
    catch(e)
    {
      //res.statusCode = e.status
      res.send({message: e.message, result: "error"})
    }
  }

  @Delete("friends/:id")
  async removeFriends(@Param("id") id, @Req() req, @Res() res) {
    try
    {
    if (isNaN(id))
      throw new BadRequestException("Id should be an integer number.")
    const payload = verifyToken(req.headers.cookie);
    const client = clients.get(payload.sub)
    const message = this.usersService.removefriends(+id, req)
      const friend = clients.get(id)
      if (friend)
      {
        const me = await this.usersService.findOne(payload.sub)
        if (me)
          friend.emit('Notification', {type: "updated", message: `${me.username} removed you from his friends`})
      }
      if (client)
      {
        const other = await this.usersService.findOne(id)
        if (other)
          client.emit('Notification', {type: "updated", message: `${other.username} removed from your friends`})
      }
    res.send(message);
    }
    catch(e)
    {
      //res.statusCode = e.status
      res.send({message: e.message, result: "error"})
    }

  }

  //Blocked
  @Get("blocked")
  async getBlocked(@Req() req, @Res() res) {
    try
    {
    const payload = verifyToken(req.headers.cookie);
    res.send(await this.usersService.getblocked(payload.sub));
    }
    catch(e)
    {
      //res.statusCode = e.status
      res.send({message: e.message, result: "error"})
    }
  }

  @Post("blocked")
  async addBlocked(@MessageBody() body, @Req() req, @Res() res) {
    //expected: id: user to block
    const { id } = body;
    try
    {
      if (!isNaN(id)) res.send( await this.usersService.addblocked(id, req));
      else  throw new BadRequestException("Id should be an integer number.")
    }
    catch(e)
    {
      //res.statusCode = e.status
      res.send({message: e.message, result: "error"})
    }
  }

  @Delete("blocked/:id")
  async removeBlocked(@Param("id") id, @Req() req,@Res() res) {
    try
    {
      if (!isNaN(id)) res.send(await this.usersService.removeblocked(id, req));
      else throw new BadRequestException("Id should be an integer number.")
    }
    catch(e)
    {
      //res.statusCode = e.status
      res.send({message: e.message, result: "error"})
    }
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
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: ".(png|jpeg|jpg)" }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() req,@Res() res,
  ) {
    try
    {
      const payload = verifyToken(req.headers.cookie);
      this.usersService.uploadAvatar(file, payload);
      const client = clients.get(payload.sub)
      if (client)
      { 
          client.emit('Notification', {type: "updated", message: `Avatar was updated successfully`})
      }
      res.send( {
        data: "http://localhost:3000/" + file.filename,
      })
    }
    catch(e)
    {
      //res.statusCode = e.status
      res.send({message: e.message, result: "error"})
    }
  }
  //Leaderboard
  @Get("leaderboard")
  getleaderboard() {
    return this.usersService.getleaders();
  }

  @Post("search")
  async search(@MessageBody() body, @Req() req,@Res() res) {
    const { query } = body;
    try
    {
      //if (typeof query == 'string') throw new BadRequestException("Query should be an integer string.")
      const payload = verifyToken(req.headers.cookie);
      const users = await this.usersService.search(query);
      const chatrooms = await this.chatroomservice.search(query, payload.sub);
      res.send({ users, chatrooms });
    }
    catch(e)
    {
      //res.statusCode = e.status
      res.send({message: e.message, result: "error"})
    }
  }
}

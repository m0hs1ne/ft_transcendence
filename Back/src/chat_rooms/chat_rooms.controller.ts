import { BadRequestException, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { generateRandomString, userAuthGuard, verifyToken } from 'src/utils/guard';
import { ChatRoomsService } from './chat_rooms.service';
import { UsersService } from 'src/users/users.service';
import { UserChatService } from 'src/user_chat/user_chat.service';
import { MessageBody } from '@nestjs/websockets';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';


@UseGuards(userAuthGuard)
@Controller('chat-rooms/')
export class ChatRoomsController {
    constructor(private readonly chatroomservice: ChatRoomsService
        ,private readonly userservice: UsersService
        ,private readonly userchatservice: UserChatService) {}

    @Get()
    async myChatRoom(@Req() req, @Res() res){
      try
      {
        const payload = verifyToken(req.headers.cookie)
        const chatrooms = await this.chatroomservice.findMyChatRooms(payload.sub);
        res.send(chatrooms)
      }
      catch(e){
        res.send({message: e.message, result: "error"})
      }
    }
    
    @Get('/DM_chatrooms')
    async all(@Req() req, @Res() res){
      try
      {
        const payload = verifyToken(req.headers.cookie)
        const invitations = await this.chatroomservice.getInvitationOfUser(
          payload.sub,
        );
        const chatrooms = await this.chatroomservice.findMyChatRooms(payload.sub);
        const friends = await this.userservice.getfriends(payload.sub)
        let result = [];
        result = result.concat(friends)
        result = result.concat(chatrooms)
        if (result.length == 1 && !result[0])
          res.send({result:[], invitations})
        else
          res.send({result, invitations});
      }
      catch(e){
        res.send({message: e.message, result: "error"})
      }
    }

    @Get('myrole/:id')
    async myrole(@Param('id') id, @Req() req, @Res() res)
    {
      try
      {
        if (isNaN(id))
          throw new BadRequestException()
        const payload = verifyToken(req.headers.cookie)
        const role = await this.userchatservice.myrole(id, payload.sub)
        res.send(role)
      }
      catch(e){
        res.send({message: e.message, result: "error"})
      }
    }
    
    @Get(':id')
    async chatroomDetails(@Param('id') id, @Req() req, @Res() res){
      try
      {
        if (isNaN(id))
          throw new BadRequestException()
        const payload = verifyToken(req.headers.cookie)
        const members = await this.chatroomservice.getChatMember(id);
        const messages = await this.chatroomservice.getMessages('chat', id, payload)
        const props = await this.chatroomservice.findOneById(id)
        let details = {id:payload.sub, chatId: props.id, title:props.title, members, messages}
        res.send( details)
      } 
        catch(e){
          res.send({message: e.message, result: "error"})
        }
    }

    // @Delete(':id')
    // async delChatroom(@Param('id') id, @Req() req){
    //     const payload = verifyToken(req.headers.cookie)
    //     await this.chatroomservice.remove(id, payload);
    // }

    @Post('upload_avatar/:id')
    @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: 'public/img',
      filename: (req, file, cb) => {
        const filename = file.originalname + '_' + generateRandomString(10);
        cb(null, filename);
        file.originalname = filename
      },
    }),
    }))
    uploadFile(@UploadedFile(new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
      }),) file: Express.Multer.File, @Param('id') id: number,@Req() req, @Res() res) {
        try
        {
        if (isNaN(id))
          throw new BadRequestException()
        const payload = verifyToken(req.headers.cookie);
        this.chatroomservice.uploadAvatar(file, id, payload)
        res.send( {
          statusCode: 200,
          data: file.path,
        })
      }catch(e){
        res.send({message: e.message, result: "error"})
      }
      }
}

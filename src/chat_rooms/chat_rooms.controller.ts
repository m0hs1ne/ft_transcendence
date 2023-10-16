import { Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
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
    async myChatRoom(@Req() req){
        const payload = verifyToken(req.headers.cookie)
        const chatrooms = await this.chatroomservice.findMyChatRooms(payload);
        return chatrooms
    }
    
    @Get('/DM_chatrooms')
    async all(@Req() req){
        const payload = verifyToken(req.headers.cookie)
        const chatrooms = await this.chatroomservice.findMyChatRooms(payload);
        const friends = await this.userservice.getfriends(payload.sub)
        return friends.concat(chatrooms)
    }

    @Get('myrole/:id')
    async myrole(@Param('id') id, @Req() req)
    {
        const payload = verifyToken(req.headers.cookie)
        const role = await this.userchatservice.myrole(id, payload.sub)
        return role
    }
    
    @Get(':id')
    async chatroomDetails(@Param('id') id, @Req() req){
        const payload = verifyToken(req.headers.cookie)
        const members = await this.chatroomservice.getChatMember(id);
        const messages = await this.chatroomservice.getMessages('chat', id, payload)
        let details = {id:payload.sub, members, messages}
        return details
    }

    @Delete(':id')
    async delChatroom(@Param('id') id, @Req() req){
        const payload = verifyToken(req.headers.cookie)
        await this.chatroomservice.remove(id, payload);
    }

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
      }),) file: Express.Multer.File, @Param('id') id: number,@Req() req) {
        const payload = verifyToken(req.headers.cookie);
        this.chatroomservice.uploadAvatar(file, id, payload)
        return {
          statusCode: 200,
          data: file.path,
        };
      }
}

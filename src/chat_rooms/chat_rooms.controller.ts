import { Controller, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import { userAuthGuard, verifyToken } from 'src/utils/guard';
import { ChatRoomsService } from './chat_rooms.service';
import { UsersService } from 'src/users/users.service';

@UseGuards(userAuthGuard)
@Controller('chat-rooms/')
export class ChatRoomsController {
    constructor(private readonly chatroomservice: ChatRoomsService
        ,private readonly userservice: UsersService) {}

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
        return {friends, chatrooms}
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
}
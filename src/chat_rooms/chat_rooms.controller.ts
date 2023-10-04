import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { userAuthGuard, verifyToken } from 'src/utils/guard';
import { ChatRoomsService } from './chat_rooms.service';

@UseGuards(userAuthGuard)
@Controller('chat-rooms/')
export class ChatRoomsController {
    constructor(private readonly chatroomservice: ChatRoomsService) {}

    @Get(':id')
    async chatroomDetails(@Param('id') id, @Req() req){
        const payload = verifyToken(req.headers.cookie)
        const members = await this.chatroomservice.getChatMember(id);
        const messages = await this.chatroomservice.getMessages('chat', id, payload)
        let details = {id:payload.sub, members, messages}
        return details
    }
}

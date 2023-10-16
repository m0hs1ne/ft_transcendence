import { Module } from '@nestjs/common';
import { ChatRoomsService } from './chat_rooms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chat_room.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { UserChat } from 'src/user_chat/entities/user_chat.entity';
import { UserChatService } from 'src/user_chat/user_chat.service';
import { ChatRoomsGateway } from './chat_rooms.gateway';
import { ChatRoomInv } from './entities/invitation.entity';
import { Message } from 'src/message/entities/message.entity';
import { ChatRoomsController } from './chat_rooms.controller';
import { Game } from 'src/game/entities/game.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game, ChatRoom, User, UserChat, ChatRoomInv, Message]),
  ],
  controllers: [ChatRoomsController],
  providers: [UserChatService, ChatRoomsGateway, ChatRoomsService, UsersService, UserChatService,JwtService]
})
export class ChatRoomsModule {}

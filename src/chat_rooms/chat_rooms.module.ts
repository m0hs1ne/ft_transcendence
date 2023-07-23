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

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatRoom, User, UserChat]),
  ],
  providers: [ChatRoomsGateway, ChatRoomsService, UsersService, UserChatService,JwtService]
})
export class ChatRoomsModule {}

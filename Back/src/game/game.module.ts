import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from 'src/chat_rooms/entities/chat_room.entity';
import { ChatRoomInv } from 'src/chat_rooms/entities/invitation.entity';
import { Message } from 'src/message/entities/message.entity';
import { UserChat } from 'src/user_chat/entities/user_chat.entity';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { AchievementService } from 'src/achievement/achievement.service';
import { ChatRoomsService } from 'src/chat_rooms/chat_rooms.service';
import { UsersService } from 'src/users/users.service';
import { Game } from './entities/game.entity';
import { Achievement } from 'src/achievement/entities/achievement.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game, ChatRoom, User, UserChat, ChatRoomInv, Message, Achievement]),
  ],
  providers: [GameService, GameGateway, ChatRoomsService, AchievementService, UsersService,JwtService]
})
export class GameModule {}
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ChatRoomsService } from 'src/chat_rooms/chat_rooms.service';
import { Achievement } from 'src/achievement/entities/achievement.entity';;
import { AchievementService } from 'src/achievement/achievement.service';
import { ChatRoom } from 'src/chat_rooms/entities/chat_room.entity';
import { UserChat } from 'src/user_chat/entities/user_chat.entity';
import { ChatRoomInv } from 'src/chat_rooms/entities/invitation.entity';
import { Message } from 'src/message/entities/message.entity';
import { Game } from 'src/game/entities/game.entity';
import { GameService } from 'src/game/game.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game, Achievement, ChatRoom, User, UserChat, ChatRoomInv, Message]),
  ],
  controllers: [UsersController],
  providers: [ChatRoomsService, AchievementService, GameService,UsersService,JwtService]
})
export class UsersModule {}

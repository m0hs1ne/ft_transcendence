import { Module } from '@nestjs/common';
import { ChatRoomsService } from './chat_rooms.service';
import { ChatRoomsController } from './chat_rooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chat_room.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatRoom]),
  ],
  controllers: [ChatRoomsController],
  providers: [ChatRoomsService, JwtService]
})
export class ChatRoomsModule {}

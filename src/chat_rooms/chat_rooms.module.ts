import { Module } from '@nestjs/common';
import { ChatRoomsService } from './chat_rooms.service';
import { ChatRoomsController } from './chat_rooms.controller';

@Module({
  controllers: [ChatRoomsController],
  providers: [ChatRoomsService]
})
export class ChatRoomsModule {}

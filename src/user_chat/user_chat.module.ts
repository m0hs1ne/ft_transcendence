import { Module } from '@nestjs/common';
import { UserChatService } from './user_chat.service';
import { UserChatController } from './user_chat.controller';

@Module({
  controllers: [UserChatController],
  providers: [UserChatService]
})
export class UserChatModule {}

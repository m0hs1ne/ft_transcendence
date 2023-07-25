import { Module } from '@nestjs/common';
import { UserChatService } from './user_chat.service';

@Module({
  providers: [UserChatService]
})
export class UserChatModule {}

import { Module } from '@nestjs/common';
import { UserChatService } from './user_chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserChat } from './entities/user_chat.entity';
import { UsersController } from 'src/users/users.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserChat]),
  ],
  providers: [UserChatService, JwtService]
})
export class UserChatModule {}

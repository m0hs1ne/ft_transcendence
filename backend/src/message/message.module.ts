import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
  ],
  providers: [MessageService, JwtService]
})
export class MessageModule {}

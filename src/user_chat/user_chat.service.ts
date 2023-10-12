import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserChatDto } from './dto/create-user_chat.dto';
import { UpdateUserChatDto } from './dto/update-user_chat.dto';
import { UserChat } from './entities/user_chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserChatService {
  constructor(
    @InjectRepository(UserChat) private readonly userChatRepository: Repository<UserChat>,
  ) {}

  async myrole(chatId, id)
  {
      const role = this.userChatRepository.findOne({
        select: ['role'],
        where: {userId: id, chatRoomId: chatId}
      })
      if (!role)
        throw new NotFoundException();
      return role
  }
}

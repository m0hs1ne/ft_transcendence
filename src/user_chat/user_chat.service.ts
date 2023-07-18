import { Injectable } from '@nestjs/common';
import { CreateUserChatDto } from './dto/create-user_chat.dto';
import { UpdateUserChatDto } from './dto/update-user_chat.dto';

@Injectable()
export class UserChatService {
  create(createUserChatDto: CreateUserChatDto) {
    return 'This action adds a new userChat';
  }

  findAll() {
    return `This action returns all userChat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userChat`;
  }

  update(id: number, updateUserChatDto: UpdateUserChatDto) {
    return `This action updates a #${id} userChat`;
  }

  remove(id: number) {
    return `This action removes a #${id} userChat`;
  }
}

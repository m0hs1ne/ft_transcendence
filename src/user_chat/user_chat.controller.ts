import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserChatService } from './user_chat.service';
import { CreateUserChatDto } from './dto/create-user_chat.dto';
import { UpdateUserChatDto } from './dto/update-user_chat.dto';

@Controller('user-chat')
export class UserChatController {
  constructor(private readonly userChatService: UserChatService) {}

  @Post()
  create(@Body() createUserChatDto: CreateUserChatDto) {
    return this.userChatService.create(createUserChatDto);
  }

  @Get()
  findAll() {
    return this.userChatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userChatService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserChatDto: UpdateUserChatDto) {
    return this.userChatService.update(+id, updateUserChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userChatService.remove(+id);
  }
}

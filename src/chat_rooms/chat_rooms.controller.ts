import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseFilters } from '@nestjs/common';
import { ChatRoomsService } from './chat_rooms.service';
import { CreateChatRoomDto } from './dto/create-chat_room.dto';
import { UpdateChatRoomDto } from './dto/update-chat_room.dto';
import { userAuthGuard } from 'src/utils/guard';
import { UserExistExceptionFilter } from 'src/exceptions/ExistException.filter';

@UseGuards(userAuthGuard)
@Controller('chat-rooms')
export class ChatRoomsController {
  constructor(private readonly chatRoomsService: ChatRoomsService) {}

  @Post()
  @UseFilters(UserExistExceptionFilter)
  create(@Body() createChatRoomDto: CreateChatRoomDto, @Req() req) {
    return this.chatRoomsService.create(createChatRoomDto, req);
  }

  @Get()
  findAll() {
    return this.chatRoomsService.findAll();
  }

  @Get(':title')
  findOne(@Param('title') title: string) {
    return this.chatRoomsService.findOne(title);
  }

  @Patch(':title')
  @UseFilters(UserExistExceptionFilter)
  update(@Param('title') title: string, @Body() updateChatRoomDto: UpdateChatRoomDto, @Req() req) {
    return this.chatRoomsService.update(title, updateChatRoomDto, req);
  }

  @Delete(':title')
  remove(@Param('title') title: string, @Req() req) {
    return this.chatRoomsService.remove(title, req);
  }
}

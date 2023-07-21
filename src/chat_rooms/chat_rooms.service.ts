import { Injectable, NotAcceptableException, NotFoundException, Req, UseFilters } from '@nestjs/common';
import { CreateChatRoomDto } from './dto/create-chat_room.dto';
import { UpdateChatRoomDto } from './dto/update-chat_room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chat_room.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { verifyToken } from 'src/utils/guard';
import { NotFoundError } from 'rxjs';
import { UserExistExceptionFilter } from 'src/exceptions/ExistException.filter';

@Injectable()
export class ChatRoomsService {
  constructor(
    @InjectRepository(ChatRoom) private readonly chatRoomRepository: Repository<ChatRoom>,
  ) {}

  async create(createChatRoomDto: CreateChatRoomDto, @Req() req) {
    const payload = verifyToken(req.headers.cookie);
    createChatRoomDto.owner = payload.sub;
    if (createChatRoomDto.privacy != 'protected' &&
        createChatRoomDto.privacy != 'private' &&
        createChatRoomDto.privacy != 'public')
        {
          createChatRoomDto.privacy = 'public';
        }
    if (createChatRoomDto.privacy == 'protected' && !createChatRoomDto.ifProtectedPass)
      throw new NotAcceptableException();
      
    const chatroom = await this.chatRoomRepository.create(createChatRoomDto);
    const newChat = await this.chatRoomRepository.save(chatroom);
    return {
      id: newChat.id,
      title: newChat.title,
      owner: newChat.owner,
      privacy: newChat.privacy,
    };
  }

  async findAll() {
    return await this.chatRoomRepository.find({
      select: ['id', 'title', 'owner', 'privacy'],
    });
  }
 
  async findOne(title: string) {
    const options: FindOneOptions<ChatRoom> = {
      where: {title},
    }
    const one = await this.chatRoomRepository.findOne(options)
    if (!one)
      throw new NotFoundException()
    return {
      id: one.id,
      title: one.title,
      owner: one.owner,
      privacy: one.privacy,
    };
  }

  async update(title: string, updateChatRoomDto: UpdateChatRoomDto, @Req() req) {
    const payload = verifyToken(req.headers.cookie);
    const options: FindOneOptions<ChatRoom> = {
      where: {title},
    }
    const chat = await this.chatRoomRepository.findOne(options)
    if (chat && chat.owner == payload.sub)
    {
      if (updateChatRoomDto.privacy != 'protected' &&
        updateChatRoomDto.privacy != 'private' &&
        updateChatRoomDto.privacy != 'public')
        updateChatRoomDto.privacy = 'public';

      if (updateChatRoomDto.privacy == 'protected' && !updateChatRoomDto.ifProtectedPass)
        throw new NotAcceptableException();
        chat.title = updateChatRoomDto.title;
        chat.privacy = updateChatRoomDto.privacy;
        chat.ifProtectedPass = updateChatRoomDto.ifProtectedPass
      await this.chatRoomRepository.save(chat)
      return `Chat ${title} was updated!` 
    }
    else
      throw new NotFoundException();
  }

  async remove(title: string, @Req() req) {
    const payload = verifyToken(req.headers.cookie);
    const chat = await this.findOne(title)
    if (chat.owner == payload.sub)
      this.chatRoomRepository.delete({id: chat.id})
  }
}

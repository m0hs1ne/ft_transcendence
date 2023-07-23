import { Injectable, NotAcceptableException, NotFoundException, Req, UseFilters } from '@nestjs/common';
import { CreateChatRoomDto } from './dto/create-chat_room.dto';
import { UpdateChatRoomDto } from './dto/update-chat_room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chat_room.entity';
import { FindOneOptions, FindOptionsWhere, In, QueryFailedError, Repository } from 'typeorm';
import { verifyToken } from 'src/utils/guard';
import { NotFoundError } from 'rxjs';
import { UserExistExceptionFilter } from 'src/exceptions/ExistException.filter';
import { UserChatService } from 'src/user_chat/user_chat.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { UserChat } from 'src/user_chat/entities/user_chat.entity';

@Injectable()
export class ChatRoomsService {
  constructor(
    @InjectRepository(ChatRoom) private readonly chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserChat) private readonly userChatRepository: Repository<UserChat>
  ) {}

  async create(createChatRoomDto: CreateChatRoomDto, @Req() req) {
    const payload = verifyToken(req.handshake.headers.cookie);
    if (createChatRoomDto.privacy != 'protected' &&
        createChatRoomDto.privacy != 'private' &&
        createChatRoomDto.privacy != 'public')
        {
          return 'Not Acceptable';
        }
    if (createChatRoomDto.privacy == 'protected' && !createChatRoomDto.ifProtectedPass)
      return 'Not Acceptable';
    createChatRoomDto.owner = payload.sub
    const chatroom = await this.chatRoomRepository.create(createChatRoomDto);
    const newChat = await this.chatRoomRepository.save(chatroom);
    if(!newChat)
      return 'Not Acceptable';
    let options: FindOneOptions<User> = {
      where: {id: payload.sub},
    }
    const ownerObj = await this.userRepository.findOne(options);
    let optionschat: FindOneOptions<ChatRoom> = {
      where: {id: newChat.id},
    }
    const userChatRel = await this.userChatRepository.create({
      userId: payload.sub,
      chatRoomId: newChat.id,
      userStatus: "normal",
      role: "owner",
      user: ownerObj,
      chatRoom: newChat
    })
    await this.userChatRepository.save(userChatRel)
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
      where: {
        privacy: In(['public', 'protected'])
      }
    
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
    const payload = verifyToken(req.handshake.headers.cookie);
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
        return "Not Acceptable"
        chat.title = updateChatRoomDto.title;
        chat.privacy = updateChatRoomDto.privacy;
        chat.ifProtectedPass = updateChatRoomDto.ifProtectedPass
      return await this.chatRoomRepository.save(chat)
    }
    else
      return "Not Found"
  }

  async remove(title, @Req() req) {
    const payload = verifyToken(req.handshake.headers.cookie);
    const chat = await this.findOne(title.title)
    
    if (chat && chat.owner == payload.sub)
      this.chatRoomRepository.delete({id: chat.id})
    else
      return 'Not Acceptable'
  }
}

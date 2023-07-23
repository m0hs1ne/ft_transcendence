import { Injectable, NotAcceptableException, NotFoundException, Req, UseFilters } from '@nestjs/common';
import { CreateChatRoomDto } from './dto/create-chat_room.dto';
import { UpdateChatRoomDto } from './dto/update-chat_room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chat_room.entity';
import { FindOneOptions, FindOptionsWhere, In, QueryFailedError, RemoveOptions, Repository } from 'typeorm';
import { verifyToken } from 'src/utils/guard';
import { NotFoundError } from 'rxjs';
import { UserExistExceptionFilter } from 'src/exceptions/ExistException.filter';
import { UserChatService } from 'src/user_chat/user_chat.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { UserChat } from 'src/user_chat/entities/user_chat.entity';
import { ChatRoomInv } from './entities/invitation.entity';

@Injectable()
export class ChatRoomsService {
  constructor(
    @InjectRepository(ChatRoom) private readonly chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserChat) private readonly userChatRepository: Repository<UserChat>,
    @InjectRepository(ChatRoomInv) private readonly invitationRepository: Repository<ChatRoomInv>
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

  async isAdmin(userId: number, chatRoomId: number)
  {
    const options: FindOneOptions<UserChat> = {
      where: {userId, chatRoomId},
    }
    const relation = await this.userChatRepository.findOne(options);
    if (relation && (relation.role == 'admin' || relation.role == 'owner'))
      return true
    console.log("false")
    return false
  }

  async acceptInviteToChat(body, payload)
  {
    const options: FindOneOptions<ChatRoomInv> = {
      where: {id: body.id},
    }
    const invite = await this.invitationRepository.findOne(options)
    if (!invite || invite.toId != payload.sub)
      return "Not Allowed"
    const userChat = await this.userChatRepository.create({
      userId: invite.toId,
      chatRoomId: invite.chatRoomId,
      userStatus: "normal",
      role: "member"
    })
    await this.userChatRepository.save(userChat)
  }

  async inviteUserToPrivate(id: number, title: string, payload)
  {
    const chat = await this.findOne(title)
    const isAdmin = await this.isAdmin(payload.sub, chat.id)
    if (chat && chat.privacy == "private" && isAdmin)
    {
      const options: FindOneOptions<User> = {
        select: ['id', 'username', 'avatar'], 
        where: {id: payload.sub},
      }
      const owner = await this.userRepository.findOne(options)
      const invite = await this.invitationRepository.create({
        title,
        chatRoomId: chat.id,
        fromId: owner.id,
        toId: id
      })
      if (invite)
      {
        const inviteChat = await this.invitationRepository.save(invite)
        return {
          id: inviteChat.id,
          title,
          from: owner
        }
      }
      else
        return "Failed to send"
    }
    else
      return "Not Owner Or Admin"
  }
  async removeInvitation(id: string)
  {
    const options: FindOneOptions<ChatRoomInv> = {
      where: {id},
    }
    const entityToRemove = await this.invitationRepository.findOne(options);
    this.invitationRepository.remove(entityToRemove)
  }

}


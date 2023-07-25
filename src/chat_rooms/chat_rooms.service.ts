import { BadRequestException, ForbiddenException, Injectable, NotAcceptableException, NotFoundException, UnauthorizedException} from '@nestjs/common';
import { CreateChatRoomDto } from './dto/create-chat_room.dto';
import { UpdateChatRoomDto } from './dto/update-chat_room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chat_room.entity';
import { FindManyOptions, FindOneOptions, In, MoreThan, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { UserChat } from 'src/user_chat/entities/user_chat.entity';
import { ChatRoomInv } from './entities/invitation.entity';
import { Message } from 'src/message/entities/message.entity';

@Injectable()
export class ChatRoomsService {
  constructor(
    @InjectRepository(ChatRoom) private readonly chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserChat) private readonly userChatRepository: Repository<UserChat>,
    @InjectRepository(ChatRoomInv) private readonly invitationRepository: Repository<ChatRoomInv>,
    @InjectRepository(Message) private readonly messageRepository: Repository<Message>
  ) {}

  async create(createChatRoomDto: CreateChatRoomDto, payload) {
    if (createChatRoomDto.privacy != 'protected' &&
        createChatRoomDto.privacy != 'private' &&
        createChatRoomDto.privacy != 'public')
        {
          throw new ForbiddenException()
        }
    if (createChatRoomDto.privacy == 'protected' && !createChatRoomDto.ifProtectedPass)
      throw new ForbiddenException()
    createChatRoomDto.owner = payload.sub
    const chatroom = await this.chatRoomRepository.create(createChatRoomDto);
    const newChat = await this.chatRoomRepository.save(chatroom);
    if(!newChat)
      throw new ForbiddenException()
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
      privacy: one.privacy
    };
  }

  async findOneById(id: number) {
    const options: FindOneOptions<ChatRoom> = {
      where: {id},
    }
    const one = await this.chatRoomRepository.findOne(options)
    if (!one)
      throw new NotFoundException()
    return {
      id: one.id,
      title: one.title,
      owner: one.owner,
      privacy: one.privacy,
      password: one.ifProtectedPass
    };
  }


  async update(title: string, updateChatRoomDto: UpdateChatRoomDto, payload) {
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
        throw new ForbiddenException()
        chat.title = updateChatRoomDto.title;
        chat.privacy = updateChatRoomDto.privacy;
        chat.ifProtectedPass = updateChatRoomDto.ifProtectedPass
      return await this.chatRoomRepository.save(chat)
    }
    else
      throw new NotFoundException()
  }

  async remove(title, payload) {
    
    const chat = await this.findOne(title)
    if (chat && chat.owner == payload.sub)
      return await this.chatRoomRepository.delete({id: chat.id})
    else
      throw new ForbiddenException()
  }

  async isAdmin(userId: number, chatRoomId: number)
  {
    const options: FindOneOptions<UserChat> = {
      where: {userId, chatRoomId},
    }
    const relation = await this.userChatRepository.findOne(options);
    if (relation && (relation.role == 'admin' || relation.role == 'owner'))
      return true
    return false
  }

  async addMemberToChat(chatId, userId)
  {
    const oldMember = await this.userChatRepository.findOne({
      where: {userId, chatRoomId: chatId}
    })
    if (oldMember)
      throw new ForbiddenException('Already joined this chat')
    const newMember = await this.userChatRepository.create({
      userId,
      chatRoomId: chatId,
      userStatus: "normal",
      role: "member"
    })
    await this.userChatRepository.save(newMember)
    return await this.userRepository.findOne({
      where: {id: userId}
    })
  }

  /* ---------member work------------ */
  async updateMemberRole(memberId, chatId, role, payload)
  {
    const userChat = await this.userChatRepository.findOne({
      relations: ['user', 'chatRoom'],
      where: {userId: memberId, chatRoomId: chatId}
    })
    if (!userChat)
      throw new NotFoundException()
    if (userChat.role == 'owner' || !this.isAdmin(payload.sub, chatId))
      throw new UnauthorizedException()
    if (role != 'member' && role != 'admin')
      throw new BadRequestException()
    userChat.role = role;
    await this.userChatRepository.save(userChat)
    return userChat;
  }

  async updateMemberStatus(memberId, chatId, status, payload)
  {
    const userChat = await this.userChatRepository.findOne({
      relations: ['user', 'chatRoom'],
      where: {userId: memberId, chatRoomId: chatId}
    })
    if (!userChat)
      throw new NotFoundException()
    if (userChat.role == 'owner' || (userChat.role == 'admin' && userChat.chatRoom.owner != payload.sub) || !this.isAdmin(payload.sub, chatId))
      throw new UnauthorizedException()
    if (status != 'banned' && status != 'muted')
      throw new BadRequestException()
    userChat.userStatus = status;
    await this.userChatRepository.save(userChat)
    return userChat;
  }

  async kickMemberFromChat(memberId, chatId, payload)
  {
    const userChat = await this.userChatRepository.findOne({
      relations: ['user', 'chatRoom'],
      where: {userId: memberId, chatRoomId: chatId}
    })
    if (!userChat)
      throw new NotFoundException()
      if (userChat.role == 'owner' || (userChat.role == 'admin' && userChat.chatRoom.owner != payload.sub) || !this.isAdmin(payload.sub, chatId))
        throw new UnauthorizedException()
    await this.userChatRepository.remove(userChat);
    return userChat;
  }

  /* ---------invitation handler------------ */
  async acceptInviteToChat(body, payload)
  {
    const options: FindOneOptions<ChatRoomInv> = {
      where: {id: body.id},
    }
    const invite = await this.invitationRepository.findOne(options)
    if (!invite || invite.toUserId != payload.sub)
      throw new NotFoundException()
      const oldMember = await this.userChatRepository.findOne({
        where: {userId: invite.toUserId, chatRoomId: invite.chatRoomId}
      })
      if (oldMember)
        throw new ForbiddenException('Already joined this chat')
    const userChat = await this.userChatRepository.create({
      userId: invite.toUserId,
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
      const fromUser = await this.userRepository.findOne({
        select: ['id', 'username', 'avatar'], 
        where: {id: payload.sub},
      })
      const toUser = await this.userRepository.findOne({
        select: ['id', 'username', 'avatar'], 
        where: {id: id},
      })
      const oldMember = await this.userChatRepository.findOne({
        where: {userId: toUser.id, chatRoomId: chat.id}
      })
      if (oldMember)
        throw new ForbiddenException('Already joined this chat')
      const invite = await this.invitationRepository.create({
        title,
        chatRoomId: chat.id,
        fromUserId: fromUser.id,
        toUserId: id,
        toUser,
        fromUser,
        chatRoom: chat
      })
      if (invite)
      {
        const inviteChat = await this.invitationRepository.save(invite)
        return {
          id: inviteChat.id,
          title,
          from: fromUser
        }
      }
    }
    else
      return new ForbiddenException()
  }

  async removeInvitation(id: string)
  {
    const options: FindOneOptions<ChatRoomInv> = {
      where: {id},
    }
    const entityToRemove = await this.invitationRepository.findOne(options);
    this.invitationRepository.remove(entityToRemove)
  }

  async getInvitationById(id: string)
  {
    const invitations = await this.invitationRepository
    .createQueryBuilder('invitation')
    .leftJoinAndSelect('invitation.toUser', 'toUser')
    .leftJoinAndSelect('invitation.fromUser', 'fromUser')
    .leftJoinAndSelect('invitation.chatRoom', 'chatRoom')
    .where('invitation.id = :id', { id })
    .select([
      'invitation.id',
      'toUser.id',
      'toUser.username',
      'toUser.avatar',
      'fromUser.id',
      'fromUser.username',
      'fromUser.avatar',
      'chatRoom.id',
      'chatRoom.title',
    ])
    .getOne();
  
    return invitations;
  }


  async getInvitationOfUser(id: number)
  {
    const invitations = await this.invitationRepository
    .createQueryBuilder('invitation')
    .leftJoinAndSelect('invitation.toUser', 'toUser')
    .leftJoinAndSelect('invitation.fromUser', 'fromUser')
    .leftJoinAndSelect('invitation.chatRoom', 'chatRoom')
    .where('invitation.toUserId = :id', { id })
    .select([
      'invitation.id',
      'toUser.id',
      'toUser.username',
      'toUser.avatar',
      'fromUser.id',
      'fromUser.username',
      'fromUser.avatar',
      'chatRoom.id',
      'chatRoom.title',
    ])
    .getMany();
  
    return invitations;
  }

  /* ---------message handler------------ */
  async newChatMessage(fromId, chatId, messageContent, type, clients)
  {
    const options : FindManyOptions<UserChat> = {
      select: ['userId', 'userStatus', 'role', 'chatRoom'],
      where: {chatRoomId: chatId}
    }
    const chatmembers = await this.userChatRepository.find(options)
    if (!chatmembers)
      throw new NotFoundException()
    let fromIsMember = false;
    await chatmembers.find((member) => {
        if (member.userId == fromId)
          fromIsMember = true
    })
    if (!fromIsMember)
      throw new ForbiddenException()
    const from = await this.userRepository.findOne({
      relations: ['blocked'],
      select: ['id', 'avatar', 'username'],
      where: {id: fromId}
    })
    if (!from)
      throw new NotFoundException()
    for (const member of chatmembers)
    {
      const client = clients.get(member.userId)
      if (await this.checkUserisBlockedByUser(from, member.userId))
        continue;
      if (client && member.userStatus != 'banned' && member.userStatus != 'muted')
      {
        client.emit('receiveMessage', {
            type,
            message: messageContent,
            from,
            chatRoomId: chatId
          })
      }
    }
    const chatroom = await this.chatRoomRepository.findOne({where: {id: chatId}})
    const message = await this.messageRepository.create({
      message: messageContent,
      user: from,
      chatroom
    })
    this.messageRepository.save(message)
  }
  /* ---------DM message handler------------ */
  async newDMMessage(formId, toId, message, clients)
  {
    const fromUser = await this.userRepository.findOne({
      select: ['id', 'username', 'avatar'],
      relations: ['blocked'],
      where: {id: formId}
    })
    if (!fromUser)
      throw new NotFoundException()
    const toUser = await this.userRepository.findOne({
      select: ['id', 'username', 'avatar'],
      relations: ['blocked'],
      where: {id: toId}
    })
    if(!toUser)
      throw new NotFoundException()
    if (await this.checkUserisBlockedByUser(fromUser, toUser.id))
      throw new NotAcceptableException()
    delete fromUser.blocked
    delete toUser.blocked
    const msg = await this.messageRepository.create({
      user: fromUser,
      user2: toUser,
      message
    })
    const msgtoSent = await this.messageRepository.save(msg)
    delete msgtoSent.chatroom
    delete msgtoSent.chatroomId
    delete msgtoSent.user2Id
    delete msgtoSent.userId
    let client = clients.get(toId)
    if (client)
      client.emit('receiveMessage', {type: 'DM', message: msgtoSent})
    client = clients.get(formId)
    if (client)
      client.emit('receiveMessage', {type: 'DM', message: msgtoSent})
  }

  async messagesNotification(id: number)
  {
    const user = await this.userRepository.findOne({
      select: ['id','disconnectAt'],
      where: {id}
    })
    let message;
    if(!user.disconnectAt)
    {
      message = await this.messageRepository.count({
        where: {user2Id: id}
      })
    }
    else
    {
      message = await this.messageRepository.createQueryBuilder('message')
      .where('"createdAt" > :disconnect', {disconnect: user.disconnectAt})
      .getCount()
    }
    return message
  }

  async checkUserisBlockedByUser(user1, user2Id)
  {
    var isblocked = false;
    user1.blocked.map(user =>{
      if (user.id == user2Id)
        isblocked = true
    })
    if (isblocked)
      return true
    const user2 = await this.userRepository.findOne({
      select: ['id', 'username', 'avatar'],
      relations: ['blocked'],
      where: {id: user2Id}
    })
    if (!user2)
      return true
    user2.blocked.map(user =>{
      if (user.id == user1.id)
        isblocked = true
    })
    if (isblocked)
      return true
    return false
  }
}
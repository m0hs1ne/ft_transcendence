import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateChatRoomDto } from "./dto/create-chat_room.dto";
import { UpdateChatRoomDto } from "./dto/update-chat_room.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ChatRoom } from "./entities/chat_room.entity";
import {
  FindManyOptions,
  FindOneOptions,
  ILike,
  In,
  Repository,
} from "typeorm";
import { User } from "src/users/entities/user.entity";
import { UserChat } from "src/user_chat/entities/user_chat.entity";
import { ChatRoomInv } from "./entities/invitation.entity";
import { Message } from "src/message/entities/message.entity";

@Injectable()
export class ChatRoomsService {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserChat)
    private readonly userChatRepository: Repository<UserChat>,
    @InjectRepository(ChatRoomInv)
    private readonly invitationRepository: Repository<ChatRoomInv>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async create(createChatRoomDto: CreateChatRoomDto, payload) {
    if (
      createChatRoomDto.privacy != "protected" &&
      createChatRoomDto.privacy != "private" &&
      createChatRoomDto.privacy != "public"
    ) {
      throw new ForbiddenException();
    }
    if (
      createChatRoomDto.privacy == "protected" &&
      !createChatRoomDto.ifProtectedPass
    )
      throw new ForbiddenException();
    else if (
      createChatRoomDto.privacy == "protected" &&
      createChatRoomDto.ifProtectedPass
    ) {
      if (typeof createChatRoomDto.ifProtectedPass != "string")
        throw new BadRequestException();
      // const msg = this.checkPasswordStrength(createChatRoomDto.ifProtectedPass)
      // if (msg)
      //   throw new BadRequestException(msg)
    }
    createChatRoomDto.owner = payload.sub;
    const chatroom = await this.chatRoomRepository.create(createChatRoomDto);
    const newChat = await this.chatRoomRepository.save(chatroom);
    if (!newChat) throw new ForbiddenException();
    const ownerObj = await this.userRepository.findOne({
      where: { id: payload.sub },
    });
    ownerObj.creator = true;
    const userChatRel = await this.userChatRepository.create({
      userId: payload.sub,
      chatRoomId: newChat.id,
      userStatus: "normal",
      role: "owner",
      user: ownerObj,
      chatRoom: newChat,
    });
    await this.userRepository.save(ownerObj);
    await this.userChatRepository.save(userChatRel);

    return {
      id: newChat.id,
      title: newChat.title,
      owner: newChat.owner,
      privacy: newChat.privacy,
    };
  }

  async findAll(payload) {
    return await this.chatRoomRepository.find({
      select: ["id", "title", "owner", "privacy"],
      where: {
        privacy: In(["public", "protected"]),
      },
    });
  }

  async findMyChatRooms(id) {
    let mychatRooms: ChatRoom[] = [];
    const userChats = await this.userChatRepository
      .createQueryBuilder("user_chat")
      .leftJoinAndSelect("user_chat.chatRoom", "chatRoom")
      .where("user_chat.userId = :id ", { id })
      // .where('user_chat.userStatus != :status', { status: 'banned' })
      .select([
        "user_chat.id",
        "chatRoom.id",
        "chatRoom.owner",
        "chatRoom.title",
        "chatRoom.privacy",
      ])
      .getMany();
    for (const userChat of userChats) mychatRooms.push(userChat.chatRoom);
    if (!mychatRooms)
      throw new NotFoundException({ message: `You didn't join any chat.` });
    return mychatRooms;
  }

  async findOneById(id: number) {
    const options: FindOneOptions<ChatRoom> = {
      where: { id },
    };
    const one = await this.chatRoomRepository.findOne(options);
    if (!one) throw new NotFoundException({ message: "Chat not found" });
    return one;
  }

  async update(id: number, updateChatRoomDto: UpdateChatRoomDto, payload) {
    const options: FindOneOptions<ChatRoom> = {
      select: ["id", "owner", "title", "privacy"],
      where: { id },
    };
    const chat = await this.chatRoomRepository.findOne(options);
    if (chat && chat.owner == payload.sub) {
      if (
        updateChatRoomDto.privacy != "protected" &&
        updateChatRoomDto.privacy != "private" &&
        updateChatRoomDto.privacy != "public"
      )
        updateChatRoomDto.privacy = "public";

      if (
        updateChatRoomDto.privacy == "protected" &&
        !updateChatRoomDto.password
      )
        throw new ForbiddenException();
      chat.title = updateChatRoomDto.title;
      chat.privacy = updateChatRoomDto.privacy;
      chat.ifProtectedPass = updateChatRoomDto.password;
      await this.chatRoomRepository.save(chat);
      delete chat.ifProtectedPass;
      return chat;
    } else throw new NotFoundException({ message: "Chat not found" });
  }

  async remove(chatId, payload, clients) {
    const chat = await this.chatRoomRepository.findOne({
      where: { id: chatId, owner: payload.sub },
    });

    const options: FindManyOptions<UserChat> = {
      select: ["id", "mutedTill", "userId", "userStatus", "role", "chatRoom"],
      where: { chatRoomId: chatId },
    };
    const chatmembers = await this.userChatRepository.find(options);
    for (const member of chatmembers) {
      const client = clients.get(member.userId);
      client.emit("ChatRoomList", {
        chatId,
        type: "remove",
      });
    }
    if (chat) return await this.chatRoomRepository.delete({ id: chat.id });
    else throw new ForbiddenException();
  }

  async isAdmin(userId: number, chatRoomId: number) {
    const options: FindOneOptions<UserChat> = {
      where: { userId, chatRoomId },
    };
    const relation = await this.userChatRepository.findOne(options);
    if (relation && (relation.role == "admin" || relation.role == "owner"))
      return true;
    return false;
  }

  async addMemberToChat(chatId, userId) {
    const oldMember = await this.userChatRepository.findOne({
      where: { userId, chatRoomId: chatId },
    });
    if (oldMember && oldMember.userStatus == "banned")
      throw new ForbiddenException("You are banned from this chat");
    else if (oldMember)
      throw new ForbiddenException("Already joined this chat");
    const newMember = await this.userChatRepository.create({
      userId,
      chatRoomId: chatId,
      userStatus: "normal",
      role: "member",
    });
    await this.userChatRepository.save(newMember);
    return await this.userRepository.findOne({
      where: { id: userId },
    });
  }

  /* ---------member work------------ */
  async updateMemberRole(memberId, chatId, role, payload) {

    const myUserChat = await this.userChatRepository.findOne({
      relations: ["user", "chatRoom"],
      where: { userId: payload.sub, chatRoomId: chatId },
    });
    if (!myUserChat)
      throw new NotFoundException({ message: "You are not in this chat" });
    else if (myUserChat.role != "admin" && myUserChat.role != "owner" )
      throw new ForbiddenException({message: "You have no authority here!"})
    const userChat = await this.userChatRepository.findOne({
      relations: ["user", "chatRoom"],
      where: { userId: memberId, chatRoomId: chatId },
    });
    if (!userChat)
      throw new NotFoundException({ message: "User is not in this chat" });
    if (userChat.role == "owner" || !this.isAdmin(payload.sub, chatId))
      throw new UnauthorizedException();
    if (role != "member" && role != "admin") throw new BadRequestException();
    userChat.role = role;
    await this.userChatRepository.save(userChat);
    return userChat;
  }

  async updateMemberStatus(memberId, chatId, status, mutedFor, payload) {
    const myUserChat = await this.userChatRepository.findOne({
      relations: ["user", "chatRoom"],
      where: { userId: payload.sub, chatRoomId: chatId },
    });
    if (!myUserChat)
      throw new NotFoundException({ message: "You are not in this chat" });
    else if (myUserChat.role != "admin" && myUserChat.role != "owner" )
      throw new ForbiddenException({message: "You have no authority here!"})


    const userChat = await this.userChatRepository.findOne({
      relations: ["user", "chatRoom"],
      where: { userId: memberId, chatRoomId: chatId },
    });
    if (!userChat)
      throw new NotFoundException({ message: "User is not in this chat" });
    if (
      userChat.role == "owner" ||
      (userChat.role == "admin" && userChat.chatRoom.owner != payload.sub) ||
      !this.isAdmin(payload.sub, chatId)
    )
      throw new UnauthorizedException();
    if (status != "banned" && status != "muted" && status != "normal")
      throw new BadRequestException();
    if (status == "muted") {
      if (typeof mutedFor === "number") {
        const mutedAt = new Date();
        userChat.mutedTill.setMinutes(mutedAt.getMinutes() + mutedFor);
      } else throw new BadRequestException();
    }
    userChat.userStatus = status;
    await this.userChatRepository.save(userChat);
    return userChat;
  }

  async kickMemberFromChat(memberId, chatId, payload, clients) {
    const member_count = await this.userChatRepository
      .createQueryBuilder("user_chat")
      .where('"chatRoomId" = :id', { id: chatId })
      .select(["user_chat.id", "user_chat.role", "user_chat.userStatus"])
      .getCount();
    if (member_count == 1) {
      await this.remove(chatId, payload, clients);
      return false;
    }
    const userChat = await this.userChatRepository.findOne({
      relations: ["user", "chatRoom"],
      where: { userId: memberId, chatRoomId: chatId },
    });
    if (!userChat)
      throw new NotFoundException({ message: "User is not in this chat" });
    if (memberId != payload.sub) {
      if (
        userChat.role == "owner" ||
        (userChat.role == "admin" && userChat.chatRoom.owner != payload.sub) ||
        !this.isAdmin(payload.sub, chatId)
      )
        throw new UnauthorizedException();
      this.newChatMessage(
        userChat.user.id,
        chatId,
        `${userChat.user.username} kicked the chat.`,
        "notification",
        clients,
        "kick",
      );
      this.userChatRepository.remove(userChat);
      return;
    } else if (userChat.role == "owner") {
      const members = await this.userChatRepository.find({
        where: { chatRoomId: chatId, userStatus: In(["normal", "muted"]) },
      });
      const chat = await this.chatRoomRepository.findOne({
        where: { id: chatId },
      });
      if (members.length == 1) {
        this.chatRoomRepository.remove(chat);
      }
      else
      {
        for (const member of members)
        {
          if (member.role != 'owner')
          {
            member.role = 'owner'
            chat.owner = member.userId
            this.userChatRepository.save(member)
            this.chatRoomRepository.save(chat)
            break;
          }
        }
        this.newChatMessage(
          payload.sub,
          chatId,
          `${userChat.user.username} left the chat.`,
          "notification",
          clients,
          "kick",
        );
        this.userChatRepository.remove(userChat);
        return userChat;
      }
    } else if (memberId == payload.sub) {
      const member = await this.userChatRepository.findOne({
        relations: ["user"],
        where: {
          userId: payload.sub,
          chatRoomId: chatId,
          userStatus: In(["normal", "muted"]),
        },
      });
      this.newChatMessage(
        payload.sub,
        chatId,
        `${member.user.username} left the chat.`,
        "notification",
        clients,
        "kick",
      );
      this.userChatRepository.remove(member);
      return member;
    }
  }

  async getChatMember(id) {
    let member = await this.userChatRepository
      .createQueryBuilder("user_chat")
      .leftJoinAndSelect("user_chat.user", "user")
      .where('"chatRoomId" = :id', { id })
      .select([
        "user_chat.id",
        "user_chat.role",
        "user_chat.userStatus",
        "user.id",
        "user.username",
        "user.avatar",
      ])
      .getMany();

    return member;
  }

  /* ---------invitation handler------------ */
  async acceptInviteToChat(body, payload) {
    const options: FindOneOptions<ChatRoomInv> = {
      where: { id: body.id },
    };
    const invite = await this.invitationRepository.findOne(options);
    if (!invite || invite.toUserId != payload.sub)
      throw new NotFoundException({ message: "Invitation not found" });
    const oldMember = await this.userChatRepository.findOne({
      where: { userId: invite.toUserId, chatRoomId: invite.chatRoomId },
    });
    if (oldMember) throw new ForbiddenException("Already joined this chat");
    const userChat = await this.userChatRepository.create({
      userId: invite.toUserId,
      chatRoomId: invite.chatRoomId,
      userStatus: "normal",
      role: "member",
    });
    await this.userChatRepository.save(userChat);
  }

  async inviteUserToChat(id: number, chatId: number, payload) {
    const invit = await this.invitationRepository.findOne({
      where: { toUserId: id, chatRoomId: chatId },
    });
    if (invit) throw new NotAcceptableException("Invitation was sent already.");
    const chat = await this.chatRoomRepository.findOne({
      where: { id: chatId },
    });
    const isAdmin = await this.isAdmin(payload.sub, chat.id);
    if (chat && isAdmin) {
      const fromUser = await this.userRepository.findOne({
        select: ["id", "username", "avatar"],
        where: { id: payload.sub },
      });
      const toUser = await this.userRepository.findOne({
        select: ["id", "username", "avatar"],
        where: { id: id },
      });
      const oldMember = await this.userChatRepository.findOne({
        where: { userId: toUser.id, chatRoomId: chat.id },
      });
      if (oldMember) {
        if (oldMember.userStatus == "normal" || oldMember.userStatus == "muted")
          throw new ForbiddenException("Already joined this chat.");
        else if (oldMember.userStatus == "banned")
          throw new NotAcceptableException(
            "This user is banned from this chat.",
          );
      }
      const invite = await this.invitationRepository.create({
        title: chat.title,
        chatRoomId: chat.id,
        fromUserId: fromUser.id,
        toUserId: id,
        toUser,
        fromUser,
        chatRoom: chat,
      });
      if (invite) {
        const inviteChat = await this.invitationRepository.save(invite);
        const invitation = await this.getInvitationById(inviteChat.id);
        return invitation;
      }
    } else return new ForbiddenException();
  }

  async removeInvitation(id: string, toId: number) {
    const options: FindOneOptions<ChatRoomInv> = {
      where: { id, toUserId: toId },
    };
    const entityToRemove = await this.invitationRepository.findOne(options);
    this.invitationRepository.remove(entityToRemove);
  }

  async getInvitationById(id: string) {
    const invitations = await this.invitationRepository
      .createQueryBuilder("invitation")
      .leftJoinAndSelect("invitation.toUser", "toUser")
      .leftJoinAndSelect("invitation.fromUser", "fromUser")
      .leftJoinAndSelect("invitation.chatRoom", "chatRoom")
      .where("invitation.id = :id", { id })
      .select([
        "invitation.id",
        "toUser.id",
        "toUser.username",
        "toUser.avatar",
        "fromUser.id",
        "fromUser.username",
        "fromUser.avatar",
        "chatRoom.id",
        "chatRoom.title",
      ])
      .getOne();

    return invitations;
  }

  async getInvitationOfUser(id: number) {
    const invitations = await this.invitationRepository
      .createQueryBuilder("invitation")
      .leftJoinAndSelect("invitation.toUser", "toUser")
      .leftJoinAndSelect("invitation.fromUser", "fromUser")
      .leftJoinAndSelect("invitation.chatRoom", "chatRoom")
      .where("invitation.toUserId = :id", { id })
      .select([
        "invitation.id",
        "toUser.id",
        "toUser.username",
        "toUser.avatar",
        "fromUser.id",
        "fromUser.username",
        "fromUser.avatar",
        "chatRoom.id",
        "chatRoom.title",
      ])
      .getMany();

    return invitations;
  }

  /* ---------message handler------------ */
  async newChatMessage(fromId, chatId, messageContent, type, clients, action) {
    const options: FindManyOptions<UserChat> = {
      select: ["id", "mutedTill", "userId", "userStatus", "role", "chatRoom"],
      where: { chatRoomId: chatId },
    };
    const chatmembers = await this.userChatRepository.find(options);
    if (!chatmembers)
      throw new NotFoundException({ message: "Chat not found" });
    let fromIsMember = false;
    const fromMember = await chatmembers.find((member) => {
      if (member.userId == fromId) {
        fromIsMember = true;
        return member;
      }
    });
    if (!fromIsMember) throw new ForbiddenException();
    if (action != "kick" && fromMember.userStatus == "banned")
      throw new NotAcceptableException(`You are banned from this chat.`);
    if (fromMember.userStatus == "muted") {
      console.log(fromMember);
      const timeNow = new Date();
      if (timeNow.getMinutes() < fromMember.mutedTill.getMinutes())
        throw new NotAcceptableException(
          `You are muted in this chat (time remaining ${
            fromMember.mutedTill.getMinutes() - timeNow.getMinutes()
          } Min)`,
        );
      else {
        fromMember.userStatus = "normal";
        await this.userChatRepository.save(fromMember);
      }
    }
    const from = await this.userRepository.findOne({
      relations: ["blocked"],
      select: ["id", "avatar", "username"],
      where: { id: fromId },
    });
    if (!from) throw new NotFoundException({ message: "User not found" });
    for (const member of chatmembers) {
      const client = clients.get(member.userId);
      if (await this.checkUserisBlockedByUser(fromId, member.userId)) continue;
      if (client && member.userStatus != "banned") {
        delete from.blocked;
        client.emit("receiveMessage", {
          type,
          action,
          message: messageContent,
          from,
          chatRoomId: chatId,
        });
      }
    }
    const chatroom = await this.chatRoomRepository.findOne({
      where: { id: chatId },
    });
    const message = await this.messageRepository.create({
      type,
      message: messageContent,
      from,
      chatroom,
    });
    this.messageRepository.save(message);
  }

  /* ---------DM message handler------------ */
  async newDMMessage(formId, toId, message, clients) {
    if (toId == formId) throw new BadRequestException("Can't self DMs.");
    const fromUser = await this.userRepository.findOne({
      select: ["id", "username", "avatar"],
      relations: ["blocked"],
      where: { id: formId },
    });
    if (!fromUser) throw new NotFoundException({ message: "User not found" });
    const toUser = await this.userRepository.findOne({
      select: ["id", "username", "avatar"],
      relations: ["blocked"],
      where: { id: toId },
    });
    if (!toUser) throw new NotFoundException({ message: "User not found" });
    if (await this.checkUserisBlockedByUser(fromUser.id, toUser.id))
      throw new NotAcceptableException();
    delete fromUser.blocked;
    delete toUser.blocked;
    const msg = await this.messageRepository.create({
      from: fromUser,
      to: toUser,
      message,
    });
    const msgtoSent = await this.messageRepository.save(msg);
    delete msgtoSent.chatroom;
    delete msgtoSent.chatroomId;
    delete msgtoSent.toId;
    delete msgtoSent.fromId;
    let client = clients.get(toId);
    if (client)
      client.emit("receiveMessage", { type: "DM", message: msgtoSent });
    client = clients.get(formId);
    if (client)
      client.emit("receiveMessage", { type: "DM", message: msgtoSent });
  }

  async messagesNotification(id: number) {
    const user = await this.userRepository.findOne({
      select: ["id", "disconnectAt"],
      where: { id },
    });
    let message;
    if (!user.disconnectAt) {
      message = await this.messageRepository.count({
        where: { toId: id },
      });
    } else {
      message = await this.messageRepository
        .createQueryBuilder("message")
        .where('"createdAt" > :disconnect', { disconnect: user.disconnectAt })
        .getCount();
    }
    return message;
  }

  async getMessages(from, id, payload) {
    let messages;
    if (from == "chat") {
      const isUserInChat = await this.userChatRepository.count({
        where: { userId: payload.sub, chatRoomId: id },
      });
      if (isUserInChat) {
        messages = await this.messageRepository
          .createQueryBuilder("message")
          .leftJoinAndSelect("message.from", "user")
          .where('"chatroomId" = :id', { id })
          .select([
            "message.chatroomId",
            "message.id",
            "message.message",
            "message.type",
            "user.id",
            "user.username",
            "user.avatar",
            "message.createdAt",
            "message.updatedAt",
          ])
          .orderBy('message.createdAt',"ASC")
          .getMany();
      } else throw new NotAcceptableException();
    } else {
      if (await this.checkUserisBlockedByUser(payload.sub, id))
        throw new NotAcceptableException();
      messages = await this.messageRepository
        .createQueryBuilder("message")
        .leftJoinAndSelect("message.from", "user")
        .where(
          '("fromId" = :id AND "toId" = :id2) OR "fromId" = :id2 AND "toId" = :id',
          { id, id2: payload.sub },
        )
        .select([
          "message.id",
          "message.message",
          "user.id",
          "user.username",
          "user.avatar",
          "message.createdAt",
          "message.updatedAt",
        ])
        .getMany();
    }
    return messages;
  }

  async checkUserisBlockedByUser(user1Id, user2Id) {
    var isblocked = false;
    const user = await this.userRepository.findOne({
      relations: ["blocked", "blockedBy"],
      where: { id: user1Id },
    });
    user.blocked.map((block) => {
      if (block.id == user2Id) isblocked = true;
    });
    if (isblocked) return true;
    user.blockedBy.map((block) => {
      if (block.id == user2Id) isblocked = true;
    });
    if (isblocked) return true;
    return false;
  }

  checkPasswordStrength(password) {
    // Define the regular expressions to check the password strength
    const regex = {
      lowercase: /[a-z]/,
      uppercase: /[A-Z]/,
      number: /[0-9]/,
      special: /[$&+,:;=?@#|'<>.^*()%!-]/,
    };

    // Check if the password meets the minimum length
    if (password.length < 8) {
      return "Password should be at least 8 characters long.";
    }

    // Check if the password contains at least one lowercase letter
    if (!regex.lowercase.test(password)) {
      return "Password should contain at least one lowercase letter.";
    }

    // Check if the password contains at least one uppercase letter
    if (!regex.uppercase.test(password)) {
      return "Password should contain at least one uppercase letter.";
    }

    // Check if the password contains at least one number
    if (!regex.number.test(password)) {
      return "Password should contain at least one number.";
    }

    // Check if the password contains at least one special character
    if (!regex.special.test(password)) {
      return "Password should contain at least one special character.";
    }
    return false;
  }

  async uploadAvatar(avatar, chatId, payload) {
    await this.chatRoomRepository.update(
      { id: chatId },
      { avatar: "http://10.32.125.38:3000/" + avatar.filename },
    );
  }

  async search(query: string, userId: number) {
    const chatrooms: any = await this.chatRoomRepository.find({
      select: ["id", "avatar", "owner", "privacy", "title"],
      where: {
        privacy: In(["public", "protected"]),
        title: ILike(`%${query}%`),
      },
    });

    for (let chat of chatrooms) {
      if (await this.isMemberInChat(userId, chat.id)) chat.isMember = true;
      else chat.isMember = false;
    }
    return chatrooms;
  }

  async isMemberInChat(memberId: number, chatId: number) {
    const userchat = await this.userChatRepository.findOne({
      where: { userId: memberId, chatRoomId: chatId },
    });
    if (userchat) return true;
    return false;
  }

  async sendObjectToMembers(chatroom: ChatRoom, obj, clients)
  {
    const options: FindManyOptions<UserChat> = {
      select: ["id", "mutedTill", "userId", "userStatus", "role", "chatRoom"],
      where: { chatRoomId: chatroom.id },
    };
    const chatmembers = await this.userChatRepository.find(options);
    for (const member of chatmembers) {
      const client = clients.get(member.userId);
      client.emit("ChatRoomList", obj);
    }
  }
}

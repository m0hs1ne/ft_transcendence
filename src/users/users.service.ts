import { Injectable, NotAcceptableException, NotFoundException, Options, Req, UseGuards } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, FindOneOptions, FindOptionsWhere, ILike, In, QueryFailedError, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { verifyToken } from 'src/utils/guard';
import { AddFriendDto } from './dto/add-friend.dto';
import { ChatRoom } from 'src/chat_rooms/entities/chat_room.entity';



@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(User) private readonly chatRoomRepository: Repository<ChatRoom>
  ) { }

  async findAll() {
    return await this.userRepository.find();
  }

  async checkUserisBlockedByUser(user1Id, user2Id)
  {
    var isblocked = false;
    const user = await this.userRepository.findOne({
      relations:['blocked', 'blockedBy'],
      where: {id: user1Id}
    })    
    user.blocked.map(block =>{
      if (block.id == user2Id)
        isblocked = true
    })
    if (isblocked)
    return true
    user.blockedBy.map(block =>{
      if (block.id == user2Id)
        isblocked = true
    })
    if (isblocked)
      return true
    return false
  }

  async myprofile(id: number) {
    const user = await this.userRepository
    .createQueryBuilder('users')
    .leftJoinAndSelect('users.friends', 'friends')
    .leftJoinAndSelect('users.blocked', 'blocked')
    .leftJoinAndSelect('users.achievements', 'achievement')
    .where('users.id = :id', { id })
    .select([
      'users.id',
      'users.username',
      'users.wins',
      'users.losses',
      'users.avatar',
      'users.is2faEnabled',
      'friends.id',
      'friends.username',
      'friends.wins',
      'friends.losses',
      'friends.avatar',
      'blocked.id',
      'blocked.username',
      'blocked.avatar',
      'achievement.title',
      'achievement.image'
    ])
    .getOne()
    return user;
  }

  async profile(id: number, payload) {
    if (await this.checkUserisBlockedByUser(id, payload.sub))
      throw new NotAcceptableException();
    const user = await this.userRepository
    .createQueryBuilder('users')
    .leftJoinAndSelect('users.friends', 'friends')
    .leftJoinAndSelect('users.achievements', 'achievement')
    .where('users.id = :id', { id })
    .select([
      'users.id',
      'users.username',
      'users.wins',
      'users.losses',
      'users.avatar',
      'friends.id',
      'friends.username',
      'friends.wins',
      'friends.losses',
      'friends.avatar',
      'achievement.title',
      'achievement.image'
    ])
    .getOne()
    return user;
  }

  async findOne(id: number) {
    return await this.userRepository.findOneBy({id : id});
  }

  async update(id: number, username) {
    const options: FindOneOptions<User> = {
      where: { id },
    };
    const updatedUser = await this.userRepository.update({id}, {
    username,
    });
    return updatedUser;
  }

  async remove(id: number, @Req() req) {
    const payload = verifyToken(req.headers.cookie);
    if (id != payload.sub)
      throw new EntityNotFoundError(User, {});
    return await this.userRepository.delete({id});
  }

  //friends
  async getfriends(id: number)
  {
    const friends = await this.userRepository
    .createQueryBuilder('users')
    .leftJoinAndSelect('users.friends', 'friends')
    .where('users.id = :id', { id })
    .select([
      'users.username',
      'friends.id',
      'friends.username',
      'friends.avatar',
    ])
    .getOne()
    return friends.friends;
  }

  async addfriends(id, @Req() req)
  {
    const friend = await this.userRepository.findOne({
      relations: ['friends'],
      select: ['id', 'username', 'avatar'],
      where: {id},
    })
    if (!friend) {
      throw new NotFoundException();
    }
    const payload = verifyToken(req.headers.cookie);
    let isBlocked = await this.userRepository.query(
      ` SELECT * FROM blocked WHERE ("userId" = $1 AND "blockedId" = $2) OR ("userId" = $2 AND "blockedId" = $1);`,
      [id, payload.sub],
    );

    if (isBlocked !== undefined && isBlocked.length > 0)
      throw new NotAcceptableException();
    isBlocked = await this.userRepository.query(
      ` SELECT * FROM "blockedBy" WHERE ("userId" = $1 AND "blockedById" = $2) OR ("userId" = $2 AND "blockedById" = $1);`,
      [id, payload.sub],
    );
    if (isBlocked !== undefined && isBlocked.length > 0)
      throw new NotAcceptableException();
    const me = await this.userRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.friends', 'friend')
    .where('user.id = :id', { id: payload.sub })
    .getOne();
    me.friends.push(friend);
    friend.friends.push(me)
    this.userRepository.save(friend)
    this.userRepository.save(me);
    return {message: `${friend.username} was added to your friends.`}
  }

  async removefriends(id: number, @Req() req)
  {
    const payload = verifyToken(req.headers.cookie);
    const user = await this.userRepository.find({
      where: {id}
    })
    if (!user)
      throw new NotFoundException()
    await this.userRepository.query(
      `DELETE FROM friends WHERE ("userId" = $1 AND "friendId" = $2) OR ("userId" = $2 AND "friendId" = $1); `,
      [id, payload.sub],
    );
    return {message: `${id} was removed from your friends`}
  }
  //blocked
  async getblocked(id: number)
  {
    const blocked = await this.userRepository
    .createQueryBuilder('users')
    .leftJoinAndSelect('users.blocked', 'blocked')
    .where('users.id = :id', { id })
    .select([
      'blocked.id',
      'blocked.username',
      'blocked.avatar',
    ])
    .getOne()
    return blocked;
  }

  async addblocked(id, @Req() req)
  {
    const blockedId: FindOptionsWhere<User> = {
      id: id,
    };
    const friend = await this.userRepository.findOne({
      relations: ['blockedBy'],
      where: {id: id},
    })
    if (!friend) {
      throw new NotFoundException();
    }
    const payload = verifyToken(req.headers.cookie);
    const myId: FindOptionsWhere<User> = {
      id: payload.sub,
    };
    const me = await this.userRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.blocked', 'friend')
    .where('user.id = :id', { id: payload.sub })
    .getOne();
    me.blocked.push(friend);
    friend.blockedBy.push(me)
    this.removefriends(id, req)
    this.userRepository.save(me);
    return {message: `${friend.username} was added to your blocked list.`}
  }

  async removeblocked(id: number, @Req() req)
  {
    const payload = verifyToken(req.headers.cookie);
    await this.userRepository.query(
      `DELETE FROM blocked WHERE ("userId" = $2 AND "blockedId" = $1)`,
      [id, payload.sub],
    );
    await this.userRepository.query(
      `DELETE FROM blockedBy WHERE ("userId" = $1 AND "blockedById" = $2)`,
      [id, payload.sub],
    );
    return {message: `${id} was removed from your friends`}
  }

  async updateDateDisconnect(id: number)
  {
    const user = await this.userRepository.findOne({
      where: {id}
    })
    if (!user)
      return;
    user.disconnectAt = new Date()
    await this.userRepository.save(user)
  }

  async uploadAvatar(avatar, payload)
  {
    await this.userRepository.update({id: payload.sub}, {avatar: process.env.DOMAIN_URL + avatar.path})
  }

  async getleaders()
  {
    const list = await this.userRepository
              .createQueryBuilder('user')
              .orderBy('user.winrate')
              .select([
                'user.id',
                'user.username',
                'user.avatar',
                'user.win',
                'user.losses',
                'user.winrate',
              ])
              .take(10)
    return list;
  }

  async search(query: string){
    const user =  await this.userRepository.find({
      where: {
        username: ILike(`%${query}%`),
      },
    });

    const chatroom = await this.chatRoomRepository.find({
      where: {
        privacy: In(['public', 'protected']),
        title: ILike(`%${query}%`),
      },
    });

    return {user, chatroom};
  }
}

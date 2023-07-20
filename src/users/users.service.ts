import { Injectable, NotAcceptableException, NotFoundException, Options, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, FindOneOptions, FindOptionsWhere, QueryFailedError, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { verifyToken } from 'src/utils/guard';
import { AddFriendDto } from './dto/add-friend.dto';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    return await this.userRepository.findOneBy({id : id});
  }

  async update(id: number, updateUserDto: UpdateUserDto, @Req() req) {
    const payload = verifyToken(req.headers.cookie);
    if (id != payload.sub)
      throw new EntityNotFoundError(User, {});
    
    const options: FindOneOptions<User> = {
      where: { id },
    };
    await this.userRepository.update({id}, {
    username: updateUserDto.username,
    avatar: updateUserDto.avatar,
    is2fa: updateUserDto.is2fa
    });

    const updatedUser = await this.userRepository.findOneOrFail(options);
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
    const friends = await this.userRepository.query(
      ` SELECT U2.id, U2.username, U2.avatar, U2."inGame", U2."statusOnline"
      FROM public.user U1
      JOIN friends F ON F."userId" = U1.id OR F."friendId" = U1.id
      JOIN public.user U2 ON U2.id = CASE
        WHEN F."userId" = U1.id THEN F."friendId"
        WHEN F."friendId" = U1.id THEN F."userId"
      END
      WHERE U1.id = $1;`,
      [id],
    );
    return friends;
  }

  async addfriends(addFriendDto: AddFriendDto, @Req() req)
  {
    const friendId: FindOptionsWhere<User> = {
      id: addFriendDto.id,
    };
    const friend = await this.userRepository.findOneBy(friendId)
    if (!friend) {
      throw new NotFoundException();
    }
    const payload = verifyToken(req.headers.cookie);
    const myId: FindOptionsWhere<User> = {
      id: payload.sub,
    };
    const isBlocked = await this.userRepository.query(
      ` SELECT * FROM blocked WHERE ("userId" = $1 AND "blockedId" = $2) OR ("userId" = $2 AND "blockedId" = $1);`,
      [addFriendDto.id, payload.sub],
    );

    if (isBlocked !== undefined && isBlocked.length > 0)
      throw new NotAcceptableException();
    const me = await this.userRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.friends', 'friend')
    .where('user.id = :id', { id: payload.sub })
    .getOne();
    me.friends.push(friend);
    await this.userRepository.save(me);
  }

  async removefriends(id: number, @Req() req)
  {
    const payload = verifyToken(req.headers.cookie);
    await this.userRepository.query(
      `DELETE FROM friends WHERE ("userId" = $1 AND "friendId" = $2) OR ("userId" = $2 AND "friendId" = $1); `,
      [id, payload.sub],
    );
  }
  //blocked
  async getblocked(id: number)
  {
    const blocked = await this.userRepository.query(
      ` SELECT U2.id, U2.username, U2.avatar, U2."inGame", U2."statusOnline"
      FROM public.user U1
      JOIN blocked F ON F."userId" = U1.id OR F."blockedId" = U1.id
      JOIN public.user U2 ON U2.id = CASE
        WHEN F."userId" = U1.id THEN F."blockedId"
        WHEN F."blockedId" = U1.id THEN F."userId"
      END
      WHERE U1.id = $1;`,
      [id],
    );
    return blocked;
  }

  async addblocked(addFriendDto: AddFriendDto, @Req() req)
  {
    const blockedId: FindOptionsWhere<User> = {
      id: addFriendDto.id,
    };
    const friend = await this.userRepository.findOneBy(blockedId)
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
    this.removefriends(addFriendDto.id, req)
    await this.userRepository.save(me);
  }

  async removeblocked(id: number, @Req() req)
  {
    const payload = verifyToken(req.headers.cookie);
    await this.userRepository.query(
      `DELETE FROM blocked WHERE ("userId" = $1 AND "blockedId" = $2) OR ("userId" = $2 AND "blockedId" = $1); `,
      [id, payload.sub],
    );
  }
}

import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  Options,
  Req,
  UseGuards,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  EntityNotFoundError,
  FindOneOptions,
  FindOptionsWhere,
  ILike,
  Not,
  Repository,
} from "typeorm";
import { User } from "./entities/user.entity";
import { verifyToken } from "src/utils/guard";
import { Achievement } from "src/achievement/entities/achievement.entity";
import { Game } from "src/game/entities/game.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Achievement)
    private readonly achievementRepository: Repository<Achievement>,
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
  ) {}

  async findAll() {
    return await this.userRepository.find();
  }

  async setOnline(id, statusOnline: boolean) {
    await this.userRepository.update({ id }, { statusOnline });
  }

  async checkUserisBlockedByUser(user1Id, user2Id) {
    var isblocked = false;
    const user = await this.userRepository.findOne({
      relations: ["blocked", "blockedBy"],
      where: { id: user1Id },
    });
    if (!user)
      throw new NotFoundException({message: "User Not Found"})
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

  async myprofile(id: number) {
    const user = await this.userRepository
      .createQueryBuilder("users")
      .leftJoinAndSelect("users.friends", "friends")
      .leftJoinAndSelect("users.blocked", "blocked")
      .leftJoinAndSelect("users.achievements", "achievement")
      .where("users.id = :id", { id })
      .select([
        "users.id",
        "users.username",
        "users.wins",
        "users.losses",
        "users.avatar",
        "users.validSession",
        "users.is2faEnabled",
        "friends.id",
        "friends.username",
        "friends.wins",
        "friends.losses",
        "friends.avatar",
        "blocked.id",
        "blocked.username",
        "blocked.avatar",
        "achievement.title",
        "achievement.image",
      ])
      .getOne();

    const games = await this.gameRepository
      .createQueryBuilder("game")
      .leftJoinAndSelect("game.user1", "user1")
      .leftJoinAndSelect("game.user2", "user2")
      .where("user1.id = :id or user2.id = :id", { id })
      .select([
        "game.id",
        "game.score",
        "game.winner",
        "game.mode",
        "user1.id",
        "user1.username",
        "user1.avatar",
        "user2.id",
        "user2.username",
        "user2.avatar",
      ])
      .getMany();
    user.games = games;
    return user;
  }

  async profile(id: number, payload) {
    if (await this.checkUserisBlockedByUser(id, payload.sub))
      throw new NotAcceptableException();
    const user = await this.userRepository
      .createQueryBuilder("users")
      .leftJoinAndSelect("users.friends", "friends")
      .leftJoinAndSelect("users.games", "games")
      .leftJoinAndSelect("users.achievements", "achievement")
      .where("users.id = :id", { id })
      .select([
        "users.id",
        "users.username",
        "users.wins",
        "users.losses",
        "users.avatar",
        "users.is2faEnabled",
        "friends.id",
        "friends.username",
        "friends.wins",
        "friends.losses",
        "friends.avatar",
        "achievement.title",
        "achievement.image",
      ])
      .getOne();

      if (!user)
        throw new NotFoundException({message: "User Not Found"})

      const games = await this.gameRepository
      .createQueryBuilder("game")
      .leftJoinAndSelect("game.user1", "user1")
      .leftJoinAndSelect("game.user2", "user2")
      .where("user1.id = :id or user2.id = :id", { id })
      .select([
        "game.id",
        "game.score",
        "game.winner",
        "game.mode",
        "user1.id",
        "user1.username",
        "user1.avatar",
        "user2.id",
        "user2.username",
        "user2.avatar",
      ])
      .getMany();
    user.games = games;
    return user;
  }

  async findOne(id: number) {
    return await this.userRepository.findOneBy({ id: id });
  }

  async update(id: number, username) {
    const options: FindOneOptions<User> = {
      where: { id },
    };
    const updatedUser = await this.userRepository.update(
      { id },
      {
        username,
      },
    );
    return updatedUser;
  }

  async updatesession(id: number, validSession) {
    const options: FindOneOptions<User> = {
      where: { id },
    };
    const updatedUser = await this.userRepository.update(
      { id },
      {
        validSession,
      },
    );
    return updatedUser;
  }

  async remove(id: number, @Req() req) {
    const payload = verifyToken(req.headers.cookie);
    if (id != payload.sub) throw new EntityNotFoundError(User, {});
    return await this.userRepository.delete({ id });
  }

  //friends
  async getfriends(id: number) {
    const friends = await this.userRepository
      .createQueryBuilder("users")
      .leftJoinAndSelect("users.friends", "friends")
      .where("users.id = :id", { id })
      .select([
        "users.username",
        "friends.id",
        "friends.username",
        "friends.avatar",
        "friends.inGame",
        "friends.statusOnline",
      ])
      .getOne();
    if (!friends) return null;
    return friends.friends;
  }

  async addfriends(id, @Req() req) {
    const friend = await this.userRepository.findOne({
      relations: ["friends"],
      select: ["id", "username", "avatar"],
      where: { id },
    });
    if (!friend) {
      throw new NotFoundException();
    }
    const payload = verifyToken(req.headers.cookie);
    if (id === payload.sub) throw new NotAcceptableException();
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
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.friends", "friend")
      .where("user.id = :id", { id: payload.sub })
      .getOne();
    me.friends.push(friend);
    friend.friends.push(me);
    this.userRepository.save(friend);
    this.userRepository.save(me);
    return { message: `${friend.username} was added to your friends.` };
  }

  async removefriends(id: number, @Req() req) {
    const payload = verifyToken(req.headers.cookie);
    const user = await this.userRepository.find({
      where: { id },
    });
    if (!user) throw new NotFoundException();
    await this.userRepository.query(
      `DELETE FROM friends WHERE ("userId" = $1 AND "friendId" = $2) OR ("userId" = $2 AND "friendId" = $1); `,
      [id, payload.sub],
    );
    return { message: `${id} was removed from your friends` };
  }
  //blocked
  async getblocked(id: number) {
    const blocked = await this.userRepository
      .createQueryBuilder("users")
      .leftJoinAndSelect("users.blocked", "blocked")
      .where("users.id = :id", { id })
      .select(["blocked.id", "blocked.username", "blocked.avatar"])
      .getOne();
    return blocked;
  }

  async addAchievement(title, id) {
    const user = await this.userRepository.findOne(id);
    const role = await this.achievementRepository.findOne(title);

    user.achievements.push(role);
    return await this.userRepository.save(user);
  }

  async addblocked(id, @Req() req) {
    const blockedId: FindOptionsWhere<User> = {
      id: id,
    };
    const friend = await this.userRepository.findOne({
      relations: ["blockedBy"],
      where: { id: id },
    });
    if (!friend) {
      throw new NotFoundException();
    }
    const payload = verifyToken(req.headers.cookie);
    const myId: FindOptionsWhere<User> = {
      id: payload.sub,
    };
    const me = await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.blocked", "friend")
      .where("user.id = :id", { id: payload.sub })
      .getOne();
    me.blocked.push(friend);
    friend.blockedBy.push(me);
    this.removefriends(id, req);
    this.userRepository.save(me);
    return { message: `${friend.username} was added to your blocked list.` };
  }

  async removeblocked(id: number, @Req() req) {
    const payload = verifyToken(req.headers.cookie);
    await this.userRepository.query(
      `DELETE FROM blocked WHERE ("userId" = $2 AND "blockedId" = $1)`,
      [id, payload.sub],
    );
    await this.userRepository.query(
      `DELETE FROM blockedBy WHERE ("userId" = $1 AND "blockedById" = $2)`,
      [id, payload.sub],
    );
    return { message: `${id} was removed from your friends` };
  }

  async updateDateDisconnect(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) return;
    user.disconnectAt = new Date();
    await this.userRepository.save(user);
  }

  async uploadAvatar(avatar, payload) {
    await this.userRepository.update(
      { id: payload.sub },
      { avatar: "http://10.32.120.112:3000/" + avatar.filename },
    );
  }

  async getleaders() {
    const list = await this.userRepository
      .createQueryBuilder("user")
      .select([
        "user.id",
        "user.username",
        "user.avatar",
        "user.wins",
        "user.losses",
      ])
      .orderBy("(user.wins / (user.wins + user.losses)) * 100", "DESC")
      .take(10)
      .getMany();
    return list;
  }

  async search(query: string) {
    const user = await this.userRepository.find({
      select: ["id", "avatar", "username", "wins", "losses"],
      where: {
        username: ILike(`%${query}%`),
      },
    });
    return user;
  }
}

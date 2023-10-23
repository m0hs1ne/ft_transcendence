import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
// import { CreateGameDto } from './dto/create-game.dto';
// import { UpdateGameDto } from './dto/update-game.dto';

@Injectable()
export class GameService {
  constructor(@InjectRepository(Game) private readonly gameRepository: Repository<Game>,
  @InjectRepository(User) private readonly userRepository: Repository<User>)
  {}
  async create(user1Id: number, user2Id:number, winner: number, score: string, mode: any) {
    const game = await this.gameRepository.create({
      user1Id,
      user2Id,
      winner,
      score,
      mode
    })
    this.gameRepository.save(game);
    this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ wins: () => "wins + 1" })
      .where("id = :id", { id: winner })
      .execute();
      const loser = (winner == user1Id ? user2Id : user1Id)
    this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ losses: () => "losses + 1" })
      .where("id = :id", { id: loser })
      .execute();
  }

  async setInGame(user1Id, user2Id, inGame:boolean)
  {
    await this.userRepository.update({id: user1Id}, {inGame})
    await this.userRepository.update({id: user2Id}, {inGame})
  }

//   findAll() {
//     return `This action returns all game`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} game`;
//   }

//   update(id: number, updateGameDto: UpdateGameDto) {
//     return `This action updates a #${id} game`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} game`;
//   }
}
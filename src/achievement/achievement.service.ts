import { Injectable } from '@nestjs/common';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { Achievement } from './entities/achievement.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AchievementService {
  constructor(@InjectRepository(Achievement) private readonly achievementRepository: Repository<Achievement>)
  {}
  async createAchievement(): Promise<Achievement[]> {
    const achievementToCreate = [
      { title: 'Sniper', image: 'alice@example.com' },
      { title: '10 Strike Wins', image: 'bob@example.com' },
      // Add more user objects here as needed
    ];

    const createdAchievement = await Promise.all(
      achievementToCreate.map(async userToCreate => {
        const newUser = this.achievementRepository.create(userToCreate);
        return await this.achievementRepository.save(newUser);
      })
    );

    return createdAchievement;
  }

  create(createAchievementDto: CreateAchievementDto) {
    return 'This action adds a new achievement';
  }

  findAll() {
    return `This action returns all achievement`;
  }

  findOne(id: number) {
    return `This action returns a #${id} achievement`;
  }

  update(id: number, updateAchievementDto: UpdateAchievementDto) {
    return `This action updates a #${id} achievement`;
  }

  remove(id: number) {
    return `This action removes a #${id} achievement`;
  }
}

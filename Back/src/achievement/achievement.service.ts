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
      { title: 'Sniper', image:  `${process.env.DOMAIN}/public/img/achievement.png`, description: "Get 10 goals from first touch" },
      { title: 'Clean Sheat', image:  `${process.env.DOMAIN}/public/img/achievement.png`, description: "Get 10 goals from first touch" },
      { title: '10 Strike Wins', image: `${process.env.DOMAIN}/public/img/achievement.png`, description: 'Win 10 games in row'},
      { title: 'Creator', image: `${process.env.DOMAIN}/public/img/achievement.png`, description: 'Create your own chat room' },
      { title: 'Shield Man', image: `${process.env.DOMAIN}/public/img/achievement.png`, description: 'Active two factor authentication' },
      { title: 'Feeling Pretty', image: `${process.env.DOMAIN}/public/img/achievement.png`, description: 'Change your profile picture' },
      // Add more Achievements objects here as needed
    ];

    const createdAchievement = await Promise.all(
      achievementToCreate.map(async userToCreate => {
        const newUser = this.achievementRepository.create(userToCreate);
        return await this.achievementRepository.save(newUser);
      })
    );

    return createdAchievement;
  }
}

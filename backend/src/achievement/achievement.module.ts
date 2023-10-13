import { Module } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achievement } from './entities/achievement.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Achievement]),
  ],
  providers: [AchievementService]
})
export class AchievementModule {
  constructor(private readonly achievementService: AchievementService) {}
  async onModuleInit() {
    const createdUsers = await this.achievementService.createAchievement();
  }

}

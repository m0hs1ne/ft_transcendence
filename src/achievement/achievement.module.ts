import { Module } from '@nestjs/common';
import { AchievementService } from './achievement.service';

@Module({
  providers: [AchievementService]
})
export class AchievementModule {}

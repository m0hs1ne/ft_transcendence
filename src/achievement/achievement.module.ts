import { Module } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achievement } from './entities/achievement.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Achievement, User]),
  ],
  providers: [AchievementService, UsersService, JwtService]
})
export class AchievementModule {
  constructor(private readonly achievementService: AchievementService) {}
  async onModuleInit() {
    const createdUsers = await this.achievementService.createAchievement();
  }
}

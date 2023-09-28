import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ChatRoomsModule } from './chat_rooms/chat_rooms.module';
import { config } from 'dotenv';
import { MessageModule } from './message/message.module';
import { AchievementModule } from './achievement/achievement.module';
import { UserChatModule } from './user_chat/user_chat.module';
import { GameModule } from './game/game.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

config();
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: ['dist/**/*.entity.js'],
      synchronize: true,
    }),
    UsersModule,
    ChatRoomsModule,
    MessageModule,
    AchievementModule,
    UserChatModule,
    GameModule,
    AuthModule,
    PassportModule.register({ session: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

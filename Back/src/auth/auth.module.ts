import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { FortyTwoStrategy } from './utils/42Strategy';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionSerializer } from './utils/Serializer';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './utils/jwtStrategy';
import { config } from 'dotenv';
import { googleStrategy } from './utils/googleStrategy';
import { TwoFactorAuthenticationController } from './utils/2fa.controller';
import { TwoFactorAuthenticationService } from './utils/2fa.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Achievement } from 'src/achievement/entities/achievement.entity';
import { Game } from 'src/game/entities/game.entity';

config();

/**
 * AuthModule
 * This module is responsible for the authentication of the user
 * It uses the 42 oauth and google oauth
 * It also uses jwt to generate a token and set it in a cookie
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Game,Achievement]),
    JwtModule.register({
      secret: process.env.SESSION_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController, TwoFactorAuthenticationController],
  providers: [FortyTwoStrategy,
    SessionSerializer,
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    }, AuthService, UsersService, JwtStrategy, googleStrategy, TwoFactorAuthenticationService],
})
export class AuthModule { }
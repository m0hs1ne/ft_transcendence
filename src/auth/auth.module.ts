import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { FortyTwoStrategy } from './utils/42Strategy';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/typeof';
import { SessionSerializer } from './utils/Serializer';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './utils/jwtStrategy';
import { config } from 'dotenv';
import { googleStrategy } from './utils/googleStrategy';
import { TwoFactorAuthenticationController } from './utils/2fa.controller';
import { TwoFactorAuthenticationService } from './utils/2fa.service';
import * as nodemailer from 'nodemailer';

config();

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
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
  }, AuthService,JwtStrategy, googleStrategy, TwoFactorAuthenticationService],
})
export class AuthModule { }
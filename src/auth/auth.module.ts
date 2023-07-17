import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { FortyTwoStrategy } from './utils/42Strategy';

@Module({
  controllers: [AuthController],
  providers: [FortyTwoStrategy],
})
export class AuthModule {}

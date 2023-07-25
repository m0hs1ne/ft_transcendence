import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from "dotenv";
import { User } from './typeorm/entities/typeof';
import { PassportModule } from '@nestjs/passport';

config();

@Module({
  imports: [AuthModule, TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [User],
    synchronize: true,
  }),
    PassportModule.register({ session: true })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

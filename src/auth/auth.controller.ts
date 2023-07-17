import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { FortyTwoStrategy } from './utils/42Strategy';
import { FortyTwoAuthGuard } from './utils/Guards';
import { Request } from 'express';

@Controller('auth')
export class AuthController {

    @Get('42/login')
    @UseGuards(FortyTwoAuthGuard)
    login() {
        return 'This action logs a user in';
    }

    @Get('42/callback')
    @UseGuards(FortyTwoAuthGuard)
    callback() {
        return 'This action handles the callback';
    }

    @Get('status')
    user(@Req() req: Request) {
        if(req.user) {
            return { msg: 'User is logged in' };
        }
        return { msg: 'User is not logged in' };
    }
}

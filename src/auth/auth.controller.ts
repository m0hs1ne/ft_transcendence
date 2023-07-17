import { Controller, Get, UseGuards } from '@nestjs/common';
import { FortyTwoStrategy } from './utils/42Strategy';
import { FortyTwoAuthGuard } from './utils/Guards';

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
}

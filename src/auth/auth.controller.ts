import { Controller, Get, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { FortyTwoAuthGuard, userAuthGuard } from './utils/Guards';
import e, { Request } from 'express';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService,
        private readonly jwtService:JwtService
        ) {}

    @Get('42/login')
    @UseGuards(FortyTwoAuthGuard)
    login() {
        return 'This action logs a user in';
    }

    @Get('42/callback')
    @UseGuards(FortyTwoAuthGuard)
    async callback(@Req() req: Request, @Res() res) {
        const payload = await this.authService.login(req.user);
        res.cookie('jwt', payload, { httpOnly: true });
        res.redirect('http://localhost:3000/api/auth/status');
    }

    @Get('status')
    @UseGuards(userAuthGuard)
    async user(@Req() req: Request) {
        return 'Logged in';
    }
}

import { Controller, Get, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { FortyTwoAuthGuard, googleAuthGuard, userAuthGuard } from './utils/Guards';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { googleStrategy } from './utils/googleStrategy';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService,
    ) { }

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
        res.redirect('http://localhost:3000/api/auth/success');
    }

    @Get('success')
    @UseGuards(userAuthGuard)
    async success(@Req() req: Request, @Res() res: Response) {
        const jwt = req.headers.cookie.split(';').find(c => c.trim().startsWith('jwt=')).split('=')[1];
        res.send({
            access_token: jwt,
        })
        res.end();
    }

    @Get('status')
    @UseGuards(userAuthGuard)
    async user(@Req() req: Request) {
        return 'Logged in';
    }

    @Get('logout')
    // @UseGuards(userAuthGuard)
    logout(@Req() req: Request, @Res() res: Response) {
        res.clearCookie('jwt');
        res.clearCookie('game');
        res.send('Logged out');
    }

    @Get('google/login')
    @UseGuards(googleAuthGuard)
    googleLogin() {
    }

    @Get('google/callback')
    @UseGuards(googleAuthGuard)
    async googleCallback(@Req() req: Request, @Res() res: Response) {
        const payload = await this.authService.login(req.user);
        res.cookie('jwt', payload, { httpOnly: true });
        res.redirect('http://localhost:3000/api/auth/success');
    }
}

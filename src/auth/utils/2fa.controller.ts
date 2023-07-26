import { Body, ClassSerializerInterceptor, Controller, HttpCode, Post, Req, Res, UnauthorizedException, UseGuards, UseInterceptors } from "@nestjs/common";
import { TwoFactorAuthenticationService } from "./2fa.service";
import { Request, Response } from 'express';
import { FortyTwoAuthGuard, userAuthGuard } from "./Guards";
import RequestWithUser from "src/utils/reqWithUser";
import { AuthService } from "../auth.service";



@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
    constructor(
        private readonly twoAuth: TwoFactorAuthenticationService,
        private readonly authService: AuthService
    ) { }

    /**
     * Generate a secret and a otpauthUrl then pipe the qrcode to the response
     * @returns the qrcode
     */
    @Post('generate')
    @UseGuards(userAuthGuard)
    async register(@Req() req: RequestWithUser, @Res() res: Response) {
        const user = await this.authService.getUserFromJwt(req);
        if (!user) return res.redirect('/login');
        const { otpauthUrl } = await this.twoAuth.generateTwoFactorAuthenticationSecret(user);
        await this.twoAuth.pipeQrCodeStream(otpauthUrl, res);
    }

    /**
     *  Check if the code is valid then turn on 2fa
     * 
     * @param req  The request
     * @param param1  The 2fa code
     * @returns  true if the code is valid, else false
     */
    @Post('turn-on')
    @HttpCode(200)
    @UseGuards(userAuthGuard)
    async turnOn2fa(@Req() req: RequestWithUser, @Body() { tfaCode }: { tfaCode: string }) {
        const user = await this.authService.getUserFromJwt(req);
        if (!user) return { message: 'User not found' };
        if (user.is2fa) return { message: '2fa is already enabled' };
        const isCodeValid = await this.twoAuth.isTwoFactorAuthenticationCodeValid(tfaCode, user);
        if (!isCodeValid) return { message: 'Invalid code' };
        await this.authService.turnOn2fa(user.id);
        return { message: '2fa is now enabled' };
    }

    /**
     *
     * Check if the code is valid then authenticate the user
     * @param req The request
     * @param res The response
     * @param param2 The 2fa code
     * @returns the user if the code is valid, else throw an error
     */
    @Post('authenticate')
    @HttpCode(200)
    @UseGuards(userAuthGuard)
    async authenticate(@Req() req: RequestWithUser, @Res() res: Response, @Body() { tfaCode }: { tfaCode: string }) {
        const user = await this.authService.getUserFromJwt(req);
        if (!user) return { message: 'User not found' };
        const isCodeValid = await this.twoAuth.isTwoFactorAuthenticationCodeValid(tfaCode, user);
        if (!isCodeValid) throw new UnauthorizedException('Invalid code');
        const jwt = await this.authService.getCookiesWithJwtToken(user.id);
        res.clearCookie('jwt');
        req.res.setHeader('Set-Cookie', jwt);
        return user;
    }

    /**
     * Check if the code is valid then turn off 2fa
     * @param req The request
     * @param param1 The 2fa code
     * @returns true if the code is valid, else false
     */
    @Post('turn-off')
    @HttpCode(200)
    @UseGuards(userAuthGuard)
    async turnOff2fa(@Req() req: RequestWithUser, @Body() { tfaCode }: { tfaCode: string }) {
        const user = await this.authService.getUserFromJwt(req);
        if (!user) return { message: 'User not found' };
        if (!user.is2fa) return { message: '2fa is already disabled' };
        const isCodeValid = await this.twoAuth.isTwoFactorAuthenticationCodeValid(tfaCode, user);
        if (!isCodeValid) return { message: 'Invalid code' };
        await this.authService.turnOff2fa(user.id);
        return { message: '2fa is now disabled' };
    }

    /**
     * Send an otp to the user email
     * @param req The request
     * @returns 200 if the email is sent, else 404
     */
    @Post('/mail/send-otp')
    @HttpCode(200)
    @UseGuards(userAuthGuard)
    async sendOTP(@Req() req: RequestWithUser) {
        const user = await this.authService.getUserFromJwt(req);
        if (!user) return { message: 'User not found' };
        const code = Math.floor(100000 + Math.random() * 900000);
        await this.authService.sendOTP(user, code.toString());
        return { message: 'OTP sent' };
    }
    /**
     * Check if the code is valid then turn on 2fa
     * @param req The request
     * @param param1 The otp code
     * @returns true if the code is valid, else false
     */
    @Post('/mail/turn-on')
    @HttpCode(200)
    @UseGuards(userAuthGuard)
    async turnOn2faMail(@Req() req: RequestWithUser, @Body() { otp }: { otp: string }) {
        const user = await this.authService.getUserFromJwt(req);
        if (!user) return { message: 'User not found' };
        if (user.is2fa) return { message: '2fa is already enabled' };
        const isCodeValid = await this.authService.isOTPValid(user, otp);
        if (!isCodeValid) return { message: 'Invalid code' };
        await this.authService.turnOn2fa(user.id);
        return { message: '2fa is now enabled' };
    }

    /**
     * Check if the code is valid then authenticate the user
     * @param req The request
     * @param res The response
     * @param param2 The otp code
     * @returns the user if the code is valid, else throw an error
     */
    @Post('/mail/authenticate')
    @HttpCode(200)
    @UseGuards(userAuthGuard)
    async authenticateMail(@Req() req: RequestWithUser, @Res() res: Response, @Body() { otp }: { otp: string }) {
        const user = await this.authService.getUserFromJwt(req);
        if (!user) return { message: 'User not found' };
        const isCodeValid = await this.authService.isOTPValid(user, otp);
        if (!isCodeValid) throw new UnauthorizedException('Invalid code');
        const jwt = await this.authService.getCookiesWithJwtToken(user.id);
        res.clearCookie('jwt');
        req.res.setHeader('Set-Cookie', jwt);
        return user;
    }

    /**
     * Check if the code is valid then turn off 2fa
     * @param req The request
     * @param param1 The otp code
     * @returns true if the code is valid, else false
     */
    @Post('/mail/turn-off')
    @HttpCode(200)
    @UseGuards(userAuthGuard)
    async turnOff2faMail(@Req() req: RequestWithUser, @Body() { otp }: { otp: string }) {
        const user = await this.authService.getUserFromJwt(req);
        if (!user) return { message: 'User not found' };
        if (!user.is2fa) return { message: '2fa is already disabled' };
        const isCodeValid = await this.authService.isOTPValid(user, otp);
        if (!isCodeValid) return { message: 'Invalid code' };
        await this.authService.turnOff2fa(user.id);
        return { message: '2fa is now disabled' };
    }

}
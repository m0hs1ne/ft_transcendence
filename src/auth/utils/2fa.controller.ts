import { ClassSerializerInterceptor, Controller, Post,Req, Res, UseGuards, UseInterceptors } from "@nestjs/common";
import { TwoFactorAuthenticationService } from "./2fa.service";
import { Request, Response } from 'express';
import { userAuthGuard } from "./Guards";
import RequestWithUser from "src/utils/reqWithUser";



@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
    constructor(
        private readonly twoAuth: TwoFactorAuthenticationService,
    ) {}

    @Post('generate')
    @UseGuards(userAuthGuard)
    async register(@Req() req: RequestWithUser , @Res() res: Response) {
        // user not available
        const {otpauthUrl } = await this.twoAuth.generateTwoFactorAuthenticationSecret(req.user);
        await this.twoAuth.pipeQrCodeStream(otpauthUrl, res);
    }

}
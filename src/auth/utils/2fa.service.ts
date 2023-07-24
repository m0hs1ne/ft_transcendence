import { Injectable } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { config } from 'dotenv';
import { User } from "src/typeorm/entities/typeof";
import { authenticator } from 'otplib';
import { toFileStream } from "qrcode";
import * as nodemailer from 'nodemailer';

config();



@Injectable()
export class TwoFactorAuthenticationService {

    constructor(
        private readonly authService: AuthService,
    ) {
    }

    public async generateTwoFactorAuthenticationSecret(user: any) {
        const secret = authenticator.generateSecret();
        const otpauthUrl = authenticator.keyuri(user.email, process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME, secret);
        await this.authService.set2faSecret(user.id, secret);
        return { secret, otpauthUrl };
    }

    public async pipeQrCodeStream(url: string, stream: any) {
        return toFileStream(stream, url);
    }

    public async isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: User) {
        // console.log(user);
        // console.log(twoFactorAuthenticationCode);
        const isCodeValid = authenticator.verify({
            token: twoFactorAuthenticationCode,
            secret: user.tfaSecret,
        });
        return isCodeValid;
    }
}
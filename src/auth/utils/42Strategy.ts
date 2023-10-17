import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-42";
import { config } from "dotenv";
import { Inject, Injectable } from "@nestjs/common";
import { AuthService } from "../auth.service";

config();
@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
    constructor(
        @Inject('AUTH_SERVICE') private readonly authService: AuthService,
    ) {
        super({
            clientID: process.env.FORTYTWO_CLIENT_ID,
            clientSecret: process.env.FORTYTWO_CLIENT_SECRET,
            callbackURL: process.env.FORTYTWO_CALLBACK_URL,
            scope: 'public',
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile) {
        // console.log(profile);
        // console.log(accessToken);
        // console.log(refreshToken);
        const user = await this.authService.validateUser({
            tfSecret: '',
            username: profile._json.login,
            email: profile._json.email,
            mailOTP: '',
            mailOTPExpires: null,
            avatar: profile._json.image.link,
            statusOnline: true,
            inGame: false,
            is2fa: false,
            friends: [],
            blocked: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return user || null;
    }
}
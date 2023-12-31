import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";
import { AuthService } from "../auth.service";
import { config } from "dotenv";

config();


@Injectable()
export class googleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        @Inject('AUTH_SERVICE') private readonly authService: AuthService,
    ) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            scope: ['profile', 'email']
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: any) {
        const user = await this.authService.validateUser({
            tfSecret: '',
            username: profile._json.given_name,
            email: profile._json.email,
            mailOTP: '',
            mailOTPExpires: null,
            avatar: profile._json.picture,
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
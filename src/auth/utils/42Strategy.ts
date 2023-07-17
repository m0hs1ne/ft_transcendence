import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-42";
import { config } from "dotenv";
import { Injectable } from "@nestjs/common";

config();
@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
    constructor() {
        super({
            clientID: process.env.FORTYTWO_CLIENT_ID,
            clientSecret: process.env.FORTYTWO_CLIENT_SECRET,
            callbackURL: process.env.FORTYTWO_CALLBACK_URL,
            scope: 'public',
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile) {
        console.log(profile);
        console.log(accessToken);
        console.log(refreshToken);
    }
}
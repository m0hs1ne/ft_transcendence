import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/typeorm/entities/typeof";
import { UserDetails } from "src/utils/types";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import RequestWithUser from "src/utils/reqWithUser";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { config } from "dotenv";
import * as nodemailer from 'nodemailer';

config();


@Injectable()
export class AuthService {
    private Transporter: nodemailer.Transporter;

    constructor(
        @InjectRepository(User) private readonly userRepository:
            Repository<User>,
        private readonly jwtService: JwtService,
    ) {
        this.Transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            }
        })
    }

    async validateUser(details: UserDetails) {
        // console.log(details);
        const user = await this.userRepository.findOneBy({ email: details.email })
        if (user) return user;
        // console.log('Creating new user...');
        const newUser = this.userRepository.create(details);
        return this.userRepository.save(newUser)
    }

    async findUser(id: number) {
        return await this.userRepository.findOneBy({ id: id });
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        return this.jwtService.sign(payload);
    }

    async set2faSecret(id: number, secret: string) {
        return this.userRepository.update(id, { tfaSecret: secret });
    }

    async getUserFromJwt(req: RequestWithUser) {
        try {
            const jwt = req.headers.cookie.split(';').find(c => c.trim().startsWith('jwt=')).split('=')[1];
            const decoded = await this.jwtService.decode(jwt);
            const id = decoded.sub;
            const user = await this.findUser(id);
            return user;
        } catch (e) {
            return null;
        }
    }

    async turnOn2fa(id: number) {
        return this.userRepository.update(id, { is2fa: true });
    }

    async turnOff2fa(id: number) {
        return this.userRepository.update(id, { is2fa: false });
    }

    public async getCookiesWithJwtToken(userId: number) {
        const payload = { userId };
        const token = this.jwtService.sign(payload,
            { secret: process.env.SESSION_SECRET, expiresIn: '1d' });
        return `jwt=${token}; HttpOnly; Path=/; Max-Age=${86400}`;

    }

    public async sendOTP(user: User, code: string) {
        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Two Factor Authentication',
            text: `Your two factor authentication code is ${code}`,
        };
        this.userRepository.update(user.id, { mailOTP: code });
        this.userRepository.update(user.id, { mailOTPExpire: new Date(Date.now() + 300000) });
        await this.Transporter.sendMail(mailOptions);
    }

    public async isOTPValid(user: User, code: string) {
        if (user.mailOTP === code) {
            if (user.mailOTPExpire > new Date(Date.now())) {
                return true;
            }
        }
        return false;
    }

}

@Injectable()
export class JwtTwoFactorStrategy extends PassportStrategy(Strategy, 'jwt-two-factor') {
    constructor(
        private readonly authService: AuthService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(req: RequestWithUser) => {
                return req?.headers?.cookie?.split(';').find(c => c.trim().startsWith('jwt=')).split('=')[1]
            }]),
            secretOrKey: process.env.SESSION_SECRET,
        });
    }

    async validate(payload: any) {
        const user = await this.authService.findUser(payload.userId);
        if (!user.is2fa) return user;
        if (payload.isSFA) return user;
    }
}
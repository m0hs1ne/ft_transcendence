import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserDetails } from "src/utils/types";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import RequestWithUser from "src/utils/reqWithUser";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { config } from "dotenv";
import * as nodemailer from 'nodemailer';
import { User } from "src/users/entities/user.entity";

config();

/**
 * AuthService
 * This service is responsible for the authentication of the user
 */
@Injectable()
export class AuthService {
    private Transporter: nodemailer.Transporter;

    /**
     * Constructor
     * @param userRepository
     * @param jwtService
     * 
     * It creates a transporter to send emails
     * It injects the user repository and the jwt service
     */
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

    /**
     * 
     * @param details The user details
     * @returns the user if it exists, else it creates a new user and returns it
     */
    async validateUser(details: UserDetails) {
        // console.log(details);
        const user = await this.userRepository.findOneBy({ email: details.email })
        if (user) return user;
        const user_name = await this.userRepository.findOneBy({ username: details.username })
        if (user_name)
            details.username = details.username + Math.floor(Math.random() * 1000);
        const newUser = this.userRepository.create(details);
        return this.userRepository.save(newUser)
    }

    /**
     * 
     * @param id The user id
     * @returns the user with the given id
     */
    async findUser(id: number) {
        return await this.userRepository.findOneBy({ id: id });
    }

    /**
     * 
     * @param user the user to login
     * @returns a jwt token with the user id and email
     */
    async login(user: any, is2faV: boolean) {
        if(user.is2faEnabled && !is2faV)
        {
            const payload = { email: user.email, sub: user.id, is2faV: false };
            return this.jwtService.sign(payload);
        }
        const payload = { email: user.email, sub: user.id , is2faV: true};
        return this.jwtService.sign(payload);
    }

    /**
     * 
     * @param id  The user id
     * @param secret  The 2fa secret
     * @returns the user with the given id and sets the 2fa secret
     */
    async set2faSecret(id: number, secret: string) {
        return this.userRepository.update(id, { tfaSecret: secret });
    }

    /**
     * 
     * @param req  The request
     * @returns the user from the jwt token in the cookie
     */
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

    /**
     * 
     * @param id  The user id
     * @returns the user with the given id and sets the 2fa to true
     */
    async turnOn2fa(id: number, type: string) {
        if(type === "GoogleAuth") {
            return this.userRepository.update(id, {is2faEnabled: true, is2faEnabledViaGoogleAuth: true});
        } else if(type === "Email") {
            return this.userRepository.update(id, { is2faEnabled: true, is2faEnabledViaEmail: true });
        }
    }

    /**
     * 
     * @param id  The user id
     * @returns the user with the given id and sets the 2fa to false
     */
    async turnOff2fa(id: number, type: string) {
        if(type === "GoogleAuth") {
            return this.userRepository.update(id, { is2faEnabled: false, is2faEnabledViaGoogleAuth: false });
        } else if(type === "Email") {
            return this.userRepository.update(id, { is2faEnabled: false, is2faEnabledViaEmail: false });
        }
    }

    /**
     * 
     * @param userId  The user id
     * @returns a cookie with a jwt token with the user id
     */
    public async getCookiesWithJwtToken(userId: number) {
        const payload = { userId };
        const token = this.jwtService.sign(payload,
            { secret: process.env.SESSION_SECRET, expiresIn: '1d' });
        return `jwt=${token}; HttpOnly; Path=/; Max-Age=${86400}`;

    }

    /**
     * 
     * @param user The user to send the email to
     * @param code The otp code
     * @returns sends an email to the user with the otp code
     */
    public async sendOTP(user: User, code: string) {
        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Two Factor Authentication',
            text: `Your two factor authentication code is ${code}`,
        };
        this.userRepository.update(user.id, { mailOTP: code });
        this.userRepository.update(user.id, { mailOTPExpire: new Date(Date.now() + 60000) });
        await this.Transporter.sendMail(mailOptions);
    }

    /**
     * 
     * @param user  The user to check the otp code
     * @param code  The otp code
     * @returns  true if the otp code is valid, else false
     */
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

    /**
     * 
     * @param authService The auth service
     */
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

    /**
     * 
     * @param payload The jwt payload
     * @returns the user with the given id
     */
    async validate(payload: any) {
        const user = await this.authService.findUser(payload.userId);
        if (!user.is2faEnabled) return user;
        if (payload.isSFA) return user;
    }
}
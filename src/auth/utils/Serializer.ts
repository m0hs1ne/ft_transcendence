import { PassportSerializer } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from 'src/typeorm/entities/typeof';

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(
        @Inject('AUTH_SERVICE') private readonly authService: AuthService,
    ) {
        super();
    }
    serializeUser(user: User, done: Function) {
        done(null, user);
    }
    async deserializeUser(payload: any, done: Function) {
        const user = this.authService.findUser(payload.id);
        return user ? done(null, user) : done(null, null);
    }
}
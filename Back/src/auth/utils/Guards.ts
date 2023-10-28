import { AuthGuard } from '@nestjs/passport';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class FortyTwoAuthGuard extends AuthGuard('42') {
    async canActivate(context: ExecutionContext) {
        const activate = (await super.canActivate(context)) as boolean;
        const request = context.switchToHttp().getRequest();
        await super.logIn(request);
        return activate;
    }
}

@Injectable()
export class googleAuthGuard extends AuthGuard('google') {
    async canActivate(context: ExecutionContext) {
        const activate = (await super.canActivate(context)) as boolean;
        const request = context.switchToHttp().getRequest();
        await super.logIn(request);
        return activate;
    }
}

@Injectable()
export class userAuthGuard implements CanActivate {

    constructor(private readonly jwtService: JwtService) { }

    canActivate(context: ExecutionContext) {
        try {
            const req = context.switchToHttp().getRequest();
            const cookies = req.headers.cookie;
            if (!cookies)
                throw new UnauthorizedException();
            const jwt = cookies.split(';').find(c => c.trim().startsWith('jwt=')).split('=')[1];
            const payload = this.jwtService.verify(jwt);
            if (!payload) return false;
            console.log(payload);
            // if(payload.is2faV === false) return false;
            return true;
        } catch (e) {
            throw new UnauthorizedException();
        }
    }
}
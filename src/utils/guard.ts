
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class userAuthGuard implements CanActivate {

    constructor(private readonly jwtService: JwtService) {}

    canActivate(context: ExecutionContext) {
        try {
        const req = context.switchToHttp().getRequest();
        const cookies = req.headers.cookie;
        if(!cookies) 
            throw new UnauthorizedException();
        const jwt = cookies.split(';').find((cookie) => cookie.includes('jwt')).split('=')[1];
        const payload = this.jwtService.verify(jwt);
        if(!payload) return false;
        return true;
        } catch (e) {
            throw new UnauthorizedException();
        }
    }
}
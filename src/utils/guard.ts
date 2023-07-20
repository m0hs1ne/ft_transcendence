
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { config } from "dotenv";
import * as jwt from 'jsonwebtoken';

config()
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
        const payload = this.jwtService.verify(jwt, {secret: process.env.SESSION_SECRET});
        if(!payload) return false;
        return true;
        } catch (e) {
            throw new UnauthorizedException();
        }
    }
}


export function verifyToken(cookie: string): any {
  try {
    const jwtToken = cookie.split(';').find((cookie) => cookie.includes('jwt')).split('=')[1];
    const payload = jwt.verify(jwtToken, process.env.SESSION_SECRET);
    return payload;
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else {
      throw new Error('Invalid token');
    }
  }
}
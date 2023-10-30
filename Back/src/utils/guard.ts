
import { CanActivate, ExecutionContext, Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { config } from "dotenv";
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt'
import { ColdObservable } from "rxjs/internal/testing/ColdObservable";

config()
@Injectable()
export class userAuthGuard implements CanActivate {

  constructor(private readonly jwtService: JwtService) { }

  canActivate(context: ExecutionContext) {
    try {
      const req = context.switchToHttp().getRequest();
      const cookies = req.headers.cookie;
      if (!cookies)
        throw new UnauthorizedException();
      const jwt = cookies.split(';').find((cookie) => cookie.includes('jwt')).split('=')[1];
      const payload = this.jwtService.verify(jwt, { secret: process.env.SESSION_SECRET });
      if (!payload) return false;
      return true;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}

@Injectable()
export class userWSAuthGuard implements CanActivate {

  constructor(private readonly jwtService: JwtService) { }

  canActivate(context: ExecutionContext) {
    try {
      const cookies = context.switchToWs().getData().token;
      if (!cookies)
        return false
      const jwt = cookies.split(';').find((cookie) => cookie.includes('jwt')).split('=')[1];
      const payload = this.jwtService.verify(jwt, { secret: process.env.SESSION_SECRET });
      if (!payload) return false;
      return true;
    } catch (e) {
      return false
    }
  }
}


@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    req.token = req.handshake.query.token;
    next();
  }
}

export function verifyToken(cookie: string): any {
  // //console.log(cookie);
  if (!cookie) {
    throw new Error('Cookie is undefined');
  }
  try {
    const jwtToken = cookie.split(';').find((cookie) => cookie.includes('jwt')).split('=')[1];
    const payload = jwt.verify(jwtToken, process.env.SESSION_SECRET);
    return payload;
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (err.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else {
      throw err;
    }
  }
}

export async function checkPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  const crypto = require('crypto');
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    const randomIndex = randomBytes[i] % characters.length;
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
}

export function validateCharacters(input) {
  if (input.trim().length === 0) {
    return false;
  }
  var pattern = /[^a-zA-Z0-9\s'".,?!:;\\]/;
  return !pattern.test(input);
}

export function isValidFileType(file: Express.Multer.File): boolean {
  const allowedFileTypes = ['.png', '.jpeg', '.jpg', '.gif'];
  const fileExtension = getFileExtension(file.originalname);
  
  return allowedFileTypes.includes(fileExtension.toLowerCase());
}

export function isValidFileSize(file: Express.Multer.File): boolean {
  const maxSizeInBytes = 1024 * 1024 * 4; // 4MB
  
  return file.size <= maxSizeInBytes;
}

function getFileExtension(filename: string): string {
  const extension = filename.split('.').pop();
  return extension ? `.${extension}` : '';
}
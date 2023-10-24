import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import {
  FortyTwoAuthGuard,
  googleAuthGuard,
  userAuthGuard,
} from "./utils/Guards";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import RequestWithUser from "src/utils/reqWithUser";
import { verify } from "crypto";
import { verifyToken } from "src/utils/guard";
import { UsersService } from "src/users/users.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  /**
   * Login with 42 , redirect to 42 oauth page then to callback route
   */
  @Get("42/login")
  @UseGuards(FortyTwoAuthGuard)
  login() {
    return "This action logs a user in";
  }

  /**
   * Callback route for 42 oauth, it generates a jwt token and set it in a cookie then redirect to success route
   */
  @Get("42/callback")
  @UseGuards(FortyTwoAuthGuard)
  async callback(@Req() req: RequestWithUser, @Res() res) {
    const payload = await this.authService.login(req.user, false);
    res.cookie("jwt", payload, { httpOnly: true });
    res.redirect("http://10.32.120.112:5173/");
  }

  /**
   * it checks if the user is logged in by checking the jwt cookie, then return the jwt token
   * @returns access_token
   */
  @Get("success")
  @UseGuards(userAuthGuard)
  async success(@Req() req: Request, @Res() res: Response) {
    const jwt = req.headers.cookie
      .split(";")
      .find((c) => c.trim().startsWith("jwt="))
      .split("=")[1];
    res.send({
      access_token: jwt,
    });
    res.end();
  }

  /**
   * Logout the user by clearing the jwt cookie and session cookie
   */
  @Get("logout")
  // @UseGuards(userAuthGuard)
  logout(@Req() req: Request, @Res() res) {
    const payload = verifyToken(req.headers.cookie);
    res.clearCookie("jwt");
    res.clearCookie("game");
    res.send("Logged out");
    this.userService.updatesession(payload.sub, false);
  }

  /**
   * Login with google, redirect to google oauth page then to callback route
   */
  @Get("google/login")
  @UseGuards(googleAuthGuard)
  googleLogin() {}

  /**
   * Callback route for google oauth, it generates a jwt token and set it in a cookie then redirect to success route
   */
  @Get("google/callback")
  @UseGuards(googleAuthGuard)
  async googleCallback(@Req() req: RequestWithUser, @Res() res) {
    const payload = await this.authService.login(req.user, false);
    res.cookie("jwt", payload, { httpOnly: true });
    res.redirect("http://10.32.120.112:5173/");
  }
}

import { type Request, type Response } from "express";

import { AuthService } from "./auth.service";

export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  login = async (
    req: Request,
    res: Response,
  ) => {
    const { email, password } = req.body;

    const result = await this.authService.login(
      email,
      password,
    );

    res.cookie(
      "refreshToken",
      result.refreshToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/auth",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      },
    );

    res.status(200).json({
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  };
}
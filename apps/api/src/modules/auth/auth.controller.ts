import { type Request, type Response } from "express";

import type { AuthService } from "./auth.service";
import { UnauthorizedError } from "../../errors/unauthorised.error";
import { NODE_ENV, REFRESH_TOKEN_EXPIRES_IN_DAYS } from "../../config/env";
import type { LoginInput, SignupInput } from "./auth.types";

const REFRESH_COOKIE_MAX_AGE = Number(REFRESH_TOKEN_EXPIRES_IN_DAYS) * 24 * 60 * 60 * 1000;

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  signup = async (req: Request, res: Response) => {
    const body = (req.body ?? {}) as Partial<SignupInput>;
    const name = typeof body.name === "string" ? body.name : "";
    const email = typeof body.email === "string" ? body.email : "";
    const password = typeof body.password === "string" ? body.password : "";
    const result = await this.authService.signup(name, email, password);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "lax",
      path: "/auth",
      maxAge: REFRESH_COOKIE_MAX_AGE,
    });

    return res.status(201).json({
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body as LoginInput;

    const result = await this.authService.login(email, password);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "lax",
      path: "/auth",
      maxAge: REFRESH_COOKIE_MAX_AGE,
    });

    res.status(200).json({
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  };

  refresh = async (req: Request, res: Response) => {
    const refreshToken = (req.cookies as Record<string, unknown>).refreshToken;

    if (typeof refreshToken !== "string" || !refreshToken) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const result = await this.authService.refresh(refreshToken);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "lax",
      path: "/auth",
      maxAge: REFRESH_COOKIE_MAX_AGE,
    });

    return res.status(200).json({
      data: {
        accessToken: result.accessToken,
      },
    });
  };

  logout = async (req: Request, res: Response) => {
    const refreshToken = (req.cookies as Record<string, unknown>).refreshToken;

    if (typeof refreshToken !== "string" || !refreshToken) {
      throw new UnauthorizedError("Invalid credentials");
    }
    await this.authService.logout(refreshToken);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "lax",
      path: "/auth",
    });

    return res.status(200).json({
      data: {
        message: "Logged out successfully",
      },
    });
  };

  me = async (req: Request, res: Response) => {
    const user = await this.authService.getCurrentUser(req.user!.id || "");

    return res.status(200).json({
      data: user,
    });
  };
}

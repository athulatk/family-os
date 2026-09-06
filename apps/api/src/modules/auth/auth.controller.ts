import { type Request, type Response } from "express";

import { AuthService } from "./auth.service";
import { UnauthorizedError } from "../../errors/unauthorised.error";
import { NODE_ENV } from "../../config/env";

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
        secure: NODE_ENV === "production",
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

  refresh = async (
  req: Request,
  res: Response,
) => {
  const refreshToken =
    req.cookies.refreshToken;

  if (!refreshToken) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const result = await this.authService.refresh(refreshToken);

  res.cookie(
    "refreshToken",
    result.refreshToken,
    {
      httpOnly: true,
      secure:
        NODE_ENV === "production",
      sameSite: "lax",
      path: "/auth",
      maxAge:
        30 * 24 * 60 * 60 * 1000,
    },
  );

  return res.status(200).json({
    data: {
      accessToken: result.accessToken,
    },
  });
};

logout = async (
  req: Request,
  res: Response,
) => {
  const refreshToken =
    req.cookies.refreshToken;

  if (!refreshToken) {
    throw new UnauthorizedError("Not logged in")
  }

  await this.authService.logout(refreshToken);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure:
      NODE_ENV === "production",
    sameSite: "lax",
    path: "/auth",
  });

  return res.status(200).json({
    data: {
      message: "Logged out successfully",
    },
  });
}

me = async (
  req: Request,
  res: Response,
) => {
  const user =
    await this.authService.getCurrentUser(
      req?.user?.id || "",
    );

  return res.status(200).json({
    data: user,
  });
};

};
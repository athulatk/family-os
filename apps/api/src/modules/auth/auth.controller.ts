import { type Request, type Response } from "express";
import { AuthService } from "./auth.service";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await this.authService.login(email, password);

    res.status(200).json({
      data: user,
    });
  };
}
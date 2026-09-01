import bcrypt from "bcrypt";

import { AuthRepository } from "./auth.repository";
import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
} from "./auth.utils";

export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
  ) {}

  async login(email: string, password: string) {
    const user = await this.authRepository.findUserByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const passwordValid = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (!passwordValid) {
      throw new Error("Invalid email or password");
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken();
    const refreshTokenHash = hashRefreshToken(refreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(
      expiresAt.getDate() + 30,
    );

    await this.authRepository.createSession(
      user.id,
      refreshTokenHash,
      expiresAt,
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      accessToken,
      refreshToken,
    };
  }
}
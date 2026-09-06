import bcrypt from "bcrypt";

import { AuthRepository } from "./auth.repository";
import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
} from "./auth.utils";
import { UnauthorizedError } from "../../errors/unauthorised.error";

export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
  ) {}

  async login(email: string, password: string) {
    const user = await this.authRepository.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const passwordValid = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (!passwordValid) {
      throw new UnauthorizedError("Invalid email or password");
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

async refresh(refreshToken: string) {
  const tokenHash =
    hashRefreshToken(refreshToken);

  const session =
    await this.authRepository.findSessionByTokenHash(
      tokenHash,
    );

  if (!session) {
    throw new UnauthorizedError("Invalid credentials");
  }

  if (session.revokedAt || session.expiresAt < new Date()) {
    throw new UnauthorizedError("Credentials expired");
  }

  // Revoke old session
  await this.authRepository.revokeSession(
    session.id,
  );

  // Generate new tokens
  const accessToken =
    generateAccessToken(session.user.id);

  const newRefreshToken =
    generateRefreshToken();

  const newRefreshTokenHash =
    hashRefreshToken(newRefreshToken);

  const expiresAt = new Date();

  expiresAt.setDate(
    expiresAt.getDate() + 30,
  );

  await this.authRepository.createSession(
    session.user.id,
    newRefreshTokenHash,
    expiresAt,
  );

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
}

async logout(refreshToken: string) {
  const tokenHash =
    hashRefreshToken(refreshToken);

  const session =
    await this.authRepository.findSessionByTokenHash(
      tokenHash,
    );

  if (!session) {
    return;
  }

  await this.authRepository.deleteSession(
    session.id,
  );
}

async getCurrentUser(userId: string) {
  console.log("userId", userId);
  const user =
    await this.authRepository.findUserById(
      userId,
    );

  if (!user) {
    throw new Error("User not found");
  }
  
  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}
};

import bcrypt from "bcrypt";

import type { AuthRepository } from "./auth.repository";
import { generateAccessToken, generateRefreshToken, hashRefreshToken } from "./auth.utils";
import { UnauthorizedError } from "../../errors/unauthorised.error";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_EXPIRES_IN_DAYS } from "../../config/env";
import { AppError } from "../../errors/app.error";
import { Prisma } from "../../generated/prisma/client";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async signup(name: string, email: string, password: string) {
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName) {
      throw new AppError(400, "Name is required");
    }

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      throw new AppError(400, "A valid email is required");
    }

    if (password.length < 8) {
      throw new AppError(400, "Password must be at least 8 characters long");
    }

    if (Buffer.byteLength(password, "utf8") > 72) {
      throw new AppError(400, "Password must not exceed 72 bytes");
    }

    if (!ACCESS_TOKEN_SECRET) {
      throw new Error("ACCESS_TOKEN_SECRET is not defined");
    }

    const existingUser = await this.authRepository.findUserByEmail(normalizedEmail);

    if (existingUser) {
      throw new AppError(409, "An account with this email already exists");
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const refreshToken = generateRefreshToken();
    const refreshTokenHash = hashRefreshToken(refreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + Number(REFRESH_TOKEN_EXPIRES_IN_DAYS));

    try {
      const user = await this.authRepository.createUserWithSession(
        normalizedName,
        normalizedEmail,
        passwordHash,
        refreshTokenHash,
        expiresAt,
      );

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        accessToken: generateAccessToken(user.id),
        refreshToken,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new AppError(409, "An account with this email already exists");
      }

      throw error;
    }
  }

  async login(email: string, password: string) {
    const user = await this.authRepository.findUserByEmail(email.trim().toLowerCase());

    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);

    if (!passwordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken();
    const refreshTokenHash = hashRefreshToken(refreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + Number(REFRESH_TOKEN_EXPIRES_IN_DAYS));

    await this.authRepository.createSession(user.id, refreshTokenHash, expiresAt);

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
    const tokenHash = hashRefreshToken(refreshToken);

    const session = await this.authRepository.findSessionByTokenHash(tokenHash);

    if (!session) {
      throw new UnauthorizedError("Invalid credentials");
    }

    if (session.revokedAt || session.expiresAt < new Date()) {
      throw new UnauthorizedError("Credentials expired");
    }

    // Revoke old session
    await this.authRepository.revokeSession(session.id);

    // Generate new tokens
    const accessToken = generateAccessToken(session.user.id);

    const newRefreshToken = generateRefreshToken();

    const newRefreshTokenHash = hashRefreshToken(newRefreshToken);

    const expiresAt = new Date();

    expiresAt.setDate(expiresAt.getDate() + Number(REFRESH_TOKEN_EXPIRES_IN_DAYS));

    await this.authRepository.createSession(session.user.id, newRefreshTokenHash, expiresAt);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshToken: string) {
    const tokenHash = hashRefreshToken(refreshToken);

    const session = await this.authRepository.findSessionByTokenHash(tokenHash);

    if (!session) {
      return;
    }

    await this.authRepository.deleteSession(session.id);
  }

  async getCurrentUser(userId: string) {
    const user = await this.authRepository.findUserById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}

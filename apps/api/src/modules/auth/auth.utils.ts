import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_EXPIRES_IN, ACCESS_TOKEN_SECRET } from "../../config/env";

export interface AccessTokenPayload {
  sub: string;
  type: "access";
}

export function generateAccessToken(userId: string) {
  if (!ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined");
  }

  return jwt.sign(
    {
      sub: userId,
      type: "access",
    },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    },
  );
}

export function generateRefreshToken() {
  return crypto.randomBytes(64).toString("hex");
}

export function hashRefreshToken(token: string) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}
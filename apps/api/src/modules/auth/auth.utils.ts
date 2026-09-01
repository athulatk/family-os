import crypto from "node:crypto";
import jwt from "jsonwebtoken";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

export interface AccessTokenPayload {
  sub: string;
  type: "access";
}

export function generateAccessToken(userId: string) {
  if (!accessTokenSecret) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined");
  }
  return jwt.sign(
    {
      sub: userId,
      type: "access",
    },
    accessTokenSecret,
    {
      expiresIn: "15m",
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
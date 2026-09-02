import {
  type Request,
  type Response,
  type NextFunction,
} from "express";

import jwt from "jsonwebtoken";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

export interface AccessTokenPayload {
  sub: string;
  type: "access";
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authorization =
    req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      error: {
        message: "Authentication required",
      },
    });
  }

  const [scheme, token] = authorization.split(" ");

  if (
    scheme !== "Bearer" ||
    !token
  ) {
    return res.status(401).json({
      error: {
        message: "Invalid authorization header",
      },
    });
  }

  if (!accessTokenSecret) {
  throw new Error(
    "ACCESS_TOKEN_SECRET is not defined",
  );
}


  try {
    const payload =
      jwt.verify(token, accessTokenSecret) as AccessTokenPayload;

    if (payload.type !== "access") {
      return res.status(401).json({
        error: {
          message: "Invalid access token",
        },
      });
    }

    req.user = {
      id: payload.sub,
    };

    next();
  } catch {
    return res.status(401).json({
      error: {
        message: "Invalid or expired access token",
      },
    });
  }
}
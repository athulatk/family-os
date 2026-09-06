import type { StringValue } from "ms";

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const PORT = process.env.PORT ?? 4000;
export const NODE_ENV =  process.env.NODE_ENV ?? 'development';
export const ACCESS_TOKEN_EXPIRES_IN = (process.env.ACCESS_TOKEN_EXPIRES_IN ?? "15m") as StringValue;
export const REFRESH_TOKEN_EXPIRES_IN_DAYS = process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS || 30;
export const DATABASE_URL = process.env.DATABASE_URL;
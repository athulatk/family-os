import IORedis from "ioredis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("REDIS_URL is required");
}

export const redis = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
});

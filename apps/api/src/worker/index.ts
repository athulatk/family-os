import "dotenv/config";

import { redis } from "../infra/redis";
import { emailWorker } from "./email.worker";

const shutdown = async () => {
  await emailWorker.close();
  await redis.quit();
};

process.once("SIGINT", () => void shutdown());
process.once("SIGTERM", () => void shutdown());

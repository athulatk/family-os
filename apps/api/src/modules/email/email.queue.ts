import { Queue } from "bullmq";
import { redis } from "../../infra/redis";

export const emailQueue = new Queue("email", {
  connection: redis,
});

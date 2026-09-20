import { emailQueue } from "./email.queue";
import type { GroupInvitationEmailJob } from "./email.types";

export class EmailService {
  async queueGroupInvitationEmail(data: GroupInvitationEmailJob) {
    await emailQueue.add("group-invitation", data, {
      attempts: 5,
      backoff: { type: "exponential", delay: 5_000 },
      removeOnComplete: { age: 24 * 60 * 60, count: 1_000 },
      removeOnFail: { age: 7 * 24 * 60 * 60, count: 5_000 },
    });
  }
}

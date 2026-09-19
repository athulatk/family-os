import { emailQueue } from "./email.queue";
import type { GroupInvitationEmailJob } from "./email.types";

export class EmailService {
  async queueGroupInvitationEmail(
    data: GroupInvitationEmailJob,
  ) {
    await emailQueue.add(
      "group-invitation",
      data,
    );
  }
}
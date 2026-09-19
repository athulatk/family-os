import { Worker } from "bullmq";
import { redis } from "../infra/redis";
import nodemailer from "nodemailer";
import type { GroupInvitationEmailJob } from "../modules/email/email.types";

const requiredEnvironmentVariables = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASSWORD",
  "EMAIL_FROM",
] as const;

for (const name of requiredEnvironmentVariables) {
  if (!process.env[name]) {
    throw new Error(`${name} is required`);
  }
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
      })[character]!,
  );

export const emailWorker = new Worker<GroupInvitationEmailJob>(
  "email",
  async (job) => {
    if (job.name !== "group-invitation") {
      throw new Error(`Unsupported email job: ${job.name}`);
    }

    const { email, groupName, invitationUrl } = job.data;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `You're invited to join ${groupName} on FamilyOS`,
      html: `
          <h2>You're invited to FamilyOS</h2>

          <p>
            You've been invited to join
            <strong>${escapeHtml(groupName)}</strong>.
          </p>

          <p>
            <a href="${escapeHtml(invitationUrl)}">
              Accept invitation
            </a>
          </p>

          <p>
            This invitation expires in 7 days.
          </p>
        `,
    });
  },
  {
    connection: redis,
  },
);

emailWorker.on("failed", (job, error) => {
  console.error(`Email job ${job?.id ?? "unknown"} failed`, error);
});

emailWorker.on("error", (error) => {
  console.error("Email worker error", error);
});

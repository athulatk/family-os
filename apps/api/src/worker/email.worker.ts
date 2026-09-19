import { Worker } from "bullmq";
import { redis } from "../infra/redis";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

type EmailJobData = {
  email: string;
  groupName: string;
  invitationUrl: string;
};

export const emailWorker = new Worker<EmailJobData>(
  "email",
  async (job) => {
    if (job.name === "group-invitation") {
      const {
        email,
        groupName,
        invitationUrl,
      } = job.data;

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `You're invited to join ${groupName} on FamilyOS`,
        html: `
          <h2>You're invited to FamilyOS</h2>

          <p>
            You've been invited to join
            <strong>${groupName}</strong>.
          </p>

          <p>
            <a href="${invitationUrl}">
              Accept invitation
            </a>
          </p>

          <p>
            This invitation expires in 7 days.
          </p>
        `,
      });
    }
  },
  {
    connection: redis,
  },
);
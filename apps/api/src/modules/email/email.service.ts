import nodemailer from "nodemailer";

export class EmailService {
  private readonly transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendGroupInvitation(email: string, groupName: string, invitationUrl: string) {
    await this.transporter.sendMail({
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
          FamilyOS helps families manage their shared
          finances and expenses.
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
}

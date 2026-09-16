import { AppError } from "../../../errors/app.error";
import type { EmailService } from "../../email/email.service";
import type { GroupRespository } from "../group.repository";
import type { InvitationRepository } from "./invitation.repository";
import { generateInvitationToken, hashInvitationToken } from "./invitation.utils";

export class InvitationService {
  constructor(
    private readonly invitationRepository: InvitationRepository,
    private readonly emailService: EmailService,
    private readonly groupRepository: GroupRespository,
  ) {}
  async sendInvite(createdById: string, groupId: string, email: string) {
    const normalizedEmail = email.trim().toLowerCase();

    const member = await this.invitationRepository.findGroupMember(groupId, createdById);

    if (!member) {
      throw new AppError(403, "You are not a member of this group");
    }

    if (member.role !== "OWNER") {
      throw new AppError(403, "Only the group owner can invite members");
    }

    const existingMember = await this.invitationRepository.findMemberByEmail(
      groupId,
      normalizedEmail,
    );

    if (existingMember) {
      throw new AppError(409, "User is already a member of this group");
    }

    const existingInvitation = await this.invitationRepository.findPendingInvitation(
      groupId,
      normalizedEmail,
    );

    if (existingInvitation) {
      throw new AppError(409, "An invitation is already pending for this email");
    }

    const token = generateInvitationToken();
    const tokenHash = hashInvitationToken(token);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const invitation = await this.invitationRepository.create({
      createdById,
      groupId,
      email: normalizedEmail,
      tokenHash,
      expiresAt,
    });

    const group = await this.groupRepository.findById(groupId);

    if (!group) {
      throw new AppError(404, "Group not found");
    }

    const invitationUrl = `${process.env.APP_URL}/invitations/${token}`;

    await this.emailService.sendGroupInvitation(normalizedEmail, group.name, invitationUrl);

    return {
      invitation,
      token,
    };
  }
}

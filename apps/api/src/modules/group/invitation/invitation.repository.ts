import { PrismaClient } from "../../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { DATABASE_URL } from "../../../config/env";
import { AppError } from "../../../errors/app.error";
import type { InvitationCreateInput } from "./invitation.types";

const adapter = new PrismaPg({
  connectionString: DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export class InvitationRepository {
  async findGroupMember(groupId: string, userId: string) {
    return prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
    });
  }

  async findMemberByEmail(groupId: string, email: string) {
    return prisma.groupMember.findFirst({
      where: {
        groupId,
        user: {
          email,
        },
      },
    });
  }

  async findPendingInvitation(groupId: string, email: string) {
    return prisma.invitation.findFirst({
      where: {
        groupId,
        email,
        status: "PENDING",
        expiresAt: {
          gt: new Date(),
        },
      },
    });
  }

  async create(data: InvitationCreateInput) {
    return prisma.invitation.create({
      data,
    });
  }

  async markFailed(id: string) {
    return prisma.invitation.update({
      where: { id },
      data: { status: "FAILED" },
    });
  }

  async accept(tokenHash: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const invitation = await tx.invitation.findUnique({
        where: { tokenHash },
        include: { group: true },
      });

      if (!invitation) {
        throw new AppError(404, "Invitation not found");
      }

      if (invitation.group.type === "PERSONAL") {
        throw new AppError(409, "Personal groups cannot accept members");
      }

      if (invitation.status !== "PENDING" && invitation.status !== "SENT") {
        throw new AppError(409, "Invitation is no longer available");
      }

      if (invitation.expiresAt <= new Date()) {
        throw new AppError(410, "Invitation has expired");
      }

      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });

      if (!user) {
        throw new AppError(404, "User not found");
      }

      if (user.email.trim().toLowerCase() !== invitation.email.trim().toLowerCase()) {
        throw new AppError(403, "This invitation belongs to another email address");
      }

      const existingMember = await tx.groupMember.findUnique({
        where: {
          groupId_userId: {
            groupId: invitation.groupId,
            userId,
          },
        },
      });

      if (existingMember) {
        throw new AppError(409, "User is already a member of this group");
      }

      const claimedInvitation = await tx.invitation.updateMany({
        where: {
          id: invitation.id,
          status: { in: ["PENDING", "SENT"] },
          expiresAt: { gt: new Date() },
        },
        data: { status: "ACCEPTED" },
      });

      if (claimedInvitation.count !== 1) {
        throw new AppError(409, "Invitation is no longer available");
      }

      const membership = await tx.groupMember.create({
        data: {
          groupId: invitation.groupId,
          userId,
          role: "MEMBER",
        },
      });

      const { group } = invitation;

      return {
        group,
        membership,
      };
    });
  }
}

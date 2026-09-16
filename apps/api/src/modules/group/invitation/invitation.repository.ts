import { PrismaClient } from "../../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { DATABASE_URL } from "../../../config/env";
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
}

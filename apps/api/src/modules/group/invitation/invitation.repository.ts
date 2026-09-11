
import { PrismaClient } from "../../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { DATABASE_URL } from "../../../config/env";
import type { InvitationCreateInput } from "./invitation.types";

const adapter = new PrismaPg({
  connectionString: DATABASE_URL!,
});

const prisma = new PrismaClient({adapter})

export class InvitationRepository {
    async create(data: InvitationCreateInput) {
        return prisma.invitation.create({
            data
        })
    }
}
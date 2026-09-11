import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";
import { DATABASE_URL } from "../../config/env";

import { InvitationStatus } from "../../generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: DATABASE_URL!,
});

const prisma = new PrismaClient({adapter});

export class GroupRespository{
    async findByUserId(userId: string){
        return prisma.group.findMany({
            where: {
                members: {
                    some: {
                        userId
                    },
                }
            },
            include: {
                members: true
            }
        })
    }

    async createGroup(userId: string, groupName: string){
        return prisma.$transaction(async (tx) => {
            const group = await tx.group.create({
                data: {
                    name: groupName
                }
            });

            await tx.groupMember.create({
                data: {
                    userId,
                    groupId: group.id,
                    role: "OWNER"
                }
            })

            return group;
        })
    }

}
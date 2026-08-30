import "dotenv/config";

import { PrismaClient } from "../src/generated/prisma/client";
import { FamilyRole } from "../src/generated/prisma/enums";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Starting database seed...");

  const athul = await prisma.user.create({
    data: {
      name: "Athul",
      email: "athul@example.com",
    },
  });

  const lins = await prisma.user.create({
    data: {
      name: "Lins",
      email: "lins@example.com",
    },
  });

  const family = await prisma.family.create({
    data: {
      name: "Athul & Lins",
    },
  });

  await prisma.familyMember.create({
    data: {
      userId: athul.id,
      familyId: family.id,
      role: FamilyRole.OWNER,
    },
  });

  await prisma.familyMember.create({
    data: {
      userId: lins.id,
      familyId: family.id,
      role: FamilyRole.MEMBER,
    },
  });

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
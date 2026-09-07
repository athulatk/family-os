import "dotenv/config";

import bcrypt from "bcrypt";

import { PrismaClient } from "../src/generated/prisma/client";
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
      passwordHash: await bcrypt.hash("password123", 10),
    },
  });

  const lins = await prisma.user.create({
    data: {
      name: "Lins",
      email: "lins@example.com",
      passwordHash: await bcrypt.hash("password123", 10),
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
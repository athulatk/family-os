-- CreateEnum
CREATE TYPE "GroupType" AS ENUM ('PERSONAL', 'SHARED');

-- AlterTable
ALTER TABLE "group"
ADD COLUMN "type" "GroupType" NOT NULL DEFAULT 'SHARED',
ADD COLUMN "personalOwnerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "group_personalOwnerId_key" ON "group"("personalOwnerId");

-- AddForeignKey
ALTER TABLE "group"
ADD CONSTRAINT "group_personalOwnerId_fkey"
FOREIGN KEY ("personalOwnerId") REFERENCES "user"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- Give every existing user a personal group and its sole owner membership.
INSERT INTO "group" ("id", "name", "type", "personalOwnerId", "createdAt", "updatedAt")
SELECT
  'personal_group_' || "id",
  'Personal',
  'PERSONAL'::"GroupType",
  "id",
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "user";

INSERT INTO "group_member" ("id", "userId", "groupId", "role", "joinedAt")
SELECT
  'personal_member_' || "id",
  "id",
  'personal_group_' || "id",
  'OWNER'::"GroupRole",
  CURRENT_TIMESTAMP
FROM "user";

-- A personal group must have an owner; a shared group must not have one.
ALTER TABLE "group"
ADD CONSTRAINT "group_personal_owner_check"
CHECK (
  ("type" = 'PERSONAL' AND "personalOwnerId" IS NOT NULL)
  OR
  ("type" = 'SHARED' AND "personalOwnerId" IS NULL)
);

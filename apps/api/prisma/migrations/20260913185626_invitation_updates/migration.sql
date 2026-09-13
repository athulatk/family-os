/*
  Warnings:

  - You are about to drop the column `createdBy` on the `invitation` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `invitation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiresAt` to the `invitation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tokenHash` to the `invitation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `invitation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "InvitationStatus" ADD VALUE 'PENDING';

-- DropIndex
DROP INDEX "invitation_email_key";

-- AlterTable
ALTER TABLE "invitation" DROP COLUMN "createdBy",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "tokenHash" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "invitation_groupId_idx" ON "invitation"("groupId");

-- CreateIndex
CREATE INDEX "invitation_createdById_idx" ON "invitation"("createdById");

-- CreateIndex
CREATE INDEX "invitation_email_idx" ON "invitation"("email");

-- CreateIndex
CREATE INDEX "invitation_email_status_idx" ON "invitation"("email", "status");

-- AddForeignKey
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

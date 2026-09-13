-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('SENT', 'ACCEPTED', 'FAILED');

-- CreateTable
CREATE TABLE "invitation" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "status" "InvitationStatus" NOT NULL,

    CONSTRAINT "invitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invitation_email_key" ON "invitation"("email");

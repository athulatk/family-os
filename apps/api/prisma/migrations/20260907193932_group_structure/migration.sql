/*
  Warnings:

  - You are about to drop the `family` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `family_budget` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `family_expense` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `family_expense_category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `family_member` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `personal_budget` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `personal_expense` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `personal_expense_category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `personal_income` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "GroupRole" AS ENUM ('OWNER', 'MEMBER');

-- DropForeignKey
ALTER TABLE "family_budget" DROP CONSTRAINT "family_budget_familyId_fkey";

-- DropForeignKey
ALTER TABLE "family_expense" DROP CONSTRAINT "family_expense_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "family_expense" DROP CONSTRAINT "family_expense_familyId_fkey";

-- DropForeignKey
ALTER TABLE "family_expense" DROP CONSTRAINT "family_expense_paidByMemberId_fkey";

-- DropForeignKey
ALTER TABLE "family_expense_category" DROP CONSTRAINT "family_expense_category_familyId_fkey";

-- DropForeignKey
ALTER TABLE "family_member" DROP CONSTRAINT "family_member_familyId_fkey";

-- DropForeignKey
ALTER TABLE "family_member" DROP CONSTRAINT "family_member_userId_fkey";

-- DropForeignKey
ALTER TABLE "personal_budget" DROP CONSTRAINT "personal_budget_userId_fkey";

-- DropForeignKey
ALTER TABLE "personal_expense" DROP CONSTRAINT "personal_expense_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "personal_expense" DROP CONSTRAINT "personal_expense_userId_fkey";

-- DropForeignKey
ALTER TABLE "personal_expense_category" DROP CONSTRAINT "personal_expense_category_userId_fkey";

-- DropForeignKey
ALTER TABLE "personal_income" DROP CONSTRAINT "personal_income_userId_fkey";

-- DropTable
DROP TABLE "family";

-- DropTable
DROP TABLE "family_budget";

-- DropTable
DROP TABLE "family_expense";

-- DropTable
DROP TABLE "family_expense_category";

-- DropTable
DROP TABLE "family_member";

-- DropTable
DROP TABLE "personal_budget";

-- DropTable
DROP TABLE "personal_expense";

-- DropTable
DROP TABLE "personal_expense_category";

-- DropTable
DROP TABLE "personal_income";

-- DropEnum
DROP TYPE "FamilyRole";

-- CreateTable
CREATE TABLE "group" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_member" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "role" "GroupRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "group_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budget" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "groupId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expense_category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "expense_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expense" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "note" TEXT,
    "spentAt" TIMESTAMP(3) NOT NULL,
    "groupId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "paidByMemberId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expense_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "group_member_userId_idx" ON "group_member"("userId");

-- CreateIndex
CREATE INDEX "group_member_groupId_idx" ON "group_member"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "group_member_groupId_userId_key" ON "group_member"("groupId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "group_member_groupId_id_key" ON "group_member"("groupId", "id");

-- CreateIndex
CREATE INDEX "budget_groupId_month_idx" ON "budget"("groupId", "month");

-- CreateIndex
CREATE UNIQUE INDEX "budget_groupId_month_key" ON "budget"("groupId", "month");

-- CreateIndex
CREATE INDEX "expense_category_groupId_isActive_idx" ON "expense_category"("groupId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "expense_category_groupId_name_key" ON "expense_category"("groupId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "expense_category_groupId_id_key" ON "expense_category"("groupId", "id");

-- CreateIndex
CREATE INDEX "expense_groupId_spentAt_idx" ON "expense"("groupId", "spentAt");

-- CreateIndex
CREATE INDEX "expense_categoryId_idx" ON "expense"("categoryId");

-- CreateIndex
CREATE INDEX "expense_paidByMemberId_idx" ON "expense"("paidByMemberId");

-- AddForeignKey
ALTER TABLE "group_member" ADD CONSTRAINT "group_member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_member" ADD CONSTRAINT "group_member_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget" ADD CONSTRAINT "budget_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense_category" ADD CONSTRAINT "expense_category_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense" ADD CONSTRAINT "expense_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense" ADD CONSTRAINT "expense_groupId_categoryId_fkey" FOREIGN KEY ("groupId", "categoryId") REFERENCES "expense_category"("groupId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense" ADD CONSTRAINT "expense_groupId_paidByMemberId_fkey" FOREIGN KEY ("groupId", "paidByMemberId") REFERENCES "group_member"("groupId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

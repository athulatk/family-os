-- CreateEnum
CREATE TYPE "FamilyRole" AS ENUM ('OWNER', 'MEMBER');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "family" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "family_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "family_member" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "role" "FamilyRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "family_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personal_income" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "source" TEXT NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personal_income_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personal_budget" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personal_budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personal_expense_category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personal_expense_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personal_expense" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "note" TEXT,
    "spentAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personal_expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "family_budget" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "familyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "family_budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "family_expense_category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "familyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "family_expense_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "family_expense" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "note" TEXT,
    "spentAt" TIMESTAMP(3) NOT NULL,
    "familyId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "paidByMemberId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "family_expense_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "family_member_userId_key" ON "family_member"("userId");

-- CreateIndex
CREATE INDEX "family_member_familyId_idx" ON "family_member"("familyId");

-- CreateIndex
CREATE INDEX "personal_income_userId_month_idx" ON "personal_income"("userId", "month");

-- CreateIndex
CREATE INDEX "personal_budget_userId_month_idx" ON "personal_budget"("userId", "month");

-- CreateIndex
CREATE UNIQUE INDEX "personal_budget_userId_month_key" ON "personal_budget"("userId", "month");

-- CreateIndex
CREATE INDEX "personal_expense_category_userId_isActive_idx" ON "personal_expense_category"("userId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "personal_expense_category_userId_name_key" ON "personal_expense_category"("userId", "name");

-- CreateIndex
CREATE INDEX "personal_expense_userId_spentAt_idx" ON "personal_expense"("userId", "spentAt");

-- CreateIndex
CREATE INDEX "personal_expense_categoryId_idx" ON "personal_expense"("categoryId");

-- CreateIndex
CREATE INDEX "family_budget_familyId_month_idx" ON "family_budget"("familyId", "month");

-- CreateIndex
CREATE UNIQUE INDEX "family_budget_familyId_month_key" ON "family_budget"("familyId", "month");

-- CreateIndex
CREATE INDEX "family_expense_category_familyId_isActive_idx" ON "family_expense_category"("familyId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "family_expense_category_familyId_name_key" ON "family_expense_category"("familyId", "name");

-- CreateIndex
CREATE INDEX "family_expense_familyId_spentAt_idx" ON "family_expense"("familyId", "spentAt");

-- CreateIndex
CREATE INDEX "family_expense_categoryId_idx" ON "family_expense"("categoryId");

-- CreateIndex
CREATE INDEX "family_expense_paidByMemberId_idx" ON "family_expense"("paidByMemberId");

-- AddForeignKey
ALTER TABLE "family_member" ADD CONSTRAINT "family_member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_member" ADD CONSTRAINT "family_member_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "family"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_income" ADD CONSTRAINT "personal_income_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_budget" ADD CONSTRAINT "personal_budget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_expense_category" ADD CONSTRAINT "personal_expense_category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_expense" ADD CONSTRAINT "personal_expense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_expense" ADD CONSTRAINT "personal_expense_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "personal_expense_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_budget" ADD CONSTRAINT "family_budget_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "family"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_expense_category" ADD CONSTRAINT "family_expense_category_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "family"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_expense" ADD CONSTRAINT "family_expense_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "family"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_expense" ADD CONSTRAINT "family_expense_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "family_expense_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_expense" ADD CONSTRAINT "family_expense_paidByMemberId_fkey" FOREIGN KEY ("paidByMemberId") REFERENCES "family_member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

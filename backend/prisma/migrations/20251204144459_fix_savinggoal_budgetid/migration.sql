/*
  Warnings:

  - You are about to drop the column `budetId` on the `SavingGoal` table. All the data in the column will be lost.
  - Added the required column `budgetId` to the `SavingGoal` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SavingGoal" DROP CONSTRAINT "SavingGoal_budgetId_fkey";

-- AlterTable
ALTER TABLE "Saving" ADD COLUMN     "savingGoalId" TEXT;

-- AlterTable
ALTER TABLE "SavingGoal" DROP COLUMN "budetId",
ADD COLUMN     "budgetId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Saving" ADD CONSTRAINT "Saving_savingGoalId_fkey" FOREIGN KEY ("savingGoalId") REFERENCES "SavingGoal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavingGoal" ADD CONSTRAINT "SavingGoal_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget"("id") ON DELETE CASCADE ON UPDATE CASCADE;

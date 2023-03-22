/*
  Warnings:

  - You are about to drop the column `ticketCount` on the `Activity` table. All the data in the column will be lost.
  - Added the required column `tN` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "ticketCount";

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "tN" TEXT NOT NULL;

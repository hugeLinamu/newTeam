/*
  Warnings:

  - You are about to drop the column `image` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `isShow` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `link` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Activity` table. All the data in the column will be lost.
  - Added the required column `content` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `townId` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "activityType" AS ENUM ('JD', 'HD', 'KJJD', 'XJJD', 'MSKZ');

-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_userId_fkey";

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "image",
DROP COLUMN "isShow",
DROP COLUMN "link",
DROP COLUMN "order",
DROP COLUMN "userId",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "ticketCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "townId" TEXT NOT NULL,
ADD COLUMN     "type" "activityType" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "money" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isHandle" BOOLEAN NOT NULL DEFAULT false,
    "price" INTEGER NOT NULL,
    "activityId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_townId_fkey" FOREIGN KEY ("townId") REFERENCES "Town"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

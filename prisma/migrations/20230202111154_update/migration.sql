/*
  Warnings:

  - You are about to drop the column `homeId` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `homeId` on the `Banner` table. All the data in the column will be lost.
  - You are about to drop the column `homeId` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `homeId` on the `Notice` table. All the data in the column will be lost.
  - You are about to drop the column `homeId` on the `Town` table. All the data in the column will be lost.
  - You are about to drop the `Home` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_homeId_fkey";

-- DropForeignKey
ALTER TABLE "Banner" DROP CONSTRAINT "Banner_homeId_fkey";

-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_homeId_fkey";

-- DropForeignKey
ALTER TABLE "Notice" DROP CONSTRAINT "Notice_homeId_fkey";

-- DropForeignKey
ALTER TABLE "Town" DROP CONSTRAINT "Town_homeId_fkey";

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "homeId";

-- AlterTable
ALTER TABLE "Banner" DROP COLUMN "homeId";

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "homeId";

-- AlterTable
ALTER TABLE "Notice" DROP COLUMN "homeId";

-- AlterTable
ALTER TABLE "Town" DROP COLUMN "homeId";

-- DropTable
DROP TABLE "Home";

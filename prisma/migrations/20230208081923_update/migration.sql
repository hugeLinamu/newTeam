/*
  Warnings:

  - You are about to drop the column `image` on the `Notice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Activity" ALTER COLUMN "order" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Notice" DROP COLUMN "image";

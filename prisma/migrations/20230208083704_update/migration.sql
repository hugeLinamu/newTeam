/*
  Warnings:

  - Added the required column `image` to the `Town` table without a default value. This is not possible if the table is not empty.
  - Added the required column `summary` to the `Town` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Town" ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "summary" TEXT NOT NULL;

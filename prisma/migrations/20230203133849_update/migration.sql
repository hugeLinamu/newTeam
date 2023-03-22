/*
  Warnings:

  - You are about to drop the column `image` on the `Banner` table. All the data in the column will be lost.
  - Added the required column `type` to the `Banner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Banner` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('VIDEO', 'PHOTO');

-- AlterTable
ALTER TABLE "Banner" DROP COLUMN "image",
ADD COLUMN     "type" "MediaType" NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;

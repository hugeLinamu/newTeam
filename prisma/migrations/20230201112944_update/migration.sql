-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER', 'BUSINESS');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

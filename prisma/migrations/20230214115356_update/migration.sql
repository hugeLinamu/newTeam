-- CreateEnum
CREATE TYPE "noteStatus" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "status" "noteStatus" NOT NULL DEFAULT 'PUBLIC';

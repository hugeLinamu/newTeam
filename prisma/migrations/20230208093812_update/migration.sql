-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "isRecommend" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "summary" TEXT;

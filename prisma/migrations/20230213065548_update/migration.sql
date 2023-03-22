-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "townId" TEXT;

-- AlterTable
ALTER TABLE "Town" ADD COLUMN     "pictures" TEXT[];

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_townId_fkey" FOREIGN KEY ("townId") REFERENCES "Town"("id") ON DELETE SET NULL ON UPDATE CASCADE;

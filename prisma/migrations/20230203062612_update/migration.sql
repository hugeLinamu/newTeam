/*
  Warnings:

  - Made the column `noteId` on table `NoteComment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "NoteComment" DROP CONSTRAINT "NoteComment_noteId_fkey";

-- AlterTable
ALTER TABLE "NoteComment" ALTER COLUMN "noteId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "NoteComment" ADD CONSTRAINT "NoteComment_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

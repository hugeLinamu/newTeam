/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `NoteCommentLike` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `NoteLike` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "NoteCommentLike_userId_key" ON "NoteCommentLike"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "NoteLike_userId_key" ON "NoteLike"("userId");

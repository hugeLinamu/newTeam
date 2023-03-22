/*
  Warnings:

  - Added the required column `link` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "link" TEXT NOT NULL;

UPDATE public."Activity"
SET link = 'abc'
WHERE id = 102;

UPDATE public."Activity"
SET link = 'abc'
WHERE id = 103;

UPDATE public."Activity"
SET link = 'abc'
WHERE id = 104;

UPDATE public."Activity"
SET link = 'abc'
WHERE id = 101;

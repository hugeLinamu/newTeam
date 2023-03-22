-- CreateTable
CREATE TABLE "MSTC" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "img" TEXT,
    "summary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "townId" TEXT NOT NULL,

    CONSTRAINT "MSTC_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MSTC" ADD CONSTRAINT "MSTC_townId_fkey" FOREIGN KEY ("townId") REFERENCES "Town"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - A unique constraint covering the columns `[slag]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slag` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "slag" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slag_key" ON "Tag"("slag");

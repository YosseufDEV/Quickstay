/*
  Warnings:

  - The primary key for the `HotelTag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `hotel_id` on the `HotelTag` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `HotelTag` table. All the data in the column will be lost.
  - You are about to drop the column `tag` on the `HotelTag` table. All the data in the column will be lost.
  - Added the required column `hotelId` to the `HotelTag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tagId` to the `HotelTag` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "HotelTag" DROP CONSTRAINT "HotelTag_hotel_id_fkey";

-- AlterTable
ALTER TABLE "HotelTag" DROP CONSTRAINT "HotelTag_pkey",
DROP COLUMN "hotel_id",
DROP COLUMN "id",
DROP COLUMN "tag",
ADD COLUMN     "hotelId" TEXT NOT NULL,
ADD COLUMN     "tagId" TEXT NOT NULL,
ADD CONSTRAINT "HotelTag_pkey" PRIMARY KEY ("hotelId", "tagId");

-- DropEnum
DROP TYPE "Tag";

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_HotelToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_HotelToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_HotelToTag_B_index" ON "_HotelToTag"("B");

-- AddForeignKey
ALTER TABLE "_HotelToTag" ADD CONSTRAINT "_HotelToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HotelToTag" ADD CONSTRAINT "_HotelToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

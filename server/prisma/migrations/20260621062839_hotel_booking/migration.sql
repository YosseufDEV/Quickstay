/*
  Warnings:

  - The primary key for the `Hotel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `HotelBooking` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `HotelBooking` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `HotelTag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_HotelToTag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `Hotel` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `hotel_id` on the `HotelBooking` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `user_id` on the `HotelBooking` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `hotelId` on the `HotelTag` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `A` on the `_HotelToTag` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "HotelBooking" DROP CONSTRAINT "HotelBooking_hotel_id_fkey";

-- DropForeignKey
ALTER TABLE "HotelBooking" DROP CONSTRAINT "HotelBooking_user_id_fkey";

-- DropForeignKey
ALTER TABLE "_HotelToTag" DROP CONSTRAINT "_HotelToTag_A_fkey";

-- AlterTable
ALTER TABLE "Hotel" DROP CONSTRAINT "Hotel_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "Hotel_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "HotelBooking" DROP CONSTRAINT "HotelBooking_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "hotel_id",
ADD COLUMN     "hotel_id" UUID NOT NULL,
DROP COLUMN "user_id",
ADD COLUMN     "user_id" UUID NOT NULL,
ADD CONSTRAINT "HotelBooking_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "HotelTag" DROP CONSTRAINT "HotelTag_pkey",
DROP COLUMN "hotelId",
ADD COLUMN     "hotelId" UUID NOT NULL,
ADD CONSTRAINT "HotelTag_pkey" PRIMARY KEY ("hotelId", "tagId");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "_HotelToTag" DROP CONSTRAINT "_HotelToTag_AB_pkey",
DROP COLUMN "A",
ADD COLUMN     "A" UUID NOT NULL,
ADD CONSTRAINT "_HotelToTag_AB_pkey" PRIMARY KEY ("A", "B");

-- CreateIndex
CREATE INDEX "HotelBooking_hotel_id_idx" ON "HotelBooking"("hotel_id");

-- CreateIndex
CREATE INDEX "HotelBooking_user_id_idx" ON "HotelBooking"("user_id");

-- AddForeignKey
ALTER TABLE "HotelBooking" ADD CONSTRAINT "HotelBooking_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotelBooking" ADD CONSTRAINT "HotelBooking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HotelToTag" ADD CONSTRAINT "_HotelToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

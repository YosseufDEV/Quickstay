/*
  Warnings:

  - The values [Free_WiFi,Pool_Access,Breakfast_Included,Room_service,Mountain_View] on the enum `Tag` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `exactAddress` on the `Hotel` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Hotel` table. All the data in the column will be lost.
  - You are about to drop the column `pricePerNight` on the `Hotel` table. All the data in the column will be lost.
  - You are about to drop the column `hotelId` on the `HotelTag` table. All the data in the column will be lost.
  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `exact_address` to the `Hotel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_url` to the `Hotel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price_per_night` to the `Hotel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hotel_id` to the `HotelTag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Tag_new" AS ENUM ('free_wifi', 'pool_access', 'mountain_view', 'breakfast_included', 'room_service');
ALTER TABLE "HotelTag" ALTER COLUMN "tag" TYPE "Tag_new" USING ("tag"::text::"Tag_new");
ALTER TYPE "Tag" RENAME TO "Tag_old";
ALTER TYPE "Tag_new" RENAME TO "Tag";
DROP TYPE "public"."Tag_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "HotelTag" DROP CONSTRAINT "HotelTag_hotelId_fkey";

-- AlterTable
ALTER TABLE "Hotel" DROP COLUMN "exactAddress",
DROP COLUMN "imageUrl",
DROP COLUMN "pricePerNight",
ADD COLUMN     "exact_address" TEXT NOT NULL,
ADD COLUMN     "image_url" TEXT NOT NULL,
ADD COLUMN     "price_per_night" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "HotelTag" DROP COLUMN "hotelId",
ADD COLUMN     "hotel_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "Users";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "HotelTag" ADD CONSTRAINT "HotelTag_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

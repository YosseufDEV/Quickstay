-- CreateEnum
CREATE TYPE "Tag" AS ENUM ('Free_WiFi', 'Pool_Access', 'Breakfast_Included', 'Room_service', 'Mountain_View');

-- CreateTable
CREATE TABLE "Hotel" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "exactAddress" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "pricePerNight" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "Hotel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HotelTag" (
    "id" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "tag" "Tag" NOT NULL,

    CONSTRAINT "HotelTag_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HotelTag" ADD CONSTRAINT "HotelTag_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

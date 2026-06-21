-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CheckInStatus" AS ENUM ('NOT_CHECKED_IN', 'CHECKED_IN', 'CHECKED_OUT');

CREATE EXTENSION IF NOT EXISTS btree_gist;

-- CreateTable
CREATE TABLE "HotelBooking" (
    "id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "from_to" tsrange NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "check_in_status" "CheckInStatus" NOT NULL DEFAULT 'NOT_CHECKED_IN',

    CONSTRAINT "HotelBooking_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "HotelBooking_from_to_idx" ON "HotelBooking" USING GIST ("from_to");
ALTER TABLE "HotelBooking" ADD CONSTRAINT "HotelBooking_from_to_excl" EXCLUDE USING GIST ("hotel_id" WITH =, "from_to" WITH &&);

-- CreateIndex
CREATE UNIQUE INDEX "HotelBooking_user_id_key" ON "HotelBooking"("user_id");

-- CreateIndex
CREATE INDEX "HotelBooking_hotel_id_idx" ON "HotelBooking"("hotel_id");

-- CreateIndex
CREATE INDEX "HotelBooking_user_id_idx" ON "HotelBooking"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "HotelBooking_hotel_id_user_id_key" ON "HotelBooking"("hotel_id", "user_id");

-- AddForeignKey
ALTER TABLE "HotelBooking" ADD CONSTRAINT "HotelBooking_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotelBooking" ADD CONSTRAINT "HotelBooking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

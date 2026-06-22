-- DropForeignKey
ALTER TABLE "HotelBooking" DROP CONSTRAINT "HotelBooking_hotel_id_fkey";

-- DropForeignKey
ALTER TABLE "HotelBooking" DROP CONSTRAINT "HotelBooking_user_id_fkey";

-- AddForeignKey
ALTER TABLE "HotelBooking" ADD CONSTRAINT "HotelBooking_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotelBooking" ADD CONSTRAINT "HotelBooking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

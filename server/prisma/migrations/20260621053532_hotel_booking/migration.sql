/*
  Warnings:

  - You are about to drop the column `status` on the `HotelBooking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "HotelBooking" DROP COLUMN "status" CASCADE,
ADD COLUMN  "booking_status" "BookingStatus" NOT NULL DEFAULT 'PENDING';

ALTER TABLE "HotelBooking"
ADD CONSTRAINT no_overlapping_bookings
EXCLUDE USING gist (
  hotel_id WITH =,
  from_to WITH &&
)
WHERE (booking_status NOT IN ('CANCELLED') AND check_in_status NOT IN ('CHECKED_OUT'));

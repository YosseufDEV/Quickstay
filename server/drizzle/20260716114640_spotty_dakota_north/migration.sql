CREATE TYPE "booking_status" AS ENUM('PENDING_PAYMENT', 'CONFIRMED', 'CANCELLED');--> statement-breakpoint
ALTER TABLE "hotels_bookings" ADD COLUMN "booking_status" text DEFAULT 'PENDING' NOT NULL;
ALTER TABLE "hotels_bookings" DROP CONSTRAINT "no_overlapping_bookings";--> statement-breakpoint
ALTER TABLE "hotels_bookings"
ADD CONSTRAINT no_overlapping_bookings
EXCLUDE USING gist (
  room_id WITH =,
  time_range WITH &&
)
WHERE (booking_status NOT IN ('CANCELLED') AND check_in_status NOT IN ('CHECKED_OUT'));--> statement-breakpoint

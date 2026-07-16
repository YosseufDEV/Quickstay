ALTER TABLE "hotels_bookings" ALTER COLUMN "booking_status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "hotels_bookings" DROP CONSTRAINT "no_overlapping_bookings";--> statement-breakpoint
ALTER TABLE "hotels_bookings" DROP COLUMN "booking_status";--> statement-breakpoint
ALTER TABLE "hotels_bookings" ADD COLUMN "booking_status" "booking_status" DEFAULT 'PENDING_PAYMENT'::"booking_status" NOT NULL;--> statement-breakpoint
ALTER TABLE "hotels_bookings"
ADD CONSTRAINT no_overlapping_bookings
EXCLUDE USING gist (
  room_id WITH =,
  time_range WITH &&
)
WHERE (booking_status NOT IN ('CANCELLED') AND check_in_status NOT IN ('CHECKED_OUT'));--> statement-breakpoint

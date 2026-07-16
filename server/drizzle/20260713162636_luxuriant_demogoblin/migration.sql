ALTER TABLE "hotels_bookings" ADD COLUMN "payment_status" "booking_status" DEFAULT 'PENDING'::"booking_status" NOT NULL;--> statement-breakpoint
ALTER TABLE "hotels_bookings" ADD COLUMN "payment_due_at" timestamp with time zone DEFAULT now() + interval '15 minutes' NOT NULL;--> statement-breakpoint
ALTER TABLE "hotels_bookings" ADD COLUMN "cancelled_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "hotels_bookings" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TYPE "booking_status" RENAME TO "payment_status";
ALTER TABLE "hotels_bookings" DROP CONSTRAINT "no_overlapping_bookings";--> statement-breakpoint
ALTER TABLE "hotels_bookings" DROP COLUMN "booking_status";--> statement-breakpoint
ALTER TABLE "hotels_bookings"
ADD CONSTRAINT no_overlapping_bookings
EXCLUDE USING gist (
  room_id WITH =,
  time_range WITH &&
)
WHERE (payment_status NOT IN ('CANCELLED') AND check_in_status NOT IN ('CHECKED_OUT'));--> statement-breakpoint
ALTER TABLE "hotels_bookings" ALTER COLUMN "time_range" SET DATA TYPE tstzrange USING "time_range"::tstzrange;

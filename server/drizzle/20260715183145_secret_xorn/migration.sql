CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"booking_id" uuid NOT NULL,
	"stripe_payment_intent_id" text NOT NULL UNIQUE,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"payment_status" "payment_status" DEFAULT 'PENDING'::"payment_status" NOT NULL,
	"paid_at" timestamp with time zone,
	"refunded_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "hotels_bookings" DROP CONSTRAINT "no_overlapping_bookings";--> statement-breakpoint
ALTER TABLE "hotels_bookings"
ADD CONSTRAINT "no_overlapping_bookings" EXCLUDE USING gist (
    room_id WITH =,
    time_Range WITH &&
);--> statement-breakpoint
ALTER TABLE "hotels_bookings" DROP COLUMN "payment_status";--> statement-breakpoint
ALTER TABLE "hotels_bookings" DROP COLUMN "payment_due_at";--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_booking_id_hotels_bookings_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "hotels_bookings"("id") ON DELETE CASCADE;

CREATE TABLE "hotels_bookings_payments" (
	"booking_id" uuid,
	"payment_id" uuid,
	CONSTRAINT "hotels_bookings_payments_pkey" PRIMARY KEY("booking_id","payment_id")
);
--> statement-breakpoint
ALTER TABLE "payments" DROP CONSTRAINT "payments_booking_id_hotels_bookings_id_fkey";--> statement-breakpoint
ALTER TABLE "payments" DROP COLUMN "booking_id";--> statement-breakpoint
ALTER TABLE "hotels_bookings_payments" ADD CONSTRAINT "hotels_bookings_payments_booking_id_hotels_bookings_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "hotels_bookings"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "hotels_bookings_payments" ADD CONSTRAINT "hotels_bookings_payments_payment_id_payments_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE CASCADE;
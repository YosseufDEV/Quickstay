ALTER TABLE "hotels_fees" RENAME COLUMN "amount" TO "percentage";--> statement-breakpoint
ALTER TABLE "hotels_bookings" ADD COLUMN "checked_in_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "hotels_bookings" ADD COLUMN "checked_out_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "payment_status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "payment_status" DROP DEFAULT;--> statement-breakpoint
DROP TYPE "payment_status";--> statement-breakpoint
CREATE TYPE "payment_status" AS ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED');--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "payment_status" SET DATA TYPE "payment_status" USING "payment_status"::"payment_status";--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "payment_status" SET DEFAULT 'PENDING'::"payment_status";
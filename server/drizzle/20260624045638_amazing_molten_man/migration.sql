CREATE TYPE "room_status" AS ENUM('AVAILABLE', 'BOOKED', 'MAINTENANCE');--> statement-breakpoint
ALTER TABLE "hotels" DROP CONSTRAINT "hotels_booked_by_users_id_fkey";--> statement-breakpoint
ALTER INDEX "hotels_bookings_from_to_idx" RENAME TO "hotels_bookings_time_range_idx";--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "status" "room_status" DEFAULT 'AVAILABLE'::"room_status" NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "booked_by" uuid;--> statement-breakpoint
ALTER TABLE "hotels" DROP COLUMN "booked_by";--> statement-breakpoint
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_booked_by_users_id_fkey" FOREIGN KEY ("booked_by") REFERENCES "users"("id") ON DELETE SET NULL;
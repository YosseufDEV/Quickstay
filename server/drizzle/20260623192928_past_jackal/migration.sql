ALTER TABLE "hotels_bookings" DROP CONSTRAINT "hotels_bookings_hotel_id_hotels_id_fkey";--> statement-breakpoint
DROP INDEX "hotels_bookings_hotel_id_idx";--> statement-breakpoint
ALTER TABLE "hotels_bookings" ADD COLUMN "room_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "image_url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "hotels_bookings" DROP COLUMN "hotel_id";--> statement-breakpoint
CREATE INDEX "hotels_bookings_room_id_idx" ON "hotels_bookings" ("room_id");--> statement-breakpoint
ALTER TABLE "hotels_bookings" ADD CONSTRAINT "hotels_bookings_room_id_rooms_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE;
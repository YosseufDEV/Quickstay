ALTER TABLE "rooms" DROP CONSTRAINT "rooms_hotel_id_room_type_fkey";--> statement-breakpoint
DROP INDEX "rooms_room_type_idx";--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "type_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" DROP COLUMN "type";--> statement-breakpoint
ALTER TABLE "hotels_bookings" ADD CONSTRAINT "hotels_bookings_room_time_range_user_id_unique" UNIQUE("room_id","time_range","user_id");--> statement-breakpoint
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_type_id_hotels_catalogs_id_fkey" FOREIGN KEY ("type_id") REFERENCES "hotels_catalogs"("id") ON DELETE CASCADE;
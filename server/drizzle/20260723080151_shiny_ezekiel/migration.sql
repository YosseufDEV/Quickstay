ALTER TABLE "hotels_bookings" ADD COLUMN "room_type_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "hotels_bookings" DROP CONSTRAINT "hotels_bookings_room_time_range_user_id_unique";--> statement-breakpoint
ALTER TABLE "hotels_bookings" ADD CONSTRAINT "hotels_bookings_room_time_range_user_id_unique" UNIQUE("room_type_id","time_range","user_id");--> statement-breakpoint
ALTER TABLE "hotels_bookings" ADD CONSTRAINT "hotels_bookings_room_type_id_hotels_catalogs_id_fkey" FOREIGN KEY ("room_type_id") REFERENCES "hotels_catalogs"("id") ON DELETE CASCADE;
ALTER TABLE "hotels_bookings" DROP CONSTRAINT "hotels_bookings_room_type_time_range_user_id_unique";--> statement-breakpoint

CREATE UNIQUE INDEX "hotels_bookings_room_type_id_time_range_user_id_unique" 
ON hotels_bookings("room_type_id", "time_range", "user_id") WHERE "booking_status" = 'PENDING_PAYMENT';--> statement-breakpoint

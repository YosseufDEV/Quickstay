CREATE TABLE "rooms_time_ranges_locks" (
	"room_id" uuid,
	"booking_id" uuid NOT NULL,
	"time_range" tstzrange,
	"locked_until" timestamp with time zone NOT NULL,
	"locked_for" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "rooms_time_ranges_locks_pkey" PRIMARY KEY("room_id","time_range")
);
--> statement-breakpoint
CREATE INDEX "rooms_time_ranges_locks_room_id_idx" ON "rooms_time_ranges_locks" ("room_id");--> statement-breakpoint
CREATE INDEX "rooms_time_ranges_locks_time_range_idx" ON "rooms_time_ranges_locks" USING gist ("time_range");--> statement-breakpoint
ALTER TABLE "rooms_time_ranges_locks" ADD CONSTRAINT "rooms_time_ranges_locks_room_id_rooms_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "rooms_time_ranges_locks" ADD CONSTRAINT "rooms_time_ranges_locks_booking_id_hotels_bookings_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "hotels_bookings"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "rooms_time_ranges_locks" ADD CONSTRAINT "rooms_time_ranges_locks_locked_for_users_id_fkey" FOREIGN KEY ("locked_for") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint

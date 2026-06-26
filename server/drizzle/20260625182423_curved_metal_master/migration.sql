CREATE INDEX "rooms_hotel_id_idx" ON "rooms" ("hotel_id");--> statement-breakpoint
CREATE INDEX "rooms_booked_by_idx" ON "rooms" ("booked_by");--> statement-breakpoint
CREATE INDEX "rooms_status_idx" ON "rooms" ("status");--> statement-breakpoint
CREATE INDEX "rooms_room_type_idx" ON "rooms" ("room_type");
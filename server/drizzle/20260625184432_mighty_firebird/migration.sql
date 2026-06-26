DROP INDEX "rooms_status_idx";--> statement-breakpoint
CREATE INDEX "rooms_hotel_status_idx" ON "rooms" ("hotel_id","status");
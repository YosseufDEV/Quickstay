CREATE TABLE "hotels_catalogs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"hotel_id" uuid NOT NULL,
	"room_type" "room_type" DEFAULT 'SINGLE'::"room_type" NOT NULL,
	"image_url" text NOT NULL,
	"pricePerNight" integer NOT NULL
);
--> statement-breakpoint
DROP TABLE "hotel_rooms";--> statement-breakpoint
ALTER TABLE "amenities" RENAME COLUMN "slag" TO "slug";--> statement-breakpoint
CREATE INDEX "hotel_catalog_id_idx" ON "hotels_catalogs" ("hotel_id");--> statement-breakpoint
ALTER TABLE "hotels_catalogs" ADD CONSTRAINT "hotels_catalogs_hotel_id_hotels_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE;
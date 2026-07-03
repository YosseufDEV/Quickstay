ALTER TYPE "role" ADD VALUE 'HOTEL_OWNER';--> statement-breakpoint
ALTER TYPE "role" ADD VALUE 'HOTEL_STAFF';--> statement-breakpoint
ALTER TYPE "role" ADD VALUE 'GUEST';--> statement-breakpoint
CREATE TABLE "hotel_rooms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"hotel_id" uuid NOT NULL,
	"room_type" "room_type" DEFAULT 'SINGLE'::"room_type" NOT NULL,
	"image_url" text NOT NULL,
	"type_price" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "room_number" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" DROP COLUMN "image_url";--> statement-breakpoint
ALTER TABLE "rooms" DROP COLUMN "price_per_night";--> statement-breakpoint
CREATE INDEX "hotel_rooms_hotel_id_idx" ON "hotel_rooms" ("hotel_id");--> statement-breakpoint
ALTER TABLE "hotel_rooms" ADD CONSTRAINT "hotel_rooms_hotel_id_hotels_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE;
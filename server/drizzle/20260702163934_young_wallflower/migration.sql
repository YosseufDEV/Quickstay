ALTER TABLE "hotels_catalogs" ADD COLUMN "area" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "hotels_catalogs" ADD COLUMN "number_of_guests" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "hotels_catalogs" ALTER COLUMN "room_type" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "hotels_catalogs" ALTER COLUMN "room_type" SET DATA TYPE text USING "room_type"::text;--> statement-breakpoint
ALTER TABLE "hotels_catalogs" ALTER COLUMN "room_type" SET DEFAULT 'Standard Room';--> statement-breakpoint
ALTER TABLE "rooms" ALTER COLUMN "room_type" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "rooms" ALTER COLUMN "room_type" SET DATA TYPE text USING "room_type"::text;--> statement-breakpoint
ALTER TABLE "hotels_catalogs" ADD CONSTRAINT "hotel_catalog_hotel_room_type_unique" UNIQUE("hotel_id","room_type");--> statement-breakpoint
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_hotel_room_number_unique" UNIQUE("hotel_id","room_number");--> statement-breakpoint
DROP TYPE "room_type";
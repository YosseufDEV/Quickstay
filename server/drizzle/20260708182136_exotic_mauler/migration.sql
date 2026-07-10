CREATE EXTENSION IF NOT EXISTS "btree_gist";--> statement-breakpoint
CREATE TYPE "booking_status" AS ENUM('PENDING', 'CONFIRMED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "check_in_status" AS ENUM('NOT_CHECKED_IN', 'CHECKED_IN', 'CHECKED_OUT');--> statement-breakpoint
CREATE TYPE "role" AS ENUM('USER', 'ADMIN', 'HOTEL_OWNER', 'HOTEL_STAFF', 'GUEST');--> statement-breakpoint
CREATE TYPE "room_status" AS ENUM('READY', 'CLEANING', 'MAINTENANCE');--> statement-breakpoint
CREATE TABLE "amenities" (
	"id" serial PRIMARY KEY,
	"slug" text NOT NULL UNIQUE
);
--> statement-breakpoint
CREATE TABLE "hotels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"rating" real NOT NULL,
	"name" text NOT NULL,
	"exact_address" text NOT NULL,
	"address" text NOT NULL,
	"image_url" text NOT NULL,
	"check_in_time" time NOT NULL,
	"check_out_time" time NOT NULL,
	"time_zone" text DEFAULT 'UTC' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "hotel_check_in_out_date_check" CHECK ("check_in_time" > "check_out_time")
);
--> statement-breakpoint
CREATE TABLE "hotels_amenities" (
	"hotel_id" uuid,
	"amenity_id" integer,
	CONSTRAINT "hotels_amenities_pkey" PRIMARY KEY("hotel_id","amenity_id")
);
--> statement-breakpoint
CREATE TABLE "hotels_bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"room_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"time_range" tstzrange NOT NULL,
	"booking_status" "booking_status" DEFAULT 'PENDING'::"booking_status" NOT NULL,
	"check_in_status" "check_in_status" DEFAULT 'NOT_CHECKED_IN'::"check_in_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hotels_catalogs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"hotel_id" uuid NOT NULL,
	"room_type" text DEFAULT 'Standard Room' NOT NULL,
	"image_url" text NOT NULL,
	"area" integer NOT NULL,
	"number_of_guests" integer DEFAULT 1 NOT NULL,
	"price_per_night" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "hotel_catalog_hotel_room_type_unique" UNIQUE("hotel_id","room_type")
);
--> statement-breakpoint
CREATE TABLE "rooms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"hotel_id" uuid NOT NULL,
	"room_type" text NOT NULL,
	"room_number" integer NOT NULL,
	"status" "room_status" DEFAULT 'READY'::"room_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "rooms_hotel_room_number_unique" UNIQUE("hotel_id","room_number")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"country" text NOT NULL,
	"password" text NOT NULL,
	"role" "role" DEFAULT 'USER'::"role" NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "hotel_created_at_idx" ON "hotels" ("created_at");--> statement-breakpoint
CREATE INDEX "hotels_bookings_room_id_idx" ON "hotels_bookings" ("room_id");--> statement-breakpoint
CREATE INDEX "hotels_bookings_user_id_idx" ON "hotels_bookings" ("user_id");--> statement-breakpoint
CREATE INDEX "hotels_bookings_time_range_idx" ON "hotels_bookings" USING gist ("time_range");--> statement-breakpoint
CREATE INDEX "hotel_catalog_id_idx" ON "hotels_catalogs" ("hotel_id");--> statement-breakpoint
CREATE INDEX "rooms_hotel_id_idx" ON "rooms" ("hotel_id");--> statement-breakpoint
CREATE INDEX "rooms_hotel_status_idx" ON "rooms" ("hotel_id","status");--> statement-breakpoint
CREATE INDEX "rooms_room_type_idx" ON "rooms" ("room_type");--> statement-breakpoint
ALTER TABLE "hotels_amenities" ADD CONSTRAINT "hotels_amenities_hotel_id_hotels_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "hotels_amenities" ADD CONSTRAINT "hotels_amenities_amenity_id_amenities_id_fkey" FOREIGN KEY ("amenity_id") REFERENCES "amenities"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "hotels_bookings" ADD CONSTRAINT "hotels_bookings_room_id_rooms_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "hotels_bookings" ADD CONSTRAINT "hotels_bookings_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "hotels_catalogs" ADD CONSTRAINT "hotels_catalogs_hotel_id_hotels_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_hotel_id_hotels_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_hotel_id_room_type_fkey" FOREIGN KEY ("hotel_id","room_type") REFERENCES "hotels_catalogs"("hotel_id","room_type") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "hotels_bookings"
ADD CONSTRAINT no_overlapping_bookings
EXCLUDE USING gist (
  room_id WITH =,
  time_range WITH &&
)
WHERE (booking_status NOT IN ('CANCELLED') AND check_in_status NOT IN ('CHECKED_OUT'));

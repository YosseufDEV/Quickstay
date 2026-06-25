CREATE EXTENSION IF NOT EXISTS btree_gist;--> statement-breakpoint
CREATE TYPE "booking_status" AS ENUM('PENDING', 'CONFIRMED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "check_in_status" AS ENUM('NOT_CHECKED_IN', 'CHECKED_IN', 'CHECKED_OUT');--> statement-breakpoint
CREATE TYPE "role" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
CREATE TYPE "room_status" AS ENUM('AVAILABLE', 'BOOKED', 'MAINTENANCE');--> statement-breakpoint
CREATE TYPE "room_type" AS ENUM('SINGLE', 'DOUBLE', 'SUITE');--> statement-breakpoint
CREATE TABLE "amenities" (
	"id" serial PRIMARY KEY,
	"slag" text NOT NULL UNIQUE
);
--> statement-breakpoint
CREATE TABLE "hotels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"rating" real NOT NULL,
	"name" text NOT NULL,
	"exact_address" text NOT NULL,
	"address" text NOT NULL,
	"image_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hotels_bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"room_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"time_range" tstzrange NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"booking_status" "booking_status" DEFAULT 'PENDING'::"booking_status" NOT NULL,
	"check_in_status" "check_in_status" DEFAULT 'NOT_CHECKED_IN'::"check_in_status" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hotels_amenities" (
	"hotel_id" uuid,
	"amenity_id" integer,
	CONSTRAINT "hotels_amenities_pkey" PRIMARY KEY("hotel_id","amenity_id")
);
--> statement-breakpoint
CREATE TABLE "rooms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"hotel_id" uuid NOT NULL,
	"room_type" "room_type" DEFAULT 'SINGLE'::"room_type" NOT NULL,
	"status" "room_status" DEFAULT 'AVAILABLE'::"room_status" NOT NULL,
	"image_url" text NOT NULL,
	"booked_by" uuid,
	"price_per_night" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"country" text NOT NULL,
	"password" text NOT NULL,
	"role" "role" DEFAULT 'USER'::"role" NOT NULL
);
--> statement-breakpoint
CREATE INDEX "hotel_created_at_idx" ON "hotels" ("created_at");--> statement-breakpoint
CREATE INDEX "hotels_bookings_room_id_idx" ON "hotels_bookings" ("room_id");--> statement-breakpoint
CREATE INDEX "hotels_bookings_user_id_idx" ON "hotels_bookings" ("user_id");--> statement-breakpoint
CREATE INDEX "hotels_bookings_time_range_idx" ON "hotels_bookings" USING gist ("time_range");--> statement-breakpoint
ALTER TABLE "hotels_bookings" ADD CONSTRAINT "hotels_bookings_room_id_rooms_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "hotels_bookings" ADD CONSTRAINT "hotels_bookings_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "hotels_amenities" ADD CONSTRAINT "hotels_amenities_hotel_id_hotels_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "hotels_amenities" ADD CONSTRAINT "hotels_amenities_amenity_id_amenities_id_fkey" FOREIGN KEY ("amenity_id") REFERENCES "amenities"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_hotel_id_hotels_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_booked_by_users_id_fkey" FOREIGN KEY ("booked_by") REFERENCES "users"("id") ON DELETE SET NULL;
ALTER TABLE hotels_bookings
ADD CONSTRAINT no_overlapping_bookings
EXCLUDE USING gist (
  room_id WITH =,
  time_range WITH &&
)
WHERE (booking_status NOT IN ('CANCELLED') AND check_in_status NOT IN ('CHECKED_OUT'));

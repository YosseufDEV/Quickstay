CREATE EXTENSION IF NOT EXISTS btree_gist;--> statement-breakpoint
CREATE TYPE "booking_status" AS ENUM('PENDING', 'CONFIRMED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "check_in_status" AS ENUM('NOT_CHECKED_IN', 'CHECKED_IN', 'CHECKED_OUT');--> statement-breakpoint
CREATE TYPE "role" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
CREATE TABLE "hotels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"rating" real NOT NULL,
	"name" text NOT NULL,
	"exact_address" text NOT NULL,
	"address" text NOT NULL,
	"price_per_night" integer NOT NULL,
	"image_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hotels_bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"hotel_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"from_to" tstzrange NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"booking_status" "booking_status" DEFAULT 'PENDING'::"booking_status" NOT NULL,
	"check_in_status" "check_in_status" DEFAULT 'NOT_CHECKED_IN'::"check_in_status" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hotels_tags" (
	"hotel_id" uuid,
	"tag_id" integer,
	CONSTRAINT "hotels_tags_pkey" PRIMARY KEY("hotel_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" serial PRIMARY KEY,
	"slag" text NOT NULL UNIQUE
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
CREATE INDEX "hotels_bookings_hotel_id_idx" ON "hotels_bookings" ("hotel_id");--> statement-breakpoint
CREATE INDEX "hotels_bookings_user_id_idx" ON "hotels_bookings" ("user_id");--> statement-breakpoint
CREATE INDEX "hotels_bookings_from_to_idx" ON "hotels_bookings" USING gist ("from_to");--> statement-breakpoint
ALTER TABLE "hotels_bookings" ADD CONSTRAINT "hotels_bookings_hotel_id_hotels_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "hotels_bookings" ADD CONSTRAINT "hotels_bookings_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "hotels_tags" ADD CONSTRAINT "hotels_tags_hotel_id_hotels_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "hotels_tags" ADD CONSTRAINT "hotels_tags_tag_id_tags_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "hotels_bookings"
ADD CONSTRAINT no_overlapping_bookings
EXCLUDE USING gist (
  hotel_id WITH =,
  from_to WITH &&
)
WHERE (booking_status NOT IN ('CANCELLED') AND check_in_status NOT IN ('CHECKED_OUT'));

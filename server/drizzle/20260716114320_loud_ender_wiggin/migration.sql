CREATE TABLE "hotels_fees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"hotel_id" uuid NOT NULL,
	"fee_type" text NOT NULL,
	"amount" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "hotels_fees_hotel_fee_type_unique" UNIQUE("hotel_id","fee_type")
);
--> statement-breakpoint
CREATE INDEX "hotels_fees_hotel_id_idx" ON "hotels_fees" ("hotel_id");--> statement-breakpoint
ALTER TABLE "hotels_fees" ADD CONSTRAINT "hotels_fees_hotel_id_hotels_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE;
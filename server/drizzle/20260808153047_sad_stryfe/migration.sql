ALTER TABLE "hotels" ADD COLUMN "country" text NOT NULL;--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "city" text NOT NULL;--> statement-breakpoint
ALTER TABLE "hotels" DROP COLUMN "exact_address";
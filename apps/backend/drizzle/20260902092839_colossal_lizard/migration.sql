DROP TABLE "identities";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "provider" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "provider_id" varchar NOT NULL;
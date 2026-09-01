CREATE TABLE "users" (
	"username" varchar(64) PRIMARY KEY NOT NULL,
	"display_name" varchar(64),
	"bio" varchar(500),
	"avatar_url" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL
);

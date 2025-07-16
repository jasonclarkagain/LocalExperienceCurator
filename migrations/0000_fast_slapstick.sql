CREATE TABLE "experiences" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"latitude" real NOT NULL,
	"longitude" real NOT NULL,
	"address" text NOT NULL,
	"image_url" text NOT NULL,
	"rating" real DEFAULT 0,
	"price_level" integer DEFAULT 1,
	"is_open" boolean DEFAULT true,
	"availability_status" text DEFAULT 'available' NOT NULL,
	"current_visitors" integer DEFAULT 0,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"trending_score" real DEFAULT 0,
	"ai_score" real DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "social_trends" (
	"id" serial PRIMARY KEY NOT NULL,
	"hashtag" text NOT NULL,
	"mentions" integer DEFAULT 0,
	"growth_rate" real DEFAULT 0,
	"related_experiences" jsonb DEFAULT '[]'::jsonb
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"categories" jsonb DEFAULT '[]'::jsonb,
	"price_range" jsonb DEFAULT '[1,4]'::jsonb,
	"max_distance" real DEFAULT 5,
	"preferred_times" jsonb DEFAULT '[]'::jsonb
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"location" text,
	"preferences" jsonb DEFAULT '[]'::jsonb,
	"saved_experiences" jsonb DEFAULT '[]'::jsonb,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

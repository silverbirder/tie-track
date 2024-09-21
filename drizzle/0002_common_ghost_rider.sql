CREATE TABLE IF NOT EXISTS "tie-track_google_search_cache" (
	"id" serial PRIMARY KEY NOT NULL,
	"query" varchar(255) NOT NULL,
	"raw_search_data" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tie-track_music" (
	"id" serial PRIMARY KEY NOT NULL,
	"artist_name" varchar(255) NOT NULL,
	"song_name" varchar(255) NOT NULL,
	"tie_up_info" text
);

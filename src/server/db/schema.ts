import { pgTableCreator, serial, text, varchar } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `tie-track_${name}`);

export const musicTable = createTable("music", {
  id: serial("id").primaryKey(),
  artistName: varchar("artist_name", { length: 255 }).notNull(),
  songName: varchar("song_name", { length: 255 }).notNull(),
  tieUpInfo: text("tie_up_info"),
});

export const googleSearchCacheTable = createTable("google_search_cache", {
  id: serial("id").primaryKey(),
  query: varchar("query", { length: 255 }).notNull(),
  rawSearchData: text("raw_search_data"),
});

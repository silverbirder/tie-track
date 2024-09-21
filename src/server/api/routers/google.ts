import { z } from "zod";
import { customsearch_v1 } from "googleapis";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { eq } from "drizzle-orm/expressions";
import { googleSearchCacheTable } from "@/server/db/schema";

export const googleRouter = createTRPCRouter({
  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      const cachedResult = await db
        .select()
        .from(googleSearchCacheTable)
        .where(eq(googleSearchCacheTable.query, input.query))
        .limit(1);
      if (cachedResult.length > 0) {
        console.log("Cache hit");
        return {
          source: "cache",
          data: JSON.parse(cachedResult[0]?.rawSearchData ?? "[]") as {
            title: string;
            snippet: string;
          }[],
        };
      }
      console.log("Cache miss, performing API search");
      const searchResults = await fetchSearchResults(input.query);
      await db.insert(googleSearchCacheTable).values({
        query: input.query,
        rawSearchData: JSON.stringify(searchResults),
      });
      return {
        source: "api",
        data: searchResults,
      };
    }),
});

const fetchSearchResults = async (query: string) => {
  const customsearch = new customsearch_v1.Customsearch({
    auth: process.env.CUSTOM_SEARCH_API_KEY,
  });

  const result = await customsearch.cse.list({
    q: query,
    cx: process.env.SEARCH_ENGINE_ID,
  });

  return result.data.items?.map((item) => ({
    title: item.title,
    snippet: item.snippet,
  }));
};

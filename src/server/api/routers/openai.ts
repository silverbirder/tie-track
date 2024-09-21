import { z } from "zod";
import { customsearch_v1 } from "googleapis";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";

export const openaiRouter = createTRPCRouter({
  search: publicProcedure
    .input(z.object({ artistName: z.string(), trackName: z.string() }))
    .query(async ({ input }) => {
      const message = `${input.artistName} ${input.trackName}`;
      console.log({ message });
      const searchResults = await fetchSearchResults(
        `${message} タイアップ 何`,
      );
      console.log({ searchResults });
      const systemMessage = `あなたは"${message} タイアップ"の検索結果を持っています: "${JSON.stringify(searchResults)}"。`;
      const userMessage = `${message}のタイアップを教えてください。`;
      console.log({ systemMessage, userMessage });
      const result = await generateObject({
        model: openai("gpt-4o"),
        schema: z.object({
          title: z.string(),
        }),
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: userMessage },
        ],
      });
      console.log({ result });
      return result.object;
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

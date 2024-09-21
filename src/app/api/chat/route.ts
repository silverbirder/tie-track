import { type CoreMessage, streamText } from "ai";
import { customsearch_v1 } from "googleapis";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = (await req.json()) as {
    messages: CoreMessage[];
  };
  const message = messages[0]?.content.toString();
  const searchResults = await fetchSearchResults(`${message} タイアップ`);
  const systemMessage = `あなたは"${message} タイアップ"の検索結果を持っています: "${JSON.stringify(searchResults)}"。`;
  const userMessage = `${message}のタイアップ情報を教えてください。`;
  const result = await streamText({
    model: openai("gpt-4o"),
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
  });
  return result.toDataStreamResponse();
}

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

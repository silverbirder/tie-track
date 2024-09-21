import { type CoreMessage, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { api } from "@/trpc/server";

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = (await req.json()) as {
    messages: CoreMessage[];
  };
  const message = JSON.parse(messages[0]?.content.toString() ?? "{}") as {
    artistName: string;
    songName: string;
  };
  const searchResults = await api.google.search({
    query: `${message.artistName} ${message.songName} タイアップ`,
  });
  const systemMessage = `あなたは"${message.artistName} ${message.songName} タイアップ"の検索結果を持っています: "${JSON.stringify(searchResults)}"。`;
  const userMessage = `アーティスト名:"${message.artistName}",曲名:"${message.songName}"のタイアップ情報を教えてください。`;
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

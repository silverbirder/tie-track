import { type CoreMessage, streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = (await req.json()) as {
    messages: CoreMessage[];
  };

  const result = await streamText({
    model: openai("gpt-4o"),
    system:
      "渡されたアーティスト名と曲名から映画やCM、アニメなどのタイアップ情報を教えて",
    messages,
  });

  return result.toDataStreamResponse();
}

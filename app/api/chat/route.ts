import { convertToModelMessages, streamText, type UIMessage } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { chatTools } from '@/lib/chat-tools';

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are an assistant inside an email client. Help the user manage their mailbox.

Use the provided tools to act in the app. Only use email IDs that appear in the app context, exactly as written. Never send email yourself: composing and replying only prefill a draft the user reviews.

Reply in the language the user writes in. Keep replies short and plain.`;

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: 'Missing or empty messages array' },
        { status: 400 }
      );
    }

    const system = context
      ? `${SYSTEM_PROMPT}\n\nApp context:\n${JSON.stringify(context, null, 2)}`
      : SYSTEM_PROMPT;

    const result = streamText({
      model: groq('openai/gpt-oss-120b'),
      system,
      messages: await convertToModelMessages(messages as UIMessage[]),
      tools: chatTools,
      temperature: 0.7,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}

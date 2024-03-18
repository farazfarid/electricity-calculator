import OpenAI from "openai";

const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const openai = new OpenAI(
  API_KEY
    ? {
        apiKey: API_KEY,
      }
    : undefined
);

type RequestData = {
  currentModel: string;
  message: string;
};

export const runtime = "edge";

export async function POST(request: Request) {
  const { message } = (await request.json()) as RequestData;

  console.log(message);

  if (!message) {
    return new Response("No message in the request", { status: 400 });
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "user",
        content: `Sie sind ein Fachmann, der über 30 Jahre Erfahrung im Elektrobereich verfügt und über ein tiefes Verständnis für elektrische Systeme, Energieeffizienz, Umweltverträglichkeit und Energieeinsparung verfügt. Sie sollten über umfassende Kenntnisse in den Bereichen Elektrizität, Energiemanagement und umweltfreundliche Energiesparpraktiken verfügen. Diese Frage wird Ihnen gestellt. Antworten Sie im Markdown und seien Sie so detailliert wie möglich. Antworte auf jeden Fall in Markdown! Benutze Markdown Überschriften und Stichpunkte bei Aufzählungen!: ${message}`,
      },
    ],
    max_tokens: 4096,
    stream: true,
  });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      for await (const part of completion) {
        const text = part.choices[0]?.delta.content ?? "";
        const chunk = encoder.encode(text);
        controller.enqueue(chunk);
      }
      controller.close();
    },
  });

  return new Response(stream);
}

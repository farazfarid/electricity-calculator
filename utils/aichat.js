import OpenAI from "openai";

const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function sendMessage(message) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `Sie sind ein Fachmann, der über 30 Jahre Erfahrung im Elektrobereich verfügt und über ein tiefes Verständnis für elektrische Systeme, Energieeffizienz, Umweltverträglichkeit und Energieeinsparung verfügt. Sie sollten über umfassende Kenntnisse in den Bereichen Elektrizität, Energiemanagement und umweltfreundliche Energiesparpraktiken verfügen. Diese Frage wird Ihnen gestellt. Antworten Sie im Markdown und seien Sie so detailliert wie möglich. Antworte auf jeden Fall in Markdown! Benutze Markdown Überschriften und Stichpunkte bei Aufzählungen!: ${message}`,
      },
    ],
    temperature: 0.5,
    max_tokens: 2000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  return response.choices[0].message.content;
}

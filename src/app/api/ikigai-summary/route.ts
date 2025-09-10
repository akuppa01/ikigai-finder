import { NextResponse } from "next/server"
import OpenAI from "openai"

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  const { responses } = await req.json()

  const prompt = `
Based on these Ikigai responses, generate a short motivational summary:
${JSON.stringify(responses, null, 2)}
`

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  })

  const summary = completion.choices[0].message.content
  return NextResponse.json({ summary })
}

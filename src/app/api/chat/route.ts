import { google } from "@ai-sdk/google"
import { streamText } from "ai"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const result = await streamText({
      model: google("gemini-1.5-flash"),
      system: "You are a highly empathetic, supportive, and professional mental wellness coach for the Antipal app. Keep responses concise, comforting, and grounded.",
      messages
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("Error in AI Chat API route:", error)
    return new Response(JSON.stringify({ error: "Failed to generate chat response" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}

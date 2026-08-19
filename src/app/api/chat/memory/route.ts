import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { generateEmbedding } from "@/utils/embeddings"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || (session.user as any).tier !== "PREMIUM") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }

    const userId = (session.user as any).id

    // Fetch the 3 most recent emotional memories for the user
    // We could do vector similarity here if a query was provided, but for now we just get recent context.
    const recentMemories = await prisma.$queryRaw<Array<{ summary: string, createdat: Date }>>`
      SELECT summary, "createdAt" as createdat
      FROM emotional_memories
      WHERE "userId" = ${userId}
      ORDER BY "createdAt" DESC
      LIMIT 3
    `

    return new Response(JSON.stringify({ 
      memories: recentMemories.map(m => m.summary)
    }), { status: 200, headers: { "Content-Type": "application/json" } })

  } catch (error: any) {
    console.error("GET Memory Error:", error)
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || (session.user as any).tier !== "PREMIUM") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }

    const userId = (session.user as any).id
    const { transcript } = await req.json()

    if (!transcript) {
      return new Response(JSON.stringify({ error: "Transcript is required" }), { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) throw new Error("Missing GEMINI_API_KEY")

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    // Generate a summary
    const prompt = `Analyze the following conversation transcript from an AI mental wellness companion session. 
Extract the core emotional highlights, underlying triggers, and key takeaways about the user's state of mind. 
Keep it very concise (1-3 sentences) as this will be stored as an emotional memory for future context.
Transcript:
${transcript}`

    const result = await model.generateContent(prompt)
    const summary = result.response.text().trim()

    // Embed the summary
    const embedding = await generateEmbedding(summary)
    const embeddingStr = `[${embedding.join(',')}]`

    // Create the record in Postgres using vector cast
    await prisma.$executeRaw`
      INSERT INTO emotional_memories ("id", "userId", "summary", "embedding", "createdAt")
      VALUES (gen_random_uuid(), ${userId}, ${summary}, ${embeddingStr}::vector, NOW())
    `

    return new Response(JSON.stringify({ success: true, summary }), { status: 201 })

  } catch (error: any) {
    console.error("POST Memory Error:", error)
    return new Response(JSON.stringify({ error: "Internal Server Error", details: error.message }), { status: 500 })
  }
}

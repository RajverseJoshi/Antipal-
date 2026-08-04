import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }

    const userId = (session.user as any).id

    const entries = await prisma.journalEntry.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    })

    return new Response(JSON.stringify(entries), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    })
  } catch (error) {
    console.error("Failed to fetch journal entries:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch journal entries" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }

    const userId = (session.user as any).id
    const { title, content, mood } = await req.json()

    if (!title || !content || !mood) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 })
    }

    // Format content with title to match DB structure
    const dbContent = `${title}\n\n${content}`

    // Create journal entry in database
    const journalEntry = await prisma.journalEntry.create({
      data: {
        userId,
        content: dbContent,
        moodTag: mood
      }
    })

    // Also write a MoodEntry record for analytics dashboard integration
    try {
      await prisma.moodEntry.create({
        data: {
          userId,
          mood,
          intensity: 5, // Medium default intensity
          notes: `Log from journal: ${title}`
        }
      })
    } catch (moodErr) {
      // Don't fail the request if mood log sync fails, just report warning
      console.warn("Could not log corresponding mood entry:", moodErr)
    }

    return new Response(JSON.stringify(journalEntry), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    })
  } catch (error) {
    console.error("Failed to save journal entry:", error)
    return new Response(JSON.stringify({ error: "Failed to save journal entry" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}

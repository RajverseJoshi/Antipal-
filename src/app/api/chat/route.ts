import { GoogleGenerativeAI, SchemaType, Schema } from "@google/generative-ai"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

const apiKey = process.env.GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(apiKey);

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user || !(session.user as any).id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }
    const userId = (session.user as any).id

    // Fetch user's current limits
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { subscription_tier: true, daily_message_count: true }
    })

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 })
    }

    // Enforce limits (temporarily bypassed for testing)
    if (user.subscription_tier === 'free' && user.daily_message_count >= 1000) {
      return new Response(JSON.stringify({ error: 'LIMIT_EXCEEDED', message: 'Daily limit reached.' }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      })
    }

    // Increment the message count
    await prisma.user.update({
      where: { id: userId },
      data: { daily_message_count: { increment: 1 } }
    })

    const { messages } = await req.json()

    // Sliding Window: keep only the last 8 messages
    let recentMessages = messages.slice(-8)
    
    // Crucial Fix: Gemini API strictly requires history to start with a 'user' message. 
    // If the sliding window cut the array such that the first message is 'assistant', shift it.
    if (recentMessages.length > 0 && recentMessages[0].role === 'assistant') {
      recentMessages = recentMessages.slice(1)
    }

    // Extract the latest message text to use for memory retrieval
    const lastUserMessage = recentMessages[recentMessages.length - 1]
    const lastMessageText = typeof lastUserMessage.content === 'string' 
      ? lastUserMessage.content 
      : Array.isArray(lastUserMessage.parts) ? lastUserMessage.parts.map((p: any) => p.text).join('') : ""

    // Fetch semantic memories from the database
    let memoryContext = ""
    try {
      const { generateEmbedding } = await import("@/utils/embeddings")
      const embedding = await generateEmbedding(lastMessageText)
      const embeddingStr = `[${embedding.join(',')}]`
      
      const relevantMemories = await prisma.$queryRaw<Array<{content: string}>>`
        SELECT content
        FROM user_memories
        WHERE user_id = ${userId}
        ORDER BY embedding <-> ${embeddingStr}::vector
        LIMIT 3
      `
      
      if (relevantMemories && relevantMemories.length > 0) {
        memoryContext = "\n\nRelevant Context/Memories about the user:\n" + 
          relevantMemories.map(m => `- ${m.content}`).join("\n")
      }
    } catch (e) {
      console.error("Vector Search Error:", e)
    }

    // Convert messages for native Google SDK
    const formattedMessages = recentMessages.map((m: any) => {
      let text = m.content;
      if (m.parts && Array.isArray(m.parts)) {
        text = m.parts.map((p: any) => p.text).join('');
      }
      return {
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text }]
      };
    });

    const responseSchema: Schema = {
      type: SchemaType.OBJECT,
      properties: {
        reply: {
          type: SchemaType.STRING,
        },
        stress_score: {
          type: SchemaType.INTEGER,
          description: "A score from 0 to 100 based on user anxiety",
        },
      },
      required: ["reply", "stress_score"],
    };

    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      systemInstruction: "You are a highly empathetic, supportive, and professional mental wellness coach for the Antipal app. Keep responses concise, comforting, and grounded." + memoryContext,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const history = formattedMessages.slice(0, -1);
    const lastMessage = formattedMessages[formattedMessages.length - 1].parts[0].text;

    const chat = model.startChat({ history });
    
    let parsedData;
    try {
      const result = await chat.sendMessage(lastMessage);
      
      // Safely parse JSON in case Gemini returns markdown code blocks
      let responseText = result.response.text();
      responseText = responseText.replace(/^```json/m, '').replace(/```$/m, '').trim();
      if (responseText.startsWith('```')) {
        responseText = responseText.replace(/^```/m, '').trim();
      }
      
      parsedData = JSON.parse(responseText);
    } catch (genError) {
      console.error("Gemini Generation Error:", genError);
      parsedData = {
        reply: "I'm having a little trouble connecting right now, but I'm here for you. Please try again in a moment.",
        stress_score: 50
      };
    }

    return new Response(JSON.stringify(parsedData), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    })
  } catch (error) {
    console.error("GEMINI API CRASH DETAILS:", error)
    return new Response(JSON.stringify({ error: "An error occurred", details: error instanceof Error ? error.message : String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}


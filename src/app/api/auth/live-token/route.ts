import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { GoogleAuth } from "google-auth-library"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    // Security check: ensure user is authenticated and on PREMIUM tier
    if (!session || !session.user || (session.user as any).tier !== "PREMIUM") {
      return new Response(JSON.stringify({ error: "Unauthorized or insufficient tier" }), { status: 403 })
    }

    // Check if GOOGLE_APPLICATION_CREDENTIALS or similar exists in env
    // In a real environment, this utilizes the Service Account to generate an OAuth token for Vertex AI
    
    // For Vertex AI Multimodal Live API
    const auth = new GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/cloud-platform"]
    })

    const client = await auth.getClient()
    const accessToken = await client.getAccessToken()

    if (!accessToken.token) {
      throw new Error("Failed to generate access token")
    }

    return new Response(JSON.stringify({ 
      token: accessToken.token,
      // You also might want to return the project ID if needed by the frontend
      projectId: await auth.getProjectId() 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    })

  } catch (error: any) {
    console.error("Live token generation error:", error)
    
    // As a fallback for development if Vertex AI service account isn't configured,
    // we can return the AI Studio API key (GEMINI_API_KEY).
    // Note: In production, passing an API key to the client is less secure than an ephemeral OAuth token.
    if (process.env.GEMINI_API_KEY) {
      console.warn("Falling back to GEMINI_API_KEY because GoogleAuth failed.")
      return new Response(JSON.stringify({ 
        apiKey: process.env.GEMINI_API_KEY,
        isFallback: true 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      })
    }

    return new Response(JSON.stringify({ error: "Internal Server Error", details: error.message }), { status: 500 })
  }
}

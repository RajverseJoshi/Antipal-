import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !(session.user as any).id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }

    const { tier } = await req.json()
    
    if (!tier || !["FREE", "PREMIUM"].includes(tier)) {
      return new Response(JSON.stringify({ error: "Invalid subscription tier" }), { status: 400 })
    }

    const userId = (session.user as any).id

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { tier }
    })

    return new Response(JSON.stringify({ success: true, tier: updatedUser.tier }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    })
  } catch (error) {
    console.error("Failed to update subscription tier:", error)
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 })
  }
}

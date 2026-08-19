import React from "react"
import { ChatBox } from "@/components/ChatBox"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PremiumLiveChat } from "@/components/PremiumLiveChat"
import { TierToggleBadge } from "@/components/TierToggleBadge"

export const metadata = {
  title: "Chat - Antipal",
  description: "Your empathetic AI companion for mental wellbeing.",
}

export default async function ChatPage() {
  const session = await getServerSession(authOptions)
  const tier = (session?.user as any)?.tier || "FREE"

  if (tier === "PREMIUM") {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center animate-fade-slide-in relative">
        <TierToggleBadge initialTier={tier} />
        <PremiumLiveChat />
      </div>
    )
  }

  // Fallback FREE tier view
  return (
    <div className="w-full h-full flex flex-col items-center justify-center animate-fade-slide-in relative">
      <TierToggleBadge initialTier={tier} />
      <ChatBox />
    </div>
  )
}

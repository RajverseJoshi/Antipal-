"use client"

import React, { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Sparkles, ArrowRightLeft } from "lucide-react"

export function TierToggleBadge({ initialTier }: { initialTier: string }) {
  const { update } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const isPremium = initialTier === "PREMIUM"

  const toggleTier = async () => {
    setLoading(true)
    try {
      const newTier = isPremium ? "FREE" : "PREMIUM"
      const res = await fetch("/api/user/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: newTier }),
      })
      
      if (res.ok) {
        await update({ tier: newTier }) // Update client session
        router.refresh() // Tell server component to re-render
      }
    } catch (error) {
      console.error("Failed to toggle tier", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="absolute top-4 right-4 z-50 flex items-center gap-3 bg-zinc-900/80 backdrop-blur border border-white/10 rounded-full pl-4 pr-1.5 py-1.5 shadow-xl">
      <div className="flex items-center gap-2">
        {isPremium ? (
          <Sparkles className="w-4 h-4 text-indigo-400" />
        ) : null}
        <span className={`text-xs font-bold tracking-wider uppercase ${isPremium ? "text-indigo-300" : "text-zinc-400"}`}>
          {isPremium ? "Premium Companion" : "Free Plan"}
        </span>
      </div>
      <button
        onClick={toggleTier}
        disabled={loading}
        className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-white/5 flex items-center justify-center transition-all disabled:opacity-50"
        title="Toggle Tier (Dev Only)"
      >
        <ArrowRightLeft className={`w-4 h-4 text-zinc-300 ${loading ? "animate-spin" : ""}`} />
      </button>
    </div>
  )
}

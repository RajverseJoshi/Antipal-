"use client"

import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Sparkles, CheckCircle2, X, ShieldCheck, Mic, Video, Brain } from "lucide-react"

export function SubscriptionModal() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Only show if the user is authenticated and on the FREE tier
    if (session?.user && (session.user as any).tier === "FREE") {
      const hasSeen = sessionStorage.getItem("hasSeenSubscriptionModal")
      if (!hasSeen) {
        // slight delay so it doesn't immediately jar the user
        const timer = setTimeout(() => {
          setIsOpen(true)
          sessionStorage.setItem("hasSeenSubscriptionModal", "true")
        }, 1500)
        return () => clearTimeout(timer)
      }
    }
  }, [session])

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/user/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: "PREMIUM" }),
      })
      
      if (res.ok) {
        await update({ tier: "PREMIUM" }) // Refresh NextAuth session to pull the new tier
        setIsOpen(false)
        router.refresh() // Tell server component to re-render
      } else {
        console.error("Failed to upgrade subscription")
      }
    } catch (error) {
      console.error("Upgrade error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-10 p-2 bg-background/50 hover:bg-background/80 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Free Tier Column */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center bg-muted/30">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-foreground">Free Tier</h3>
            <p className="text-sm text-muted-foreground mt-1">Your current plan</p>
          </div>
          
          <div className="text-4xl font-extrabold mb-8 text-foreground">
            $0<span className="text-lg text-muted-foreground font-normal">/month</span>
          </div>

          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3 text-sm text-muted-foreground">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Standard text chat with AI
            </li>
            <li className="flex items-center gap-3 text-sm text-muted-foreground">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Basic browser speech-to-text
            </li>
            <li className="flex items-center gap-3 text-sm text-muted-foreground">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Mood tracking & Journaling
            </li>
            <li className="flex items-center gap-3 text-sm text-muted-foreground opacity-50">
              <X className="w-5 h-5" />
              Live Speech-to-Speech
            </li>
            <li className="flex items-center gap-3 text-sm text-muted-foreground opacity-50">
              <X className="w-5 h-5" />
              Live Video Companion
            </li>
          </ul>

          <button 
            onClick={() => setIsOpen(false)}
            className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-muted text-foreground hover:bg-muted/80 transition-colors"
          >
            Stay on Free
          </button>
        </div>

        {/* Premium Tier Column */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent border-l border-border/50 relative">
          
          <div className="absolute top-0 right-0 p-4">
            <span className="px-3 py-1 text-[10px] uppercase tracking-wider font-bold bg-indigo-500 text-white rounded-full flex items-center gap-1 shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-3 h-3" /> Recommended
            </span>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Premium Tier
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Unlock the full emotional support experience</p>
          </div>
          
          <div className="text-4xl font-extrabold mb-8 text-foreground">
            $19<span className="text-lg text-muted-foreground font-normal">/month</span>
          </div>

          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3 text-sm text-foreground font-medium">
              <Mic className="w-5 h-5 text-indigo-400" />
              Ultra-low latency Live Voice Chat
            </li>
            <li className="flex items-center gap-3 text-sm text-foreground font-medium">
              <Video className="w-5 h-5 text-purple-400" />
              Live Video Companion with Expressions
            </li>
            <li className="flex items-center gap-3 text-sm text-foreground font-medium">
              <Brain className="w-5 h-5 text-rose-400" />
              Advanced Emotional Memory tracking
            </li>
            <li className="flex items-center gap-3 text-sm text-foreground font-medium">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Priority Crisis Routing
            </li>
          </ul>

          <button 
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-pulse">Upgrading...</span>
            ) : (
              <>
                Upgrade to Premium <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
        
      </div>
    </div>
  )
}

function ArrowRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

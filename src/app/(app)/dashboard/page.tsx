"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Smile,
  Frown,
  Meh,
  SmilePlus,
  Angry,
  Sparkles,
  ArrowRight,
  BookOpen,
  Calendar,
  Sprout,
  Trophy,
  Activity,
  Flame,
  AlertTriangle,
  Heart,
  CheckCircle2
} from "lucide-react"

export default function DashboardPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [goalCompleted, setGoalCompleted] = useState(false)

  // Emulating localized date details
  const today = new Date()
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  })

  // Emojis for quick mood selection
  const moodOptions = [
    { emoji: "😊", label: "Happy", color: "text-amber-500 hover:bg-amber-500/10" },
    { emoji: "😴", label: "Tired", color: "text-blue-400 hover:bg-blue-400/10" },
    { emoji: "😐", label: "Neutral", color: "text-gray-400 hover:bg-gray-400/10" },
    { emoji: "😰", label: "Anxious", color: "text-purple-400 hover:bg-purple-400/10" },
    { emoji: "😠", label: "Angry", color: "text-rose-500 hover:bg-rose-500/10" }
  ]

  // Hope Score circular progress details
  const hopeScore = 78
  const strokeDashoffset = 251.2 - (251.2 * hopeScore) / 100

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header section (Section 22) */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Hello, Aarav
          </h1>
          <p className="text-muted-foreground flex items-center gap-1.5 mt-1">
            <Calendar className="h-4 w-4" />
            {formattedDate}
          </p>
        </div>
        <div className="flex items-center gap-3 bg-indigo-500/5 border border-indigo-500/10 px-4 py-3 rounded-[20px] max-w-md">
          <Sparkles className="h-5 w-5 text-indigo-400 shrink-0 animate-pulse" />
          <p className="text-sm font-medium italic text-indigo-200/90 leading-snug">
            "Your strength is not measured by the absence of storms, but by how you learn to dance in the rain."
          </p>
        </div>
      </div>

      {/* Grid Layout containing the 10 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Mood Check-in */}
        <div className="bg-card text-card-foreground border border-border/80 rounded-[20px] p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group">
          <div>
            <h2 className="text-lg font-bold tracking-tight mb-1 flex items-center gap-2">
              <Smile className="h-5 w-5 text-indigo-400" />
              How are you feeling today?
            </h2>
            <p className="text-xs text-muted-foreground mb-6">Select an emoji to log your daily emotional vibe.</p>
          </div>
          <div className="flex items-center justify-around gap-2 mb-2">
            {moodOptions.map((opt) => (
              <button
                key={opt.label}
                onClick={() => setSelectedMood(opt.label)}
                className={`text-3xl p-3 rounded-[14px] transition-all hover:scale-115 active:scale-95 cursor-pointer ${
                  selectedMood === opt.label
                    ? "bg-primary/20 scale-110 border border-primary/40 ring-1 ring-primary/20"
                    : "border border-transparent bg-transparent"
                }`}
                title={opt.label}
              >
                {opt.emoji}
              </button>
            ))}
          </div>
          {selectedMood && (
            <p className="text-xs text-center text-primary font-medium animate-fade-slide-in my-1.5">
              Logged mood: <span className="underline">{selectedMood}</span>. Great choice!
            </p>
          )}
          <Link
            href="/mood"
            className="text-[11px] font-semibold text-primary hover:underline mt-2 text-center block"
          >
            View Trends & History →
          </Link>
        </div>

        {/* Card 2: Hope Score Indicator */}
        <div className="bg-card text-card-foreground border border-border/80 rounded-[20px] p-6 shadow-sm flex flex-col items-center justify-center hover:shadow-md transition-all">
          <h2 className="text-lg font-bold tracking-tight mb-4 self-start">Hope Score</h2>
          <div className="relative flex items-center justify-center w-36 h-36">
            {/* SVG Circular Progress Bar */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="40"
                className="stroke-muted"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="40"
                className="stroke-primary"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="251.2"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-foreground">{hopeScore}</span>
              <span className="text-[10px] font-semibold tracking-wider text-primary uppercase">Healthy</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-4">
            Your score went up by <span className="text-emerald-500 font-semibold">+4%</span> this week. Keep active!
          </p>
        </div>

        {/* Card 3: Today's Goal */}
        <div className="bg-card text-card-foreground border border-border/80 rounded-[20px] p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div>
            <h2 className="text-lg font-bold tracking-tight mb-1 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-indigo-400" />
              Today's Wellness Goal
            </h2>
            <p className="text-xs text-muted-foreground mb-4">AI generated goal tailored to reduce current stress levels.</p>
            <div className="bg-primary/5 border border-primary/10 rounded-[14px] p-4 mb-4">
              <p className="text-sm font-semibold text-foreground">Take a 5-minute deep breathing break</p>
              <p className="text-xs text-muted-foreground mt-1">Slow breathing balances the autonomic nervous system.</p>
            </div>
          </div>
          <button
            onClick={() => setGoalCompleted(!goalCompleted)}
            className={`w-full py-2.5 rounded-[14px] font-semibold text-sm transition-all cursor-pointer ${
              goalCompleted
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20"
                : "bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-indigo-500/10"
            }`}
          >
            {goalCompleted ? "Goal Completed! 🎉" : "Mark as Completed"}
          </button>
        </div>

        {/* Card 4: AI Coach Shortcut */}
        <div className="bg-card text-card-foreground border border-border/80 rounded-[20px] p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group">
          <div>
            <h2 className="text-lg font-bold tracking-tight mb-1 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              Chat with AI Coach
            </h2>
            <p className="text-xs text-muted-foreground mb-4">Speak with your companion about anything on your mind.</p>
            <div className="bg-muted rounded-[14px] p-3 text-xs text-muted-foreground italic border border-border/50">
              "Hi Aarav! I'm here for you today. How was your exam preparation going? Shall we organize a study breakdown?"
            </div>
          </div>
          <Link
            href="/chat"
            className="flex items-center justify-center gap-2 w-full py-2.5 mt-4 bg-secondary text-secondary-foreground hover:bg-secondary/95 rounded-[14px] font-semibold text-sm transition-all shadow-md shadow-violet-500/10 cursor-pointer"
          >
            Start Conversation
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Card 5: Journal Shortcut */}
        <div className="bg-card text-card-foreground border border-border/80 rounded-[20px] p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group">
          <div>
            <h2 className="text-lg font-bold tracking-tight mb-1 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-400" />
              Recent Journal
            </h2>
            <p className="text-xs text-muted-foreground mb-4">Your last reflections and automatic insights.</p>
            <div className="border border-border/40 rounded-[14px] p-3 flex flex-col gap-2 bg-muted/40">
              <span className="text-[10px] uppercase font-bold text-indigo-400">Entry from Yesterday</span>
              <p className="text-xs text-foreground line-clamp-2">
                "Felt slightly overwhelmed by the placement preparation syllabus, but I split the tasks into three parts and it seemed easier..."
              </p>
              <div className="border-t border-border/40 pt-2 mt-1">
                <span className="text-[10px] font-semibold text-emerald-500">AI Summary:</span>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Proactive task management helped neutralize anxiety.
                </p>
              </div>
            </div>
          </div>
          <Link
            href="/journal"
            className="flex items-center justify-center gap-2 w-full py-2.5 mt-4 border border-border bg-card hover:bg-muted text-foreground rounded-[14px] font-semibold text-sm transition-all cursor-pointer"
          >
            Open Journal Editor
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Card 6: Memory Vault featured item */}
        <div className="bg-card text-card-foreground border border-border/80 rounded-[20px] p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group">
          <div>
            <h2 className="text-lg font-bold tracking-tight mb-1 flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-400" />
              Remember This?
            </h2>
            <p className="text-xs text-muted-foreground mb-4">A happy memory preserved in your Vault.</p>
            
            {/* Visual presentation block of a Memory */}
            <div className="relative rounded-[14px] overflow-hidden border border-border/40 h-28 bg-slate-950 flex flex-col justify-end p-3">
              {/* Soft background glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent z-10" />
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20" />
              <div className="relative z-20">
                <h3 className="text-xs font-bold text-white">Coding Marathon Success</h3>
                <p className="text-[10px] text-zinc-300 line-clamp-1 mt-0.5">Completed our first hackathon and won best design award!</p>
                <p className="text-[9px] text-indigo-300 font-medium italic mt-1">"Makes me feel capable of overcoming hard tech tasks."</p>
              </div>
            </div>
          </div>
          
          <Link
            href="/memory-vault"
            className="flex items-center justify-center gap-2 w-full py-2.5 mt-4 border border-border bg-card hover:bg-muted text-foreground rounded-[14px] font-semibold text-sm transition-all cursor-pointer"
          >
            Browse Memory Vault
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Card 7: Recovery Tree Progress */}
        <div className="bg-card text-card-foreground border border-border/80 rounded-[20px] p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group">
          <div>
            <h2 className="text-lg font-bold tracking-tight mb-1 flex items-center gap-2">
              <Sprout className="h-5 w-5 text-emerald-400" />
              Recovery Tree
            </h2>
            <p className="text-xs text-muted-foreground mb-4">A forgiving model tracking your daily habits and progress.</p>
            
            <div className="flex items-center gap-4 bg-muted/30 border border-border/40 rounded-[14px] p-3">
              <div className="h-12 w-12 rounded-[10px] bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Sprout className="h-7 w-7 animate-bounce" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>Level 3: Sprout</span>
                  <span className="text-emerald-400">12 / 20 Leaves</span>
                </div>
                {/* Custom Progress Bar */}
                <div className="w-full bg-border rounded-full h-2 mt-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "60%" }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <Link
            href="/recovery-tree"
            className="flex items-center justify-center gap-2 w-full py-2.5 mt-4 border border-border bg-card hover:bg-muted text-foreground rounded-[14px] font-semibold text-sm transition-all cursor-pointer"
          >
            Check Tree Details
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Card 8: Achievements */}
        <div className="bg-card text-card-foreground border border-border/80 rounded-[20px] p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div>
            <h2 className="text-lg font-bold tracking-tight mb-1 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-400" />
              Streaks & Achievements
            </h2>
            <p className="text-xs text-muted-foreground mb-4">Your milestones and consistency awards.</p>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5 bg-muted/40 rounded-[14px] p-2.5 border border-border/40">
                <Flame className="h-5 w-5 text-amber-500 animate-pulse" />
                <div>
                  <p className="text-[10px] text-muted-foreground leading-none">Current Streak</p>
                  <p className="text-sm font-bold text-foreground mt-0.5">7 Days</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 bg-muted/40 rounded-[14px] p-2.5 border border-border/40">
                <Trophy className="h-5 w-5 text-indigo-400" />
                <div>
                  <p className="text-[10px] text-muted-foreground leading-none">Badges Unlocked</p>
                  <p className="text-sm font-bold text-foreground mt-0.5">4 Badges</p>
                </div>
              </div>
            </div>
          </div>
          
          <Link
            href="/achievements"
            className="flex items-center justify-center gap-2 w-full py-2.5 mt-4 border border-border bg-card hover:bg-muted text-foreground rounded-[14px] font-semibold text-sm transition-all cursor-pointer"
          >
            View Achievements
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Card 9: Analytics Mini-Graphs */}
        <div className="bg-card text-card-foreground border border-border/80 rounded-[20px] p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group">
          <div>
            <h2 className="text-lg font-bold tracking-tight mb-1 flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-400" />
              Weekly Summary
            </h2>
            <p className="text-xs text-muted-foreground mb-4">Mood and stress assessment history summary.</p>
            
            {/* Visual SVG Mini Line Chart */}
            <div className="h-20 w-full bg-muted/30 border border-border/30 rounded-[14px] p-2 flex items-end justify-between relative overflow-hidden">
              <div className="absolute top-2 left-2 text-[8px] font-bold text-muted-foreground/80 uppercase">
                Hope Curve (Last 7 Days)
              </div>
              <svg className="absolute bottom-0 left-0 w-full h-12 stroke-primary fill-none" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0,15 Q15,8 30,12 T60,4 T90,8 T100,5" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <div className="w-full flex justify-between px-1 text-[8px] font-semibold text-muted-foreground/60 z-10 pb-0.5">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
                <span>Sun</span>
              </div>
            </div>
          </div>
          
          <Link
            href="/analytics"
            className="flex items-center justify-center gap-2 w-full py-2.5 mt-4 border border-border bg-card hover:bg-muted text-foreground rounded-[14px] font-semibold text-sm transition-all cursor-pointer"
          >
            View Full Reports
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

      </div>

      {/* Card 10 & Help Footer: Crisis Alert */}
      <div className="mt-4 p-5 rounded-[20px] border border-rose-500/20 bg-rose-500/5 flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-rose-500" />
          <div>
            <h3 className="font-bold text-rose-500 text-sm">Feeling completely overwhelmed or in crisis?</h3>
            <p className="text-xs text-rose-200/70">Our safety companion system is available with localized resources 24/7.</p>
          </div>
        </div>
        <Link
          href="/crisis"
          className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-[14px] text-xs font-bold transition-all shadow-md shadow-rose-500/10 cursor-pointer"
        >
          Access Immediate Help
        </Link>
      </div>
    </div>
  )
}

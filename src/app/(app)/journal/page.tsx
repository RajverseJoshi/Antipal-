"use client"

import React, { useState, useEffect } from "react"
import { BookOpen, Calendar, HelpCircle, Save, CheckCircle, Flame, ShieldCheck } from "lucide-react"

interface JournalEntry {
  id: string
  title: string
  content: string
  mood: string
  emoji: string
  date: Date
}

const moodOptions = [
  { label: "Anxious", emoji: "😢", color: "border-rose-500/40 text-rose-400 bg-rose-500/5 hover:bg-rose-500/10" },
  { label: "Sad", emoji: "😔", color: "border-blue-500/40 text-blue-400 bg-blue-500/5 hover:bg-blue-500/10" },
  { label: "Neutral", emoji: "😐", color: "border-slate-500/40 text-slate-400 bg-slate-500/5 hover:bg-slate-500/10" },
  { label: "Calm", emoji: "🙂", color: "border-teal-500/40 text-teal-400 bg-teal-500/5 hover:bg-teal-500/10" },
  { label: "Joyful", emoji: "😊", color: "border-amber-500/40 text-amber-400 bg-amber-500/5 hover:bg-amber-500/10" },
  { label: "Angry", emoji: "😡", color: "border-red-500/40 text-red-400 bg-red-500/5 hover:bg-red-500/10" }
]

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedMood, setSelectedMood] = useState<string>("")
  const [selectedEmoji, setSelectedEmoji] = useState<string>("")
  
  // feedback status states
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Map database entry structure to UI component structure
  const parseDbEntry = (dbEntry: any): JournalEntry => {
    const contentStr = dbEntry.content || ""
    const parts = contentStr.split("\n\n")
    const title = parts[0] || "Untitled Log"
    const content = parts.slice(1).join("\n\n") || ""
    
    // Find matching emoji for moodTag
    const moodOpt = moodOptions.find(opt => opt.label.toLowerCase() === (dbEntry.moodTag || "").toLowerCase())
    const emoji = moodOpt ? moodOpt.emoji : "📝"
    const mood = dbEntry.moodTag || "Journal"

    return {
      id: dbEntry.id,
      title,
      content,
      mood,
      emoji,
      date: new Date(dbEntry.createdAt)
    }
  }

  // Fetch journal entries from database on mount
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setIsLoading(true)
        const res = await fetch("/api/journal")
        if (res.ok) {
          const data = await res.json()
          const parsed = data.map((ent: any) => parseDbEntry(ent))
          setEntries(parsed)
        }
      } catch (err) {
        console.error("Failed to load journal logs:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchEntries()
  }, [])

  const handleMoodSelect = (mood: string, emoji: string) => {
    setSelectedMood(mood)
    setSelectedEmoji(emoji)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    if (!selectedMood) {
      setToastMessage("Please select a mood emoji before saving!")
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      return
    }

    setIsSaving(true)

    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          mood: selectedMood
        })
      })

      if (res.ok) {
        const newDbEntry = await res.json()
        const parsedEntry = parseDbEntry(newDbEntry)

        setEntries((prev) => [parsedEntry, ...prev])
        setTitle("")
        setContent("")
        setSelectedMood("")
        setSelectedEmoji("")
        setToastMessage("Journal entry saved successfully! +15 Hope Score points earned.")
        setShowToast(true)
      } else {
        const errData = await res.json()
        setToastMessage(errData.error || "Failed to save journal entry.")
        setShowToast(true)
      }
    } catch (err) {
      console.error("Error saving journal:", err)
      setToastMessage("An error occurred. Please try again.")
      setShowToast(true)
    } finally {
      setIsSaving(false)
      setTimeout(() => {
        setShowToast(false)
      }, 3500)
    }
  }

  // Calculate words count
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 animate-fade-slide-in relative">
      
      {/* Toast Alert popup */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-indigo-600/90 backdrop-blur border border-indigo-400/20 px-5 py-4 rounded-[16px] text-white shadow-2xl text-xs font-bold animate-fade-slide-in">
          <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Grid: Left editor, Right history */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Editor Form */}
        <div className="lg:col-span-2 flex flex-col gap-6 bg-card text-card-foreground border border-border/80 rounded-[20px] p-6 sm:p-8">
          
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div>
              <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                <BookOpen className="h-5.5 w-5.5 text-indigo-400" />
                Reflective Journal
              </h1>
              <p className="text-xs text-muted-foreground">Log your thoughts. Antipal analyzes themes to tailor guidance.</p>
            </div>
            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-[10px] text-[10px] font-bold text-amber-400">
              <Flame className="h-4 w-4" /> 4 Day Streak
            </div>
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-5">
            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground/80">Title</label>
              <input
                type="text"
                placeholder="What is on your mind today?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full h-11 px-4 rounded-[14px] border border-border bg-muted/20 text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-all"
              />
            </div>

            {/* Content Textarea */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-foreground/80">Content</label>
                <span className="text-[10px] text-muted-foreground">{wordCount} words</span>
              </div>
              <textarea
                placeholder="Start writing your thoughts here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={8}
                className="w-full p-4 rounded-[14px] border border-border bg-muted/20 text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-all resize-y min-h-[180px]"
              />
            </div>

            {/* Mood Emojis selector */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-foreground/80">How do you feel about this entry?</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {moodOptions.map((opt) => {
                  const isSelected = selectedMood === opt.label
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => handleMoodSelect(opt.label, opt.emoji)}
                      className={`py-2 px-3 border rounded-[14px] text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary-foreground font-bold shadow-sm"
                          : opt.color
                      }`}
                    >
                      <span className="text-xl leading-none">{opt.emoji}</span>
                      <span>{opt.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Submit save button */}
            <div className="flex items-center justify-between mt-2 pt-4 border-t border-border/40">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase">
                <ShieldCheck className="h-4 w-4 text-emerald-500" /> Private & Protected
              </div>
              <button
                type="submit"
                disabled={isSaving || !title.trim() || !content.trim()}
                className="px-6 py-2.5 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-sm rounded-[14px] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none active:scale-95 shadow-md shadow-indigo-500/10"
              >
                {isSaving ? (
                  <div className="h-4.5 w-4.5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Save Journal Entry
                  </>
                )}
              </button>
            </div>
          </form>

        </div>

        {/* Right Side: Historical entries list */}
        <div className="flex flex-col gap-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 px-1">
            <Calendar className="h-4 w-4" /> Recent Diaries
          </h2>

          <div className="flex flex-col gap-4 max-h-[550px] overflow-y-auto pr-1">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-8 border border-border/80 bg-card rounded-[20px] gap-2.5">
                <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-muted-foreground">Loading journal history...</span>
              </div>
            ) : entries.length === 0 ? (
              <div className="border border-border/80 bg-card rounded-[20px] p-6 text-center text-xs text-muted-foreground">
                No saved entries yet. Type above to record.
              </div>
            ) : (
              entries.map((ent) => (
                <div
                  key={ent.id}
                  className="border border-border/60 bg-card/60 rounded-[20px] p-5 flex flex-col gap-2 hover:border-border transition-all"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-foreground line-clamp-1">
                      {ent.title}
                    </span>
                    <span className="text-xs shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-[8px] bg-muted border border-border/80 text-[10px] font-bold">
                      {ent.emoji} {ent.mood}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {ent.content}
                  </p>
                  <span className="text-[9px] font-semibold text-slate-500 mt-1 block">
                    {ent.date.toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

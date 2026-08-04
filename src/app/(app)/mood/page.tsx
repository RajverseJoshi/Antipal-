"use client"

import React, { useState } from "react"
import { Calendar, Smile, ShieldAlert, Sparkles, Plus, Check, Award } from "lucide-react"

interface MoodLog {
  value: number
  emoji: string
  label: string
  tags: string[]
  notes: string
  date: string
}

const emojiMap: Record<number, { emoji: string; label: string; color: string }> = {
  1: { emoji: "😭", label: "Terrible", color: "text-rose-500" },
  2: { emoji: "😢", label: "Very Bad", color: "text-rose-400" },
  3: { emoji: "😔", label: "Bad", color: "text-orange-400" },
  4: { emoji: "😟", label: "Down", color: "text-amber-400" },
  5: { emoji: "😐", label: "Okay", color: "text-slate-400" },
  6: { emoji: "🙂", label: "Alright", color: "text-teal-400" },
  7: { emoji: "😊", label: "Good", color: "text-emerald-400" },
  8: { emoji: "😁", label: "Very Good", color: "text-emerald-400" },
  9: { emoji: "🥰", label: "Wonderful", color: "text-pink-400" },
  10: { emoji: "🤩", label: "Amazing", color: "text-amber-400" }
}

const factorsList = ["Sleep", "Studies", "Work", "Exercise", "Diet", "Friends", "Family", "Hobbies", "Weather", "Health"]

const initialHistory: MoodLog[] = [
  { value: 7, emoji: "😊", label: "Good", tags: ["Friends", "Exercise"], notes: "Had a great jog in the morning and caught up with Sam.", date: "Yesterday" },
  { value: 5, emoji: "😐", label: "Okay", tags: ["Studies"], notes: "A bit saturated with exam prep, but got decent hours in.", date: "2 days ago" },
  { value: 4, emoji: "😟", label: "Down", tags: ["Sleep", "Health"], notes: "Did not sleep well, woke up with a minor headache.", date: "3 days ago" },
  { value: 8, emoji: "😁", label: "Very Good", tags: ["Hobbies", "Family"], notes: "Cooked dinner with my family, played some music.", date: "4 days ago" },
  { value: 6, emoji: "🙂", label: "Alright", tags: ["Work"], notes: "Standard day at the office, nothing special.", date: "5 days ago" }
]

export default function MoodPage() {
  const [sliderVal, setSliderVal] = useState(7)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [note, setNote] = useState("")
  const [history, setHistory] = useState<MoodLog[]>(initialHistory)
  
  const [showToast, setShowToast] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const activeMood = emojiMap[sliderVal] || { emoji: "😐", label: "Okay", color: "text-slate-400" }

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      const newLog: MoodLog = {
        value: sliderVal,
        emoji: activeMood.emoji,
        label: activeMood.label,
        tags: [...selectedTags],
        notes: note.trim(),
        date: "Today"
      }

      setHistory((prev) => [newLog, ...prev])
      setSelectedTags([])
      setNote("")
      setIsSubmitting(false)
      setShowToast(true)

      // Hide toast after 3s
      setTimeout(() => setShowToast(false), 3000)
    }, 800)
  }

  // Visual custom SVG Line chart variables
  // Let's render the last 6 days including today (if logged)
  // Mapping values to Y coordinates (0 to 10 range mapped to 160 to 20 coordinates)
  // X coordinates (Monday to Sunday)
  const chartPoints = [
    { label: "Mon", val: 6 },
    { label: "Tue", val: 8 },
    { label: "Wed", val: 4 },
    { label: "Thu", val: 5 },
    { label: "Fri", val: 7 },
    { label: "Sat", val: sliderVal } // dynamically connected to current slider for premium feel!
  ]

  const width = 500
  const height = 180
  const paddingLeft = 40
  const paddingRight = 20
  const paddingTop = 20
  const paddingBottom = 30

  const chartWidth = width - paddingLeft - paddingRight
  const chartHeight = height - paddingTop - paddingBottom

  // Coordinates builder helper
  const pointsCoords = chartPoints.map((pt, idx) => {
    const x = paddingLeft + (idx / (chartPoints.length - 1)) * chartWidth
    // Invert Y: 10 is at paddingTop, 0 is at (height - paddingBottom)
    const y = height - paddingBottom - (pt.val / 10) * chartHeight
    return { x, y, label: pt.label, val: pt.val }
  })

  // SVG Path generator
  let pathD = ""
  if (pointsCoords.length > 0) {
    pathD = `M ${pointsCoords[0].x} ${pointsCoords[0].y} `
    for (let i = 1; i < pointsCoords.length; i++) {
      // Use smooth Bezier control points
      const cpX1 = pointsCoords[i - 1].x + (pointsCoords[i].x - pointsCoords[i - 1].x) / 2
      const cpY1 = pointsCoords[i - 1].y
      const cpX2 = pointsCoords[i - 1].x + (pointsCoords[i].x - pointsCoords[i - 1].x) / 2
      const cpY2 = pointsCoords[i].y
      pathD += `C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${pointsCoords[i].x} ${pointsCoords[i].y} `
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 animate-fade-slide-in relative">
      
      {/* Dynamic Toast Alert popup */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-indigo-600/90 backdrop-blur border border-indigo-400/20 px-5 py-4 rounded-[16px] text-white shadow-2xl text-xs font-bold animate-fade-slide-in">
          <Award className="h-5 w-5 text-amber-400 shrink-0" />
          <span>Daily Mood logged! +10 Hope Score points earned.</span>
        </div>
      )}

      {/* Main Grid: Left editor checker, Right Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Card: Mood logger */}
        <div className="lg:col-span-2 flex flex-col gap-6 bg-card text-card-foreground border border-border/80 rounded-[20px] p-6 sm:p-8">
          <div>
            <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <Smile className="h-5.5 w-5.5 text-indigo-400" />
              Daily Mood Log
            </h1>
            <p className="text-xs text-muted-foreground">Rate your energy and state. Consistency grows your Recovery Tree.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Interactive Emoji Slider Display */}
            <div className="bg-muted/30 border border-border/40 p-6 rounded-[20px] flex flex-col items-center gap-4">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                Active Rating
              </span>
              <div className="flex flex-col items-center gap-1">
                <span className="text-6xl select-none animate-bounce">{activeMood.emoji}</span>
                <span className={`text-lg font-extrabold ${activeMood.color}`}>{activeMood.label} ({sliderVal}/10)</span>
              </div>

              {/* Range Input Slider */}
              <div className="w-full px-2 mt-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={sliderVal}
                  onChange={(e) => setSliderVal(Number(e.target.value))}
                  className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-2 font-semibold">
                  <span>Terrible</span>
                  <span>Okay</span>
                  <span>Amazing</span>
                </div>
              </div>
            </div>

            {/* Factors Selection Tags */}
            <div className="flex flex-col gap-2.5">
              <label className="text-xs font-semibold text-foreground/80">What is influencing your mood today?</label>
              <div className="flex flex-wrap gap-2">
                {factorsList.map((tag) => {
                  const isActive = selectedTags.includes(tag)
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className={`text-xs font-semibold px-3 py-1.5 border rounded-[12px] transition-all cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? "border-primary bg-primary/10 text-primary-foreground font-bold"
                          : "border-border/80 bg-muted/20 text-muted-foreground hover:bg-muted/40"
                      }`}
                    >
                      {isActive && <Check className="h-3 w-3 text-primary" />}
                      {tag}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Optional Note */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground/80">Additional Notes (Optional)</label>
              <textarea
                placeholder="Write down any events, challenges, or milestones..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                className="w-full p-4 rounded-[14px] border border-border bg-muted/20 text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-all resize-none"
              />
            </div>

            {/* Submit Logger Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-sm rounded-[14px] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/10 active:scale-99 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                "Save Mood Check-in"
              )}
            </button>

          </form>
        </div>

        {/* Right Card Panel: Trend and History */}
        <div className="flex flex-col gap-6">
          
          {/* Trend Chart Box */}
          <div className="bg-card text-card-foreground border border-border/80 rounded-[20px] p-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-4 px-1">
              <Calendar className="h-4 w-4" /> Weekly Mood Trend
            </h3>

            {/* Custom SVG Line Chart rendering */}
            <div className="relative bg-muted/20 border border-border/40 p-4 rounded-[16px] overflow-hidden">
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
                {/* Defs for gradients */}
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#a78bfa" />
                  </linearGradient>
                </defs>

                {/* Horizontal Guide lines */}
                {[0, 2.5, 5, 7.5, 10].map((val) => {
                  const y = height - paddingBottom - (val / 10) * chartHeight
                  return (
                    <line
                      key={val}
                      x1={paddingLeft}
                      y1={y}
                      x2={width - paddingRight}
                      y2={y}
                      stroke="currentColor"
                      className="text-border/45"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                  )
                })}

                {/* Y Axis grid value indicators */}
                <text x={paddingLeft - 10} y={height - paddingBottom - (0 / 10) * chartHeight} textAnchor="end" className="fill-muted-foreground text-[10px] font-bold">1</text>
                <text x={paddingLeft - 10} y={height - paddingBottom - (5 / 10) * chartHeight} textAnchor="end" className="fill-muted-foreground text-[10px] font-bold">5</text>
                <text x={paddingLeft - 10} y={height - paddingBottom - (10 / 10) * chartHeight} textAnchor="end" className="fill-muted-foreground text-[10px] font-bold">10</text>

                {/* Gradient area under line */}
                {pointsCoords.length > 0 && (
                  <path
                    d={`${pathD} L ${pointsCoords[pointsCoords.length - 1].x} ${height - paddingBottom} L ${pointsCoords[0].x} ${height - paddingBottom} Z`}
                    fill="url(#chartGrad)"
                  />
                )}

                {/* Curved line chart */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="url(#lineGrad)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Coordinates points circles and text */}
                {pointsCoords.map((pt, idx) => (
                  <g key={idx}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="4.5"
                      className="fill-indigo-500 stroke-card"
                      strokeWidth="2.5"
                    />
                    {/* Value indicator overlay label on hover or default */}
                    <text
                      x={pt.x}
                      y={pt.y - 10}
                      textAnchor="middle"
                      className="fill-foreground text-[9px] font-extrabold"
                    >
                      {pt.val}
                    </text>
                    {/* X Axis Labels */}
                    <text
                      x={pt.x}
                      y={height - 10}
                      textAnchor="middle"
                      className="fill-muted-foreground text-[10px] font-semibold"
                    >
                      {pt.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Historical Logs List */}
          <div className="bg-card text-card-foreground border border-border/80 rounded-[20px] p-5 flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">
              Previous Logs
            </h3>
            <div className="flex flex-col gap-3.5 max-h-[300px] overflow-y-auto pr-1">
              {history.map((log, idx) => (
                <div
                  key={idx}
                  className="bg-muted/10 border border-border/50 rounded-[14px] p-3.5 flex flex-col gap-1.5 hover:border-border transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <span className="text-2xl select-none">{log.emoji}</span>
                      <span className="text-xs font-bold text-foreground">{log.label} ({log.value}/10)</span>
                    </div>
                    <span className="text-[9px] font-semibold text-slate-500">{log.date}</span>
                  </div>
                  {log.notes && (
                    <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                      "{log.notes}"
                    </p>
                  )}
                  {log.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {log.tags.map((tag) => (
                        <span key={tag} className="text-[8px] font-bold px-1.5 py-0.5 rounded-[6px] bg-muted border border-border/80 text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

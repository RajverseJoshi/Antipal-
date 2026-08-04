"use client"

import React, { useState, useEffect } from "react"
import { Phone, ShieldAlert, Sparkles, AlertTriangle, Wind, Info, Heart } from "lucide-react"

type BreathPhase = "Inhale" | "Hold" | "Exhale" | "Idle"

export default function CrisisPage() {
  // Breathing state
  const [breathPhase, setBreathPhase] = useState<BreathPhase>("Idle")
  const [breathCounter, setBreathCounter] = useState(0)

  // Call mock status feedbacks
  const [sosStatus, setSosStatus] = useState<string | null>(null)

  useEffect(() => {
    if (breathPhase === "Idle") return

    const interval = setInterval(() => {
      setBreathCounter((prev) => {
        const next = prev + 1
        
        // 4-7-8 Breathing logic:
        // Inhale: 4 seconds (0, 1, 2, 3)
        // Hold: 7 seconds (4, 5, 6, 7, 8, 9, 10)
        // Exhale: 8 seconds (11, 12, 13, 14, 15, 16, 17, 18)
        if (next < 4) {
          setBreathPhase("Inhale")
        } else if (next >= 4 && next < 11) {
          setBreathPhase("Hold")
        } else if (next >= 11 && next < 19) {
          setBreathPhase("Exhale")
        } else {
          // Restart cycle
          setBreathPhase("Inhale")
          return 0
        }
        return next
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [breathPhase])

  const handleStartBreathing = () => {
    setBreathPhase("Inhale")
    setBreathCounter(0)
  }

  const handleStopBreathing = () => {
    setBreathPhase("Idle")
    setBreathCounter(0)
  }

  const handleTriggerSOS = (target: string) => {
    setSosStatus(`Connecting you to ${target}... Please stay calm.`)
    setTimeout(() => setSosStatus(null), 5000)
  }

  // Get circle animation class or size style
  const getCircleScaleStyle = () => {
    if (breathPhase === "Inhale") {
      // Scale up gradually from 1.0 to 1.5
      const progress = breathCounter / 4
      return { transform: `scale(${1.0 + progress * 0.5})` }
    } else if (breathPhase === "Hold") {
      return { transform: `scale(1.5)` }
    } else if (breathPhase === "Exhale") {
      // Scale down gradually from 1.5 to 1.0
      const progress = (breathCounter - 11) / 8
      return { transform: `scale(${1.5 - progress * 0.5})` }
    }
    return { transform: `scale(1.0)` }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 animate-fade-slide-in relative">
      
      {/* Background glow in warm colors (SOS/Calming alert theme) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-rose-500/5 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* SOS Toast notification */}
      {sosStatus && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-rose-600/90 border border-rose-400/20 px-5 py-4 rounded-[16px] text-white shadow-2xl text-xs font-bold animate-fade-slide-in">
          <Phone className="h-5 w-5 animate-pulse text-white shrink-0" />
          <span>{sosStatus}</span>
        </div>
      )}

      {/* Upper header */}
      <div className="flex items-center gap-3 border-b border-border/80 pb-5 mb-8">
        <div className="h-11 w-11 rounded-[12px] bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-500">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-rose-500 leading-tight">SOS & Emergency Support</h1>
          <p className="text-xs text-muted-foreground">Immediate guidance, helpline numbers, and grounding techniques.</p>
        </div>
      </div>

      {/* Grid: Call widgets and Grounding exercises */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Side: Call Buttons & Safe Banners */}
        <div className="flex flex-col gap-5">
          <div className="bg-card text-card-foreground border border-border/80 rounded-[20px] p-6 flex flex-col gap-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Emergency Alerts</h2>
            
            {/* Call Primary Contact */}
            <button
              onClick={() => handleTriggerSOS("Papa (Emergency Contact)")}
              className="w-full py-4 px-5 rounded-[16px] bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm transition-all cursor-pointer flex items-center justify-between shadow-lg shadow-rose-500/15 active:scale-99"
            >
              <div className="flex items-center gap-3 text-left">
                <Phone className="h-5 w-5" />
                <div>
                  <p className="font-extrabold text-sm leading-none">Call Emergency Contact</p>
                  <p className="text-[10px] text-rose-100 mt-1">Papa • +91 98765 43210</p>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase bg-white/20 px-2 py-1 rounded-[8px]">SOS</span>
            </button>

            {/* Call Helplines */}
            <div className="flex flex-col gap-3 mt-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">National Support Helplines</span>
              
              <button
                onClick={() => handleTriggerSOS("KIRAN Mental Health Helpline")}
                className="w-full py-3.5 px-4 rounded-[14px] border border-border bg-muted/20 hover:bg-muted/40 transition-all cursor-pointer flex justify-between items-center text-xs font-semibold text-foreground active:scale-99"
              >
                <div className="text-left">
                  <p className="font-bold">KIRAN Mental Health Helpline</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Government of India support (Confidential)</p>
                </div>
                <span className="text-indigo-400 font-bold text-xs shrink-0 flex items-center gap-1">
                  <Phone className="h-3 w-3" /> 1800-599-0019
                </span>
              </button>

              <button
                onClick={() => handleTriggerSOS("AASRA Suicide Helpline")}
                className="w-full py-3.5 px-4 rounded-[14px] border border-border bg-muted/20 hover:bg-muted/40 transition-all cursor-pointer flex justify-between items-center text-xs font-semibold text-foreground active:scale-99"
              >
                <div className="text-left">
                  <p className="font-bold">AASRA National Helpline</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">24/7 Crisis Intervention support</p>
                </div>
                <span className="text-indigo-400 font-bold text-xs shrink-0 flex items-center gap-1">
                  <Phone className="h-3 w-3" /> 91-9820466726
                </span>
              </button>
            </div>
          </div>

          <div className="bg-muted/20 border border-border/60 p-5 rounded-[20px] flex gap-3.5 items-start">
            <Info className="h-5.5 w-5.5 text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-300 leading-relaxed">
              <strong>Important Notice:</strong> Clicking the emergency call alert logs the crisis timestamp locally. Antipal will temporarily freeze chat triggers and present grounding guidance prompts until you mark yourself safe.
            </p>
          </div>
        </div>

        {/* Right Side: 4-7-8 Breathing Grounding Circle */}
        <div className="bg-card text-card-foreground border border-border/80 rounded-[20px] p-6 flex flex-col items-center gap-6 text-center">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-center gap-1.5">
              <Wind className="h-4.5 w-4.5 text-teal-400" /> Grounding Exercise
            </h2>
            <p className="text-xs text-muted-foreground mt-1">Calm your nervous system using 4-7-8 breathing cycles.</p>
          </div>

          {/* Calming visual container */}
          <div className="h-56 w-full flex items-center justify-center relative bg-muted/15 border border-border/30 rounded-[20px] overflow-hidden">
            {breathPhase === "Idle" ? (
              <button
                onClick={handleStartBreathing}
                className="relative z-10 px-5 py-3.5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-[14px] transition-all cursor-pointer shadow-lg shadow-teal-500/15"
              >
                Start Breathing Cycle
              </button>
            ) : (
              <div className="flex flex-col items-center gap-5 relative z-10">
                {/* Breathing Circle Visual */}
                <div className="relative h-28 w-28 flex items-center justify-center">
                  {/* Backdrop glowing animated circles */}
                  <div
                    className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                      breathPhase === "Inhale"
                        ? "bg-teal-500/10 scale-125"
                        : breathPhase === "Hold"
                        ? "bg-indigo-500/10 scale-150"
                        : "bg-teal-500/5 scale-100"
                    }`}
                  />
                  <div
                    className="h-20 w-20 rounded-full bg-gradient-to-r from-teal-400 to-indigo-400 text-white flex items-center justify-center text-xs font-bold shadow-xl transition-all duration-1000 ease-in-out"
                    style={getCircleScaleStyle()}
                  >
                    <Wind className="h-8 w-8" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <h3 className="text-base font-extrabold text-foreground tracking-tight uppercase">
                    {breathPhase}...
                  </h3>
                  <p className="text-xs text-muted-foreground h-4">
                    {breathPhase === "Inhale" && `Breathe in slowly through your nose (${4 - (breathCounter % 4)}s)`}
                    {breathPhase === "Hold" && `Hold your breath gently (${11 - breathCounter}s)`}
                    {breathPhase === "Exhale" && `Breathe out fully through your mouth (${19 - breathCounter}s)`}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Timer helper action */}
          {breathPhase !== "Idle" && (
            <button
              onClick={handleStopBreathing}
              className="text-xs text-rose-400 font-bold hover:underline cursor-pointer border border-rose-500/20 px-3.5 py-2 bg-rose-500/5 rounded-[12px]"
            >
              Stop & Exit Grounding
            </button>
          )}

        </div>

      </div>
    </div>
  )
}

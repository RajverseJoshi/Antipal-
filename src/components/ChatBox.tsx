"use client"

import React, { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Activity, AlertCircle, HeartPulse } from "lucide-react"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

export function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [stressScore, setStressScore] = useState<number | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const newMessage: Message = { id: Date.now().toString(), role: "user", content: input }
    setMessages(prev => [...prev, newMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, newMessage] })
      })

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Daily message limit reached for free tier.")
        } else if (response.status === 401) {
          throw new Error("Please log in to continue chatting.")
        }
        throw new Error("Failed to send message")
      }

      const data = await response.json()
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply || "I'm sorry, I couldn't process that."
      }
      
      setMessages(prev => [...prev, aiMessage])
      if (typeof data.stress_score === 'number') {
        setStressScore(data.stress_score)
      }
      
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Error: ${error.message}`
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Determine stress indicator styling based on score
  let stressIndicator = {
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-500/20",
    icon: <HeartPulse className="h-4 w-4" />,
    text: "Calm & Balanced"
  }

  if (stressScore !== null) {
    if (stressScore >= 75) {
      stressIndicator = {
        color: "text-rose-400",
        bg: "bg-rose-400/10",
        border: "border-rose-500/20",
        icon: <AlertCircle className="h-4 w-4" />,
        text: "High Stress Detected"
      }
    } else if (stressScore >= 40) {
      stressIndicator = {
        color: "text-amber-400",
        bg: "bg-amber-400/10",
        border: "border-amber-500/20",
        icon: <Activity className="h-4 w-4" />,
        text: "Elevated Tension"
      }
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] sm:h-[calc(100vh-80px)] w-full max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-100 font-sans relative overflow-hidden">
      {/* Dynamic Background Glow based on Stress */}
      <div 
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-colors duration-1000 opacity-20
          ${stressScore !== null && stressScore >= 75 ? 'bg-rose-600' : 
            stressScore !== null && stressScore >= 40 ? 'bg-amber-600' : 'bg-emerald-600'}`} 
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white leading-tight">Antipal Coach</h1>
            <p className="text-xs text-slate-400">Always here to listen</p>
          </div>
        </div>
        
        {stressScore !== null && (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${stressIndicator.bg} ${stressIndicator.border} ${stressIndicator.color} transition-all duration-500`}>
            {stressIndicator.icon}
            <span className="text-xs font-semibold hidden sm:inline">{stressIndicator.text}</span>
            <span className="text-xs ml-1 opacity-70">({stressScore}/100)</span>
          </div>
        )}
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth z-10 relative">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
            <Bot className="h-16 w-16 text-slate-500" />
            <p className="text-slate-400 max-w-sm">
              Hello. I'm Antipal. I'm here to support you, listen without judgment, and help you find your balance. How are you feeling today?
            </p>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-300`}>
              <div className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center shadow-sm
                  ${m.role === 'user' ? 'bg-slate-800 border border-slate-700 text-slate-300' : 'bg-indigo-600 text-white shadow-indigo-500/20'}
                `}>
                  {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                
                {/* Bubble */}
                <div className={`px-5 py-3.5 rounded-[20px] text-sm leading-relaxed shadow-sm
                  ${m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-sm shadow-indigo-600/10' 
                    : 'bg-slate-800 border border-slate-700/50 text-slate-200 rounded-tl-sm'
                  }
                `}>
                  {m.content}
                </div>
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start animate-in fade-in">
            <div className="flex gap-3 max-w-[85%]">
              <div className="shrink-0 h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                <Bot className="h-4 w-4" />
              </div>
              <div className="px-5 py-4 bg-slate-800 border border-slate-700/50 rounded-[20px] rounded-tl-sm flex gap-1.5 items-center">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900/80 backdrop-blur-xl border-t border-slate-800 z-10 relative">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative flex items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="w-full bg-slate-800/50 border border-slate-700 text-slate-100 placeholder:text-slate-500 rounded-full pl-6 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all disabled:opacity-50"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="absolute right-2 h-10 w-10 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white rounded-full flex items-center justify-center transition-all disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-md shadow-indigo-600/20"
          >
            <Send className="h-4 w-4 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  )
}

"use client"

import React, { useRef, useEffect, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { Send, Sparkles, User, HelpCircle, ShieldCheck } from "lucide-react"

const suggestions = [
  "I am feeling anxious about my upcoming exams.",
  "Can you guide me through a quick grounding exercise?",
  "I want to write in my journal, but don't know where to start.",
  "Help me reframe some negative thoughts I'm having."
]

export default function ChatPage() {
  const { messages, sendMessage, status, error } = useChat()
  const [input, setInput] = useState("")
  const chatEndRef = useRef<HTMLDivElement>(null)

  const isGenerating = status === "submitted" || status === "streaming"

  // Scroll to bottom on message updates
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isGenerating])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isGenerating) return
    sendMessage({ text: input.trim() })
    setInput("")
  }

  const handleSuggestionClick = (sug: string) => {
    if (isGenerating) return
    sendMessage({ text: sug })
  }

  // Extract text content safely from UIMessage parts
  const getMessageText = (msg: any) => {
    if (msg.content) return msg.content
    if (!msg.parts) return ""
    return msg.parts
      .filter((part: any) => part.type === "text")
      .map((part: any) => part.text)
      .join("")
  }

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] sm:h-[calc(100vh-80px)] w-full max-w-4xl mx-auto px-4 py-4 animate-fade-slide-in">
      
      {/* Upper header summary */}
      <div className="flex items-center justify-between border-b border-border/80 pb-4 mb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-400" />
            AI Wellness Coach
          </h1>
          <p className="text-xs text-muted-foreground">Always active, completely confidential, and empathetic.</p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-[10px] text-[10px] font-bold text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5" /> Confidential
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 border border-rose-500/20 bg-rose-500/5 text-rose-500 rounded-[14px] text-xs font-semibold">
          Error: {error.message || "Failed to generate chat response. Please verify your OpenAI key."}
        </div>
      )}

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4 scrollbar-thin">
        {/* Render welcome message if history is empty */}
        {messages.length === 0 && (
          <div className="flex gap-3 max-w-[85%] sm:max-w-[75%] self-start">
            <div className="h-8 w-8 shrink-0 rounded-full flex items-center justify-center border bg-primary/10 border-primary text-primary">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="p-4 rounded-[20px] rounded-tl-[4px] text-sm leading-relaxed bg-card text-card-foreground border border-border/60">
                Hello! I am your Antipal AI Wellness Coach. How can I help you today? Remember, you can talk to me about anything that's on your mind.
              </div>
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const isAi = msg.role === "assistant"
          const messageText = getMessageText(msg)
          
          if (!messageText) return null

          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${
                isAi ? "self-start" : "self-end flex-row-reverse"
              }`}
            >
              {/* Avatar indicator */}
              <div
                className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center border ${
                  isAi
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-muted border-border text-muted-foreground"
                }`}
              >
                {isAi ? <Sparkles className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>

              {/* Message Bubble */}
              <div className="flex flex-col gap-1">
                <div
                  className={`p-4 rounded-[20px] text-sm leading-relaxed ${
                    isAi
                      ? "bg-card text-card-foreground border border-border/60 rounded-tl-[4px]"
                      : "bg-primary text-primary-foreground rounded-tr-[4px]"
                  }`}
                >
                  {messageText}
                </div>
              </div>
            </div>
          )
        })}

        {/* Typing indicator */}
        {isGenerating && messages[messages.length - 1]?.role === "user" && (
          <div className="flex gap-3 self-start max-w-[75%]">
            <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 border border-primary text-primary flex items-center justify-center">
              <Sparkles className="h-4 w-4 animate-pulse" />
            </div>
            <div className="bg-card text-card-foreground border border-border/60 p-4 rounded-[20px] rounded-tl-[4px] flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggestion tags (Only visible when starting chat or few messages) */}
      {messages.length === 0 && (
        <div className="mt-4 flex flex-col gap-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            <HelpCircle className="h-3 w-3" /> Quick Prompts
          </span>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((sug) => (
              <button
                key={sug}
                onClick={() => handleSuggestionClick(sug)}
                disabled={isGenerating}
                className="text-xs text-left bg-muted/20 hover:bg-muted/40 border border-border/80 px-3.5 py-2 rounded-[14px] transition-all cursor-pointer text-slate-300 hover:text-white disabled:opacity-50"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer input form */}
      <form onSubmit={handleFormSubmit} className="mt-4 relative flex items-center">
        <input
          type="text"
          placeholder="Ask me anything, e.g. how to handle feelings..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isGenerating}
          className="w-full h-12 pl-4 pr-14 rounded-[14px] border border-border bg-card text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-all disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={!input.trim() || isGenerating}
          className="absolute right-2 h-8 w-10 flex items-center justify-center rounded-[10px] bg-primary text-primary-foreground hover:bg-primary/95 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none active:scale-95"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
      
    </div>
  )
}

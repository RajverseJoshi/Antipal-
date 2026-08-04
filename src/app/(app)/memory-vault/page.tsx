"use client"

import React, { useState } from "react"
import { Image, Plus, Heart, Calendar, X, Upload, FileText, Compass, Sparkles } from "lucide-react"

interface Memory {
  id: string
  title: string
  description: string
  importance: string
  date: string
  imageUrl: string
}

const initialMemories: Memory[] = [
  {
    id: "1",
    title: "Hackathon Victory with Friends",
    description: "We spent 36 hours coding a collaborative workspace and ended up taking home the first-place prize. The caffeine and team synergy were unmatched.",
    importance: "It reminds me that I am capable of building great projects and finding solutions under intense time pressure.",
    date: "July 24, 2026",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "2",
    title: "Calm Mountain Walk in Kasol",
    description: "Woke up early to watch the fog roll off the pine trees. The river sound was loud but peaceful, and the mountain air was incredibly crisp.",
    importance: "Whenever my apartment feels small and work gets overwhelming, I close my eyes and remember this silence.",
    date: "June 12, 2026",
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "3",
    title: "Puppy Adoption Day",
    description: "Brought home Leo. He was small enough to fit inside a shoe box and fell asleep on my chest almost immediately.",
    importance: "Leo teaches me that simple things are worth celebrating and that there is always pure affection waiting at home.",
    date: "April 05, 2026",
    imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80"
  }
]

export default function MemoryVaultPage() {
  const [memories, setMemories] = useState<Memory[]>(initialMemories)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // New Memory form state
  const [newTitle, setNewTitle] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newImportance, setNewImportance] = useState("")
  const [mockFileUploaded, setMockFileUploaded] = useState(false)
  const [mockImgUrl, setMockImgUrl] = useState("")

  const handleOpenModal = () => {
    setIsModalOpen(true)
    setMockFileUploaded(false)
    setMockImgUrl("")
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setNewTitle("")
    setNewDescription("")
    setNewImportance("")
  }

  const handleMockUpload = () => {
    // Generate a beautiful generic wellness image path
    const fallbackImages = [
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80"
    ]
    const randomImg = fallbackImages[Math.floor(Math.random() * fallbackImages.length)]
    setMockImgUrl(randomImg)
    setMockFileUploaded(true)
  }

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newDescription.trim() || !newImportance.trim()) return

    const newMem: Memory = {
      id: Math.random().toString(),
      title: newTitle.trim(),
      description: newDescription.trim(),
      importance: newImportance.trim(),
      date: new Date().toLocaleDateString([], { year: "numeric", month: "long", day: "numeric" }),
      imageUrl: mockImgUrl || "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80"
    }

    setMemories((prev) => [newMem, ...prev])
    handleCloseModal()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 animate-fade-slide-in relative">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Compass className="h-6 w-6 text-indigo-400" />
            Memory Vault
          </h1>
          <p className="text-xs text-muted-foreground">Your emotional savings bank. AI anchors these memories during critical stress moments.</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold py-2.5 px-4.5 rounded-[14px] transition-all cursor-pointer shadow-lg shadow-indigo-500/15 select-none"
        >
          <Plus className="h-4 w-4" /> Add New Memory
        </button>
      </div>

      {/* Grid of Memories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memories.map((mem) => (
          <div
            key={mem.id}
            className="group flex flex-col bg-card text-card-foreground border border-border/80 rounded-[20px] overflow-hidden shadow-md hover:shadow-xl hover:border-border transition-all duration-300"
          >
            {/* Memory Image Header */}
            <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
              <img
                src={mem.imageUrl}
                alt={mem.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {mem.date}
                </span>
                <span className="h-6 w-6 rounded-full bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-500 text-xs">
                  <Heart className="h-3.5 w-3.5 fill-rose-500" />
                </span>
              </div>
            </div>

            {/* Memory Description Body */}
            <div className="p-5 flex-1 flex flex-col gap-4">
              <div>
                <h3 className="font-bold text-foreground text-sm tracking-tight mb-1">{mem.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{mem.description}</p>
              </div>

              {/* Dynamic Quote Anchor */}
              <div className="bg-primary/5 border border-primary/10 p-3.5 rounded-[14px] flex flex-col gap-1.5 mt-auto">
                <span className="text-[9px] uppercase font-bold text-indigo-400 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Why It Matters
                </span>
                <p className="text-[11px] text-indigo-300 leading-snug italic font-medium">
                  "{mem.importance}"
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Memory Modal Overlay Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-slide-in">
          
          <div className="bg-card border border-border/80 max-w-lg w-full rounded-[24px] shadow-2xl overflow-hidden animate-fade-slide-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-border/60">
              <h2 className="font-bold text-foreground text-base flex items-center gap-2">
                <Image className="h-5 w-5 text-indigo-400" /> Save a Happiness Memory
              </h2>
              <button
                onClick={handleCloseModal}
                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddMemory} className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80">Memory Title</label>
                <input
                  type="text"
                  placeholder="e.g. Graduation dinner, evening concert..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full h-11 px-4 rounded-[14px] border border-border bg-muted/20 text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80">What happened?</label>
                <textarea
                  placeholder="Describe the moment, who was there, what you felt..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  required
                  rows={3}
                  className="w-full p-4 rounded-[14px] border border-border bg-muted/20 text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-all resize-none"
                />
              </div>

              {/* Prompt Question field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-indigo-400 flex items-center gap-1">
                  Why is this memory important to you?
                </label>
                <textarea
                  placeholder="e.g. It shows me I have people who care / I can achieve my goals..."
                  value={newImportance}
                  onChange={(e) => setNewImportance(e.target.value)}
                  required
                  rows={2}
                  className="w-full p-4 rounded-[14px] border border-indigo-500/25 bg-indigo-500/5 text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-all resize-none"
                />
              </div>

              {/* Image upload simulator */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80">Add Image Attachment</label>
                {mockFileUploaded ? (
                  <div className="flex items-center justify-between p-3 border border-emerald-500/20 bg-emerald-500/5 rounded-[14px]">
                    <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                      <FileText className="h-4.5 w-4.5" />
                      <span>happy_memory_mock.jpg</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMockFileUploaded(false)}
                      className="text-xs text-rose-400 font-bold hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleMockUpload}
                    className="w-full border border-dashed border-border hover:border-muted-foreground p-5 rounded-[14px] flex flex-col items-center gap-1.5 text-center transition-all cursor-pointer"
                  >
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs font-semibold text-foreground">Click to upload photo</span>
                    <span className="text-[10px] text-muted-foreground">PNG, JPG up to 5MB (Simulated)</span>
                  </button>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 mt-2 border-t border-border/40 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="py-2.5 px-4.5 rounded-[14px] border border-border hover:bg-muted text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim() || !newDescription.trim() || !newImportance.trim()}
                  className="py-2.5 px-5 rounded-[14px] bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold cursor-pointer transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-95 shadow-md shadow-indigo-500/10"
                >
                  Save to Vault
                </button>
              </div>
            </form>

          </div>

        </div>
      )}

    </div>
  )
}

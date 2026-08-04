"use client"

import React from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 relative overflow-hidden">
      {/* Subtle background glows */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-64 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Layout Area */}
      <div className="flex flex-col md:pl-64 min-h-screen pb-16 md:pb-0 relative z-10">
        <Header />
        
        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 animate-fade-slide-in">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  )
}

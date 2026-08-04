"use client"

import React from "react"
import Link from "next/link"
import { Bell, Search, User } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border/80 bg-background/60 backdrop-blur-md px-6 md:px-8">
      {/* Left side: Logo for Mobile (hidden on desktop since sidebar has it) */}
      <div className="flex items-center gap-2 md:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-primary text-primary-foreground font-bold text-base shadow-md">
          A
        </div>
        <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Antipal
        </span>
      </div>

      {/* Center: Search input (hidden on mobile, shown on desktop) */}
      <div className="hidden md:flex items-center max-w-md w-full relative">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          type="search"
          placeholder="Search entries, guidelines, support..."
          className="w-full h-9 pl-10 pr-4 rounded-[14px] border border-border bg-card text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-all"
        />
      </div>

      {/* Right side: Actions & User Avatar */}
      <div className="flex items-center gap-4 ml-auto md:ml-0">
        <ThemeToggle />

        {/* Notifications mock button */}
        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-[14px] border border-border bg-card hover:bg-muted text-foreground transition-all cursor-pointer hover:scale-105 active:scale-95"
          aria-label="View notifications"
        >
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-rose-500 ring-2 ring-background animate-pulse" />
        </button>

        {/* User Profile Avatar Link */}
        <Link
          href="/profile"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/10 border border-indigo-500/20 text-primary hover:bg-indigo-500/20 transition-all hover:scale-105"
        >
          <User className="h-5 w-5" />
        </Link>
      </div>
    </header>
  )
}

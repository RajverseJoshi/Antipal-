"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  MessageSquareHeart,
  Smile,
  BookOpen,
  Vault,
  BarChart2,
  Trophy,
  Sprout,
  Settings,
  AlertTriangle,
  User
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "AI Coach", href: "/chat", icon: MessageSquareHeart },
  { name: "Mood Tracker", href: "/mood", icon: Smile },
  { name: "Journal", href: "/journal", icon: BookOpen },
  { name: "Memory Vault", href: "/memory-vault", icon: Vault },
  { name: "Analytics", href: "/analytics", icon: BarChart2 },
  { name: "Achievements", href: "/achievements", icon: Trophy },
  { name: "Recovery Tree", href: "/recovery-tree", icon: Sprout },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col fixed left-0 top-0 border-r border-border/80 bg-card/70 backdrop-blur-md text-card-foreground p-5 justify-between transition-all duration-300">
      <div className="flex flex-col gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-primary text-primary-foreground font-bold text-lg shadow-lg shadow-indigo-500/20">
            A
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Antipal
          </span>
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-[14px] text-sm font-medium transition-all group duration-200 cursor-pointer",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-indigo-500/10"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-105",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Safety / Crisis Alert Card */}
      <div className="flex flex-col gap-3">
        <Link
          href="/crisis"
          className="flex items-center gap-3 px-3 py-3 rounded-[14px] text-sm font-semibold bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-500 transition-all cursor-pointer group"
        >
          <AlertTriangle className="h-5 w-5 animate-pulse text-rose-500 transition-transform duration-200 group-hover:scale-110" />
          <span>Crisis Support</span>
        </Link>
      </div>
    </aside>
  )
}

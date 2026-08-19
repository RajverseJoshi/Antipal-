"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  MessageSquareHeart,
  BookOpen,
  BarChart2,
  User
} from "lucide-react"
import { cn } from "@/lib/utils"

const mobileNavigation = [
  { name: "Home", href: "/dashboard", icon: LayoutDashboard },
  { name: "Chat", href: "/chat", icon: MessageSquareHeart },
  { name: "Journal", href: "/journal", icon: BookOpen },
  { name: "Analytics", href: "/analytics", icon: BarChart2 },
  { name: "Profile", href: "/profile", icon: User },
]

export function BottomNav() {
  const pathname = usePathname()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/80 bg-card/70 backdrop-blur-md text-card-foreground pb-safe-bottom">
      <div className="flex h-16 items-center justify-around px-2">
        {mobileNavigation.map((item) => {
          const isActive = mounted ? pathname === item.href : false
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-12 h-12 rounded-[12px] transition-all group duration-200 cursor-pointer",
                isActive
                  ? "text-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 mb-0.5 transition-transform duration-200 group-hover:scale-110",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              <span className="text-[10px] font-medium tracking-wide">
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

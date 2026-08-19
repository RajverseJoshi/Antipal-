"use client"

import React from "react"
import Link from "next/link"
import {
  MessageSquareHeart,
  Smile,
  Vault,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Heart,
  CheckCircle2,
  Mic,
  Video,
  Brain
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-indigo-600 text-white font-bold text-lg shadow-lg shadow-indigo-600/30">
            A
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Antipal
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-[14px] shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-6 py-20 overflow-hidden">
        {/* Abstract Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-violet-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold animate-pulse">
            <Sparkles className="h-3.5 w-3.5" />
            Empathetic Mental Wellness Companion
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-white">
            Your AI Companion for <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Better Mental Wellbeing
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-xl leading-relaxed">
            &quot;The companion that remembers your happiest moments when you forget them.&quot;
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full justify-center">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-[14px] shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              Get Started Now
              <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold rounded-[14px] transition-all flex items-center justify-center cursor-pointer"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="bg-slate-950/40 border-t border-slate-800 py-24 px-6">
        <div className="max-w-5xl mx-auto flex flex-col gap-12">
          <div className="text-center max-w-lg mx-auto flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight text-white">Designed to nurture resilience</h2>
            <p className="text-slate-400 text-sm">
              Antipal doesn&apos;t just track metrics; it proactively guides you back to hope and balance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="p-6 bg-slate-900 border border-slate-800/80 rounded-[20px] hover:border-indigo-500/30 transition-all flex gap-4">
              <div className="h-10 w-10 shrink-0 bg-indigo-500/10 border border-indigo-500/20 rounded-[14px] flex items-center justify-center text-indigo-400">
                <MessageSquareHeart className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-white text-base">Context-Aware AI Coach</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Have meaningful conversations with an emotionally intelligent coach that remembers your triggers, preferences, and progress.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-slate-900 border border-slate-800/80 rounded-[20px] hover:border-indigo-500/30 transition-all flex gap-4">
              <div className="h-10 w-10 shrink-0 bg-purple-500/10 border border-purple-500/20 rounded-[14px] flex items-center justify-center text-purple-400">
                <Smile className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-white text-base">Forgiving Growth Streaks</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Our Recovery Tree rewards effort. Missing a day drops a leaf, but your tree never dies. We focus on getting back up.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-slate-900 border border-slate-800/80 rounded-[20px] hover:border-indigo-500/30 transition-all flex gap-4">
              <div className="h-10 w-10 shrink-0 bg-rose-500/10 border border-rose-500/20 rounded-[14px] flex items-center justify-center text-rose-400">
                <Vault className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-white text-base">Memory Vault & Hope Score</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Save positive pictures and certificates. During low periods, the AI retrieves these memories automatically to ground you.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-slate-900 border border-slate-800/80 rounded-[20px] hover:border-indigo-500/30 transition-all flex gap-4">
              <div className="h-10 w-10 shrink-0 bg-emerald-500/10 border border-emerald-500/20 rounded-[14px] flex items-center justify-center text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-white text-base">Safety First Crisis Mode</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Empathetic keywords trigger safety mechanisms instantly. Helplines, grounding exercises, and emergency contacts are just a click away.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 bg-slate-900 border-t border-slate-800">
        <div className="max-w-5xl mx-auto flex flex-col gap-12">
          <div className="text-center max-w-lg mx-auto flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight text-white">Choose Your Companion Experience</h2>
            <p className="text-slate-400 text-sm">
              Start for free, or unlock the most advanced emotional memory and live interaction features available.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
            {/* Free Tier */}
            <div className="flex flex-col p-8 bg-slate-900 border border-slate-800 rounded-3xl relative overflow-hidden group hover:border-indigo-500/30 transition-all shadow-xl">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white">Free Wellness Tier</h3>
                <p className="text-sm text-slate-400 mt-1">Perfect for daily mood tracking and journaling.</p>
              </div>
              
              <div className="mb-8">
                <span className="text-5xl font-extrabold text-white">$0</span>
                <span className="text-slate-400">/month</span>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Standard Text Chat
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Basic Voice Input
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" /> AI Studio Integration
                </li>
              </ul>

              <Link
                href="/register"
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-slate-800 text-white hover:bg-slate-700 transition-colors text-center border border-slate-700 hover:border-slate-600 shadow-md block"
              >
                Get Started
              </Link>
            </div>

            {/* Premium Tier */}
            <div className="flex flex-col p-8 bg-gradient-to-b from-indigo-900/40 to-slate-900 border border-indigo-500/30 rounded-3xl relative overflow-hidden group shadow-2xl shadow-indigo-900/20 hover:border-indigo-500/50 transition-all">
              <div className="absolute top-0 right-0 p-4">
                <span className="px-3 py-1 text-[10px] uppercase tracking-wider font-bold bg-indigo-500 text-white rounded-full flex items-center gap-1 shadow-lg shadow-indigo-500/30">
                  <Sparkles className="w-3 h-3" /> Recommended
                </span>
              </div>
              <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-indigo-500/20 rounded-full blur-[40px] pointer-events-none" />

              <div className="mb-6 relative z-10">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Premium Companion</h3>
                <p className="text-sm text-slate-400 mt-1">For ultra-low latency, deep emotional connections.</p>
              </div>
              
              <div className="mb-8 relative z-10">
                <span className="text-5xl font-extrabold text-white">$19</span>
                <span className="text-slate-400">/month</span>
              </div>

              <ul className="space-y-4 mb-8 flex-1 relative z-10">
                <li className="flex items-center gap-3 text-sm text-white font-medium">
                  <Video className="w-5 h-5 text-purple-400" /> Live Video Call Companion
                </li>
                <li className="flex items-center gap-3 text-sm text-white font-medium">
                  <Mic className="w-5 h-5 text-indigo-400" /> Live Speech-to-Speech
                </li>
                <li className="flex items-center gap-3 text-sm text-white font-medium">
                  <Brain className="w-5 h-5 text-rose-400" /> 100-Day Emotional Memory
                </li>
              </ul>

              <Link
                href="/register"
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 transition-all text-center shadow-lg shadow-indigo-500/25 block relative z-10 hover:scale-[1.02] active:scale-[0.98]"
              >
                Upgrade Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 max-w-5xl mx-auto flex flex-col gap-12">
        <h2 className="text-3xl font-bold tracking-tight text-center text-white">Loved by users</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-[20px] flex flex-col justify-between">
            <p className="text-slate-300 text-xs italic">
              &quot;Antipal helped me manage placement prep stress. The AI Coach felt less like a bot and more like an empathetic mentor.&quot;
            </p>
            <div className="mt-4">
              <h4 className="font-bold text-white text-xs">Aarav Sharma</h4>
              <p className="text-slate-500 text-[10px]">College Student</p>
            </div>
          </div>
          <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-[20px] flex flex-col justify-between">
            <p className="text-slate-300 text-xs italic">
              &quot;I love the Recovery Tree. Conventional streaks give me anxiety when I fail, but this tree just encourages me to pick back up.&quot;
            </p>
            <div className="mt-4">
              <h4 className="font-bold text-white text-xs">Priya Verma</h4>
              <p className="text-slate-500 text-[10px]">Software Engineer</p>
            </div>
          </div>
          <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-[20px] flex flex-col justify-between">
            <p className="text-slate-300 text-xs italic">
              &quot;The Memory Vault triggers right when I write about an anxious day. Seeing my graduation certificate instantly grounded me.&quot;
            </p>
            <div className="mt-4">
              <h4 className="font-bold text-white text-xs">Rohan Gupta</h4>
              <p className="text-slate-500 text-[10px]">Job Seeker</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950/60 px-6 py-8 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <Heart className="h-4 w-4 text-indigo-500" />
            <span>© {new Date().getFullYear()} Antipal. Empowering emotional resilience.</span>
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-300">Terms of Service</Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, Mail, Check, X, ShieldAlert } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { signIn } from "next-auth/react"

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Password rules validation states
  const [checks, setChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  })

  useEffect(() => {
    setChecks({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    })
  }, [password])

  const isPasswordValid = Object.values(checks).every(Boolean)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.")
      return
    }

    if (!isPasswordValid) {
      setError("Password does not meet the security requirements.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false
      })

      if (res?.error) {
        setError("Error logging in after registration.")
        setLoading(false)
      } else {
        router.push("/onboarding")
      }
    } catch (err) {
      setError("An unexpected error occurred.")
      setLoading(false)
    }
  }

  // Calculate percentage of checks met
  const checksMetCount = Object.values(checks).filter(Boolean).length
  const strengthPercentage = (checksMetCount / 5) * 100
  const strengthColor =
    checksMetCount <= 2
      ? "bg-rose-500"
      : checksMetCount <= 4
      ? "bg-amber-500"
      : "bg-emerald-500"

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background px-4 py-12 transition-colors duration-300">
      {/* Floating Theme Toggle (Top Right) */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      {/* Glow shapes */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-violet-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-md bg-card text-card-foreground border border-border/85 rounded-[20px] p-8 shadow-xl">
        
        {/* Header/Logo */}
        <div className="flex flex-col items-center text-center gap-2 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-primary text-primary-foreground font-bold text-xl shadow-lg shadow-indigo-500/20">
            A
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-3">Create your account</h1>
          <p className="text-sm text-muted-foreground">Start your emotional wellness journey today.</p>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-[14px] bg-rose-500/10 border border-rose-500/25 text-rose-500 text-xs font-semibold animate-fade-slide-in flex items-center gap-2">
            <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground/80" htmlFor="email">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 h-4.5 w-4.5 text-muted-foreground" />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10.5 pl-11 pr-4 rounded-[14px] border border-border bg-muted/30 text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-all"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground/80" htmlFor="password">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 h-4.5 w-4.5 text-muted-foreground" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Choose a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10.5 pl-11 pr-11 rounded-[14px] border border-border bg-muted/30 text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 h-7 w-7 flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>

            {/* Strength Bar */}
            {password.length > 0 && (
              <div className="mt-2 flex flex-col gap-2 bg-muted/30 border border-border/40 p-3 rounded-[14px]">
                <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground">
                  <span>Password Security</span>
                  <span>{Math.round(strengthPercentage)}%</span>
                </div>
                <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                  <div className={`h-1.5 rounded-full transition-all duration-300 ${strengthColor}`} style={{ width: `${strengthPercentage}%` }} />
                </div>
                {/* Requirements list */}
                <div className="grid grid-cols-2 gap-1.5 mt-1 text-[10px]">
                  <div className={`flex items-center gap-1 ${checks.length ? "text-emerald-500" : "text-muted-foreground"}`}>
                    {checks.length ? <Check className="h-3 w-3" /> : <span className="h-1 w-1 bg-muted-foreground rounded-full mx-1" />}
                    Min 8 characters
                  </div>
                  <div className={`flex items-center gap-1 ${checks.uppercase ? "text-emerald-500" : "text-muted-foreground"}`}>
                    {checks.uppercase ? <Check className="h-3 w-3" /> : <span className="h-1 w-1 bg-muted-foreground rounded-full mx-1" />}
                    Uppercase letter
                  </div>
                  <div className={`flex items-center gap-1 ${checks.lowercase ? "text-emerald-500" : "text-muted-foreground"}`}>
                    {checks.lowercase ? <Check className="h-3 w-3" /> : <span className="h-1 w-1 bg-muted-foreground rounded-full mx-1" />}
                    Lowercase letter
                  </div>
                  <div className={`flex items-center gap-1 ${checks.number ? "text-emerald-500" : "text-muted-foreground"}`}>
                    {checks.number ? <Check className="h-3 w-3" /> : <span className="h-1 w-1 bg-muted-foreground rounded-full mx-1" />}
                    Number (0-9)
                  </div>
                  <div className={`flex items-center gap-1 ${checks.special ? "text-emerald-500" : "text-muted-foreground"}`}>
                    {checks.special ? <Check className="h-3 w-3" /> : <span className="h-1 w-1 bg-muted-foreground rounded-full mx-1" />}
                    Special char (@,#,$,etc)
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground/80" htmlFor="confirm-password">
              Confirm Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 h-4.5 w-4.5 text-muted-foreground" />
              <input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-10.5 pl-11 pr-4 rounded-[14px] border border-border bg-muted/30 text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-all"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 mt-2 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-sm rounded-[14px] transition-all cursor-pointer flex items-center justify-center shadow-lg shadow-indigo-500/10 active:scale-99 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-5 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/80" />
          </div>
          <span className="relative z-10 px-3 bg-card text-[11px] font-bold text-muted-foreground uppercase">
            Or sign up with
          </span>
        </div>

        {/* Google OAuth Option */}
        <button
          onClick={async () => {
            setLoading(true)
            try {
              await signIn("google", { callbackUrl: "/onboarding" })
            } catch (err) {
              setError("An error occurred starting Google Sign-in.")
              setLoading(false)
            }
          }}
          className="w-full h-11 border border-border bg-card text-foreground hover:bg-muted font-semibold text-sm rounded-[14px] transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-99 hover:shadow-sm"
        >
          <svg className="h-4.5 w-4.5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.57 15.02 0 12 0 7.37 0 3.4 2.67 1.48 6.56l3.85 2.99C6.27 6.57 8.91 5.04 12 5.04z"
            />
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.44c-.28 1.47-1.11 2.71-2.36 3.55l3.65 2.83c2.13-1.97 3.36-4.87 3.36-8.53z"
            />
            <path
              fill="#FBBC05"
              d="M5.33 14.53c-.23-.69-.36-1.42-.36-2.18s.13-1.49.36-2.18L1.48 7.18C.54 9.09 0 11.24 0 13.5s.54 4.41 1.48 6.32l3.85-2.99c-.23-.69-.36-1.42-.36-2.18z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.97-1.07 7.96-2.91l-3.65-2.83c-1.01.68-2.3 1.09-4.31 1.09-3.09 0-5.73-2.03-6.67-4.79l-3.85 2.99C3.4 21.33 7.37 24 12 24z"
            />
          </svg>
          Google
        </button>

        {/* Redirect Link */}
        <p className="text-xs text-center text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}

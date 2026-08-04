"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Globe,
  User,
  PhoneCall,
  Activity,
  Bell,
  Heart,
  TreeDeciduous,
  Check,
  ShieldCheck
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

// Onboarding Steps Enum
enum Step {
  Welcome = 1,
  Language = 2,
  BasicDetails = 3,
  EmergencyContact = 4,
  StressQuiz = 5,
  Reminders = 6,
  MemoryVaultIntro = 7,
  Summary = 8
}

// Stress quiz questions
const stressQuestions = [
  "In the last month, how often have you been upset because of something that happened unexpectedly?",
  "In the last month, how often have you felt that you were unable to control the important things in your life?",
  "In the last month, how often have you felt nervous and \"stressed\"?",
  "In the last month, how often have you felt confident about your ability to handle your personal problems?", // Reverse scored
  "In the last month, how often have you felt that things were going your way?", // Reverse scored
  "In the last month, how often have you found that you could not cope with all the things that you had to do?",
  "In the last month, how often have you been able to control irritations in your life?", // Reverse scored
  "In the last month, how often have you felt that you were on top of things?", // Reverse scored
  "In the last month, how often have you been angered because of things that were outside of your control?",
  "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?",
  "How often do you experience trouble falling or staying asleep due to racing thoughts?",
  "How often do you find it difficult to concentrate on academic or professional tasks because of worry?",
  "How often do you feel physically exhausted even without doing heavy physical labor?",
  "How often do you experience headaches, muscle tension, or stomach discomfort related to stress?",
  "How often do you feel irritable or short-tempered with friends, family, or colleagues?",
  "How often do you feel anxious about upcoming deadlines, exams, or placements?",
  "How often do you avoid social interactions or withdraw from others when feeling low?",
  "How often do you find it hard to relax or \"switch off\" your mind at the end of the day?",
  "How often do you experience negative self-talk or self-doubt during challenging tasks?",
  "How often do you feel hopeful about your future and ability to achieve your goals?" // Reverse scored
]

const optionValues = [
  { label: "Never", val: 0 },
  { label: "Almost Never", val: 1 },
  { label: "Sometimes", val: 2 },
  { label: "Fairly Often", val: 3 },
  { label: "Very Often", val: 4 }
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>(Step.Welcome)

  // Step 2: Language state
  const [language, setLanguage] = useState<"en" | "hi" | "hinglish">("en")

  // Step 3: Basic Details state
  const [fullName, setFullName] = useState("")
  const [age, setAge] = useState<number | "">("")
  const [gender, setGender] = useState("")
  const [occupation, setOccupation] = useState("")
  const [timezone, setTimezone] = useState("UTC")

  // Step 4: Emergency Contact state
  const [emergencyName, setEmergencyName] = useState("")
  const [emergencyRelation, setEmergencyRelation] = useState("")
  const [emergencyPhone, setEmergencyPhone] = useState("")
  const [emergencyEmail, setEmergencyEmail] = useState("")
  const [consentCheck, setConsentCheck] = useState(false)

  // Step 5: Stress Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({})
  const [quizProgress, setQuizProgress] = useState(0) // Index of active question (0-19)

  // Step 6: Reminders state
  const [reminderTime, setReminderTime] = useState("20:00")

  // Onboarding metadata
  const [validationError, setValidationError] = useState<string | null>(null)
  const [onboardingScore, setOnboardingScore] = useState(0)
  const [stressLevel, setStressLevel] = useState("Moderate")

  // Auto-detect timezone on mount
  useEffect(() => {
    try {
      const resolvedTz = Intl.DateTimeFormat().resolvedOptions().timeZone
      if (resolvedTz) setTimezone(resolvedTz)
    } catch (e) {
      console.warn("Unable to resolve local timezone.")
    }
  }, [])

  // Calculate stress level based on scores
  const handleCalculateScore = () => {
    let totalScore = 0
    // Questions 3, 4, 6, 7, 19 (indices 3, 4, 6, 7, 19) are reverse scored
    const reverseIndices = [3, 4, 6, 7, 19]

    for (let i = 0; i < 20; i++) {
      const answer = quizAnswers[i] ?? 2 // fallback to neutral if not answered
      if (reverseIndices.includes(i)) {
        totalScore += 4 - answer
      } else {
        totalScore += answer
      }
    }

    setOnboardingScore(totalScore)

    // Range: 0 to 80
    if (totalScore <= 20) {
      setStressLevel("Low")
    } else if (totalScore <= 45) {
      setStressLevel("Moderate")
    } else {
      setStressLevel("High")
    }
  }

  // Handle Step progression validations
  const handleNext = () => {
    setValidationError(null)

    if (currentStep === Step.Welcome) {
      setCurrentStep(Step.Language)
    } else if (currentStep === Step.Language) {
      setCurrentStep(Step.BasicDetails)
    } else if (currentStep === Step.BasicDetails) {
      if (!fullName.trim()) {
        setValidationError("Please enter your full name.")
        return
      }
      if (!age || age < 5 || age > 120) {
        setValidationError("Please enter a valid age.")
        return
      }
      if (!gender) {
        setValidationError("Please select your gender.")
        return
      }
      if (!occupation) {
        setValidationError("Please select or enter your occupation.")
        return
      }
      setCurrentStep(Step.EmergencyContact)
    } else if (currentStep === Step.EmergencyContact) {
      if (!emergencyName.trim()) {
        setValidationError("Please enter emergency contact name.")
        return
      }
      if (!emergencyRelation.trim()) {
        setValidationError("Please enter your relationship to the contact.")
        return
      }
      if (!emergencyPhone.trim() || emergencyPhone.length < 8) {
        setValidationError("Please enter a valid emergency phone number.")
        return
      }
      if (!consentCheck) {
        setValidationError("You must authorize Antipal to alert your emergency contact in critical situations.")
        return
      }
      setCurrentStep(Step.StressQuiz)
    } else if (currentStep === Step.StressQuiz) {
      if (Object.keys(quizAnswers).length < 20) {
        setValidationError("Please complete all 20 stress assessment questions.")
        return
      }
      handleCalculateScore()
      setCurrentStep(Step.Reminders)
    } else if (currentStep === Step.Reminders) {
      setCurrentStep(Step.MemoryVaultIntro)
    } else if (currentStep === Step.MemoryVaultIntro) {
      setCurrentStep(Step.Summary)
    } else if (currentStep === Step.Summary) {
      // Completed, route to dashboard
      router.push("/dashboard")
    }
  }

  const handleBack = () => {
    setValidationError(null)
    if (currentStep > Step.Welcome) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8 transition-colors duration-300">
      {/* Floating Theme Toggle (Top Right) */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Abstract Background glows */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-indigo-500/5 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[110px] pointer-events-none" />

      {/* Main Wizard Card Container */}
      <div className="relative z-10 w-full max-w-2xl bg-card text-card-foreground border border-border/85 rounded-[20px] p-8 shadow-xl transition-all duration-300">
        
        {/* Step Indicator Headers */}
        {currentStep > Step.Welcome && currentStep < Step.Summary && (
          <div className="flex items-center gap-2 mb-6 text-xs text-muted-foreground font-semibold">
            <span>Onboarding Progress</span>
            <div className="flex-1 bg-border rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep - 1) / 6) * 100}%` }}
              />
            </div>
            <span>Step {currentStep - 1} of 6</span>
          </div>
        )}

        {validationError && (
          <div className="mb-4 p-3.5 rounded-[14px] bg-rose-500/10 border border-rose-500/25 text-rose-500 text-xs font-semibold animate-fade-slide-in">
            {validationError}
          </div>
        )}

        {/* ================= STEP 1: WELCOME SCREEN ================= */}
        {currentStep === Step.Welcome && (
          <div className="flex flex-col items-center text-center gap-6 py-6 animate-fade-slide-in">
            <div className="flex h-16 w-16 items-center justify-center rounded-[14px] bg-primary text-primary-foreground font-bold text-3xl shadow-xl shadow-indigo-500/20">
              A
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-extrabold tracking-tight">Welcome to Antipal</h1>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                "How can we make tomorrow better than today?"
              </p>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Antipal is your personal, emotionally aware wellness companion. Let's customize your experience so we can support you best.
            </p>
            <div className="flex items-center gap-2.5 bg-indigo-500/5 border border-indigo-500/10 px-4 py-3.5 rounded-[14px] max-w-md">
              <Sparkles className="h-5 w-5 text-indigo-400 shrink-0" />
              <p className="text-xs text-indigo-300 leading-snug text-left">
                <strong>Safety Disclaimer:</strong> Antipal is an AI wellness assistant and does not replace licensed therapists or emergency clinical services.
              </p>
            </div>
          </div>
        )}

        {/* ================= STEP 2: LANGUAGE SELECTION ================= */}
        {currentStep === Step.Language && (
          <div className="flex flex-col gap-6 py-4 animate-fade-slide-in">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-1 flex items-center gap-2">
                <Globe className="h-5.5 w-5.5 text-indigo-400" />
                Select Preferred Language
              </h2>
              <p className="text-xs text-muted-foreground">This applies to all chat dialogue, emails, and generated reports.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { code: "en", name: "English", desc: "Standard global formatting" },
                { code: "hi", name: "Hindi (हिंदी)", desc: "मूल भाषा संस्करण" },
                { code: "hinglish", name: "Hinglish", desc: "Hindi in Roman script" }
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as any)}
                  className={`p-5 rounded-[20px] text-left border transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                    language === lang.code
                      ? "bg-primary/15 border-primary shadow-md shadow-indigo-500/5"
                      : "bg-muted/20 border-border/80 hover:bg-muted/40"
                  }`}
                >
                  <span className="block font-bold text-base mb-1">{lang.name}</span>
                  <span className="block text-[11px] text-muted-foreground leading-normal">{lang.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ================= STEP 3: BASIC DETAILS ================= */}
        {currentStep === Step.BasicDetails && (
          <div className="flex flex-col gap-6 py-4 animate-fade-slide-in">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-1 flex items-center gap-2">
                <User className="h-5.5 w-5.5 text-indigo-400" />
                Tell us about yourself
              </h2>
              <p className="text-xs text-muted-foreground">This information helps the AI context engine tailor conversations.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Aarav Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-11 px-4 rounded-[14px] border border-border bg-muted/30 text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80">Age</label>
                <input
                  type="number"
                  placeholder="e.g. 20"
                  value={age}
                  onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full h-11 px-4 rounded-[14px] border border-border bg-muted/30 text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80">Gender Identity</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full h-11 px-4 rounded-[14px] border border-border bg-muted/30 text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-all cursor-pointer"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80">Occupation</label>
                <select
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full h-11 px-4 rounded-[14px] border border-border bg-muted/30 text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-all cursor-pointer"
                >
                  <option value="">Select occupation</option>
                  <option value="Student">Student (College/School)</option>
                  <option value="Working Professional">Working Professional</option>
                  <option value="Job Seeker">Job Seeker</option>
                  <option value="Homemaker">Homemaker</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-foreground/80">Timezone (Auto-detected)</label>
                <input
                  type="text"
                  value={timezone}
                  disabled
                  className="w-full h-11 px-4 rounded-[14px] border border-border bg-muted/20 text-sm text-muted-foreground"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 4: EMERGENCY CONTACT ================= */}
        {currentStep === Step.EmergencyContact && (
          <div className="flex flex-col gap-6 py-4 animate-fade-slide-in">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-1 flex items-center gap-2">
                <PhoneCall className="h-5.5 w-5.5 text-indigo-400" />
                Emergency Safety Settings
              </h2>
              <p className="text-xs text-muted-foreground">Setup an optional but highly encouraged emergency contact (Section 21).</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80">Contact Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Papa / Spouse"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  className="w-full h-11 px-4 rounded-[14px] border border-border bg-muted/30 text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80">Relationship</label>
                <input
                  type="text"
                  placeholder="e.g. Father, Mother, Partner"
                  value={emergencyRelation}
                  onChange={(e) => setEmergencyRelation(e.target.value)}
                  className="w-full h-11 px-4 rounded-[14px] border border-border bg-muted/30 text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full h-11 px-4 rounded-[14px] border border-border bg-muted/30 text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80">Email (Optional)</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={emergencyEmail}
                  onChange={(e) => setEmergencyEmail(e.target.value)}
                  className="w-full h-11 px-4 rounded-[14px] border border-border bg-muted/30 text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-all"
                />
              </div>

              <div className="sm:col-span-2 flex items-start gap-3.5 bg-rose-500/5 border border-rose-500/10 p-4 rounded-[14px] mt-2">
                <input
                  id="consent"
                  type="checkbox"
                  checked={consentCheck}
                  onChange={(e) => setConsentCheck(e.target.checked)}
                  className="h-5 w-5 mt-0.5 rounded border-border text-rose-500 focus:ring-rose-400 cursor-pointer"
                />
                <label htmlFor="consent" className="text-xs text-rose-300 leading-snug cursor-pointer select-none">
                  <strong>Consent Authorization:</strong> I authorize Antipal to automatically trigger emergency alerts and dispatch notification details to this contact in the event the AI engine detects a severe emotional crisis or self-harm risk.
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 5: STRESS ASSESSMENT (20 QUESTIONS) ================= */}
        {currentStep === Step.StressQuiz && (
          <div className="flex flex-col gap-6 py-4 animate-fade-slide-in">
            <div className="flex items-center justify-between gap-4 border-b border-border/40 pb-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                  <Activity className="h-5.5 w-5.5 text-indigo-400 animate-pulse" />
                  Stress Assessment
                </h2>
                <p className="text-xs text-muted-foreground">Answering honestly helps Antipal build your initial Hope Score.</p>
              </div>
              <span className="text-xs font-bold bg-muted border border-border/80 px-2.5 py-1.5 rounded-[10px]">
                Q {quizProgress + 1} / 20
              </span>
            </div>

            {/* Assessment Progress line */}
            <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((quizProgress + 1) / 20) * 100}%` }}
              />
            </div>

            {/* Active Question Box */}
            <div className="bg-muted/40 border border-border/50 p-6 rounded-[20px] min-h-[90px] flex items-center justify-center text-center">
              <p className="text-base sm:text-lg font-bold leading-normal text-foreground">
                "{stressQuestions[quizProgress]}"
              </p>
            </div>

            {/* Answer Options Selector */}
            <div className="flex flex-col gap-2.5 mt-2">
              {optionValues.map((opt) => {
                const isActive = quizAnswers[quizProgress] === opt.val
                return (
                  <button
                    key={opt.label}
                    onClick={() => {
                      setQuizAnswers({ ...quizAnswers, [quizProgress]: opt.val })
                      // Auto progress to next question after selecting, with a tiny delay
                      setTimeout(() => {
                        if (quizProgress < 19) {
                          setQuizProgress(quizProgress + 1)
                        }
                      }, 200)
                    }}
                    className={`w-full py-3 px-5 rounded-[14px] border text-left text-sm font-semibold transition-all cursor-pointer flex justify-between items-center ${
                      isActive
                        ? "bg-primary/20 border-primary text-primary-foreground font-bold"
                        : "bg-muted/10 border-border/70 hover:bg-muted/30"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isActive && <Check className="h-4.5 w-4.5 text-primary" />}
                  </button>
                )
              })}
            </div>

            {/* Quiz Navigation */}
            <div className="flex justify-between items-center mt-4 border-t border-border/40 pt-4">
              <button
                disabled={quizProgress === 0}
                onClick={() => setQuizProgress(quizProgress - 1)}
                className="flex items-center gap-2 py-2 px-4 rounded-[14px] border border-border hover:bg-muted text-xs font-bold disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" /> Previous Question
              </button>
              <button
                disabled={quizProgress === 19 || quizAnswers[quizProgress] === undefined}
                onClick={() => setQuizProgress(quizProgress + 1)}
                className="flex items-center gap-2 py-2 px-4 rounded-[14px] border border-border hover:bg-muted text-xs font-bold disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                Next Question <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 6: NOTIFICATIONS & REMINDERS ================= */}
        {currentStep === Step.Reminders && (
          <div className="flex flex-col gap-6 py-4 animate-fade-slide-in">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-1 flex items-center gap-2">
                <Bell className="h-5.5 w-5.5 text-indigo-400" />
                Notification Preferences
              </h2>
              <p className="text-xs text-muted-foreground">Select a reminder time for daily mood logs and wellness summaries.</p>
            </div>

            <div className="bg-muted/30 border border-border/40 p-6 rounded-[20px] max-w-md mx-auto flex flex-col items-center gap-4">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Daily Check-in Time
              </label>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="text-4xl font-extrabold tracking-tight bg-card text-foreground border border-border/80 px-5 py-3 rounded-[14px] text-center focus:outline-none focus:ring-2 focus:ring-primary w-48 select-none"
              />
              <p className="text-[11px] text-muted-foreground text-center leading-normal mt-2">
                Antipal will send a gentle push notification or email daily at this time to check on your wellness progress.
              </p>
            </div>
          </div>
        )}

        {/* ================= STEP 7: MEMORY VAULT INTRO ================= */}
        {currentStep === Step.MemoryVaultIntro && (
          <div className="flex flex-col gap-6 py-4 animate-fade-slide-in">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-1 flex items-center gap-2">
                <Heart className="h-5.5 w-5.5 text-rose-400" />
                Introducing Memory Vault
              </h2>
              <p className="text-xs text-muted-foreground">The wellness companion that remembers your happiest moments.</p>
            </div>

            <div className="flex flex-col gap-4 text-sm leading-relaxed text-slate-300">
              <p>
                Most tracking apps only ask you how you feel when you are down. **Antipal preserves your best moments.**
              </p>
              <p>
                In your dashboard, you'll be able to save photos, gratitude diaries, hackathon certificates, or letters. We call this your **Happiness Bank**.
              </p>
              <div className="bg-primary/5 border border-primary/10 rounded-[14px] p-4 flex gap-3.5 items-start mt-2">
                <Sparkles className="h-6 w-6 text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-xs text-indigo-200/90 leading-relaxed">
                  <strong>AI Integration:</strong> If you write an anxious journal entry, the AI Wellness engine will dynamically retrieve a beautiful memory from your Vault to ground you and remind you of your capabilities.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 8: RESULT SUMMARY SCREEN ================= */}
        {currentStep === Step.Summary && (
          <div className="flex flex-col items-center text-center gap-6 py-6 animate-fade-slide-in">
            <div className="flex h-16 w-16 items-center justify-center rounded-[14px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-3xl shadow-md">
              <ShieldCheck className="h-8 w-8" />
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-white">Your Profile is Ready!</h1>
              <p className="text-sm text-muted-foreground">Setup finalized successfully.</p>
            </div>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md my-2">
              <div className="bg-muted/40 border border-border/50 rounded-[20px] p-4">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Calculated Stress Score</span>
                <p className="text-3xl font-extrabold text-foreground mt-1">{onboardingScore}</p>
                <span className="text-xs text-muted-foreground">Range (0 - 80)</span>
              </div>
              <div className="bg-muted/40 border border-border/50 rounded-[20px] p-4">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Initial Stress Level</span>
                <p className="text-3xl font-extrabold text-indigo-400 mt-1">{stressLevel}</p>
                <span className="text-xs text-muted-foreground">Custom wellness plan created</span>
              </div>
            </div>

            <div className="bg-muted/30 border border-border/40 p-4 rounded-[20px] flex items-center gap-3.5 text-left max-w-md">
              <div className="h-10 w-10 shrink-0 rounded-[10px] bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <TreeDeciduous className="h-6 w-6 animate-pulse" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-foreground">Recovery Tree Initialized</h4>
                <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
                  Your growth tree starts as a Seed. Keep up daily log goals to collect leaves and watch it sprout!
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-normal max-w-sm mt-2">
              Redirecting you to your wellness dashboard... Click continue to enter immediately.
            </p>
          </div>
        )}

        {/* ================= BUTTONS NAVIGATION ================= */}
        <div className="flex items-center justify-between gap-4 mt-8 border-t border-border/50 pt-6">
          {/* Back button */}
          {currentStep > Step.Welcome ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 py-2.5 px-5 rounded-[14px] border border-border hover:bg-muted text-sm font-bold cursor-pointer transition-all"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {/* Forward / CTA button */}
          <button
            onClick={handleNext}
            className="flex items-center gap-2 py-2.5 px-6 rounded-[14px] bg-primary text-primary-foreground hover:bg-primary/95 text-sm font-bold cursor-pointer transition-all shadow-md shadow-indigo-500/10 hover:scale-[1.02] active:scale-[0.98]"
          >
            {currentStep === Step.Summary ? (
              <>
                Go to Dashboard <Check className="h-4.5 w-4.5" />
              </>
            ) : (
              <>
                Continue <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  )
}

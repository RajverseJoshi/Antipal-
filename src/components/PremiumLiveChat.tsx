"use client"

import React, { useState, useEffect, useRef } from "react"
import { Video, Mic, StopCircle, Settings, PhoneOff, PhoneCall, BrainCircuit, MessageSquare } from "lucide-react"
import { ChatBox } from "@/components/ChatBox"

const pcmWorkletCode = `
class PCMProcessor extends AudioWorkletProcessor {
  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (!input || input.length === 0) return true;
    
    const channelData = input[0];
    const pcm16 = new Int16Array(channelData.length);
    let sum = 0;
    
    for (let i = 0; i < channelData.length; i++) {
      let s = Math.max(-1, Math.min(1, channelData[i]));
      pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      sum += Math.abs(channelData[i]);
    }
    
    // Post the PCM data back to the main thread
    this.port.postMessage({ pcm: pcm16.buffer, volumeSum: sum, length: channelData.length }, [pcm16.buffer]);
    return true;
  }
}
registerProcessor("pcm-processor", PCMProcessor);
`

export function PremiumLiveChat() {
  const [isConnected, setIsConnected] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(false)
  const [statusText, setStatusText] = useState("Disconnected")
  const [memoryInsights, setMemoryInsights] = useState<string[]>([])
  const [volumeLevel, setVolumeLevel] = useState(10)
  const [mode, setMode] = useState<'text' | 'voice' | 'video'>('voice')
  
  const wsRef = useRef<WebSocket | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const workletNodeRef = useRef<AudioWorkletNode | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const isSetupCompleteRef = useRef(false)

  useEffect(() => {
    if (isConnected && isVideoOn) {
      videoIntervalRef.current = setInterval(() => {
        captureAndSendVideoFrame()
      }, 1000)
    } else {
      if (videoIntervalRef.current) clearInterval(videoIntervalRef.current)
    }
    
    // Toggle video track enabled state
    if (mediaStreamRef.current) {
      const videoTrack = mediaStreamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = isVideoOn
      }
    }

    return () => {
      if (videoIntervalRef.current) clearInterval(videoIntervalRef.current)
    }
  }, [isConnected, isVideoOn])

  const captureAndSendVideoFrame = () => {
    if (!videoRef.current || !canvasRef.current || wsRef.current?.readyState !== WebSocket.OPEN || !isSetupCompleteRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    
    if (video.videoWidth === 0 || video.videoHeight === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    
    const dataUrl = canvas.toDataURL('image/jpeg', 0.5)
    const base64Image = dataUrl.split(',')[1]

    wsRef.current.send(JSON.stringify({
      realtimeInput: {
        video: {
          mimeType: "image/jpeg",
          data: base64Image
        }
      }
    }))
  }

  const handleConnect = async () => {
    setStatusText("Initializing Camera & Microphone...")
    isSetupCompleteRef.current = false
    
    // Crucial: AudioContext must be created immediately on user click to prevent being 'suspended'
    const mediaStarted = await startMediaCapture()
    if (!mediaStarted) return // User denied permissions or hardware failed
    
    setStatusText("Authenticating securely...")
    try {
      // 1. Fetch Auth Token
      const res = await fetch("/api/auth/live-token")
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || "Failed to fetch live token")

      // 2. Fetch 100-Day Emotional Memories (RAG)
      setStatusText("Retrieving emotional memories...")
      let memoryContext = ""
      try {
        const memRes = await fetch("/api/chat/memory")
        if (memRes.ok) {
          const memData = await memRes.json()
          if (memData.memories && memData.memories.length > 0) {
            memoryContext = "Important Context about the User's past emotional state:\n" + 
              memData.memories.map((m: string) => `- ${m}`).join("\n")
            setMemoryInsights(["Loaded recent emotional context.", ...memData.memories])
          }
        }
      } catch (e) {
        console.warn("Failed to fetch memories", e)
      }

      setStatusText("Connecting to Live Companion...")
      
      // Determine the WebSocket URL based on whether we have an API key (fallback) or OAuth token
      let wsUrl = ""
      if (data.isFallback && data.apiKey) {
        // AI Studio Endpoint
        wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${data.apiKey}`
      } else {
        // Vertex AI Endpoint (mocking region us-central1 for now)
        // Note: standard browser WebSockets do not support custom headers, so we pass token in URL or setup message depending on GCP's exact spec
        wsUrl = `wss://us-central1-aiplatform.googleapis.com/ws/google.cloud.aiplatform.v1beta1.LlmUtilityService.BidiGenerateContent?access_token=${data.token}`
      }

      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = () => {
        setIsConnected(true)
        setStatusText("Connected & Listening...")
        setMemoryInsights(prev => ["Live connection established with enhanced emotional memory.", ...prev])
        
        // Send initial setup message configuring 16kHz PCM audio and injecting memories
        ws.send(JSON.stringify({
          setup: {
            model: data.isFallback ? "models/gemini-2.0-flash-exp" : `projects/${data.projectId || "your-project"}/locations/us-central1/publishers/google/models/gemini-2.0-flash-exp`,
            systemInstruction: {
              parts: [{
                text: `You are Antipal, an empathetic, highly supportive mental wellness AI companion. Keep your spoken responses concise and natural. ${memoryContext}`
              }]
            },
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } }
              }
            }
          }
        }))

        // We wait for the setupComplete message before capturing media
      }

      ws.onmessage = async (event) => {
        try {
          // If the payload is blob, we need to read it as text
          let textData = event.data
          if (event.data instanceof Blob) {
            textData = await event.data.text()
          }
          const response = JSON.parse(textData)
          
          if (response.setupComplete) {
            console.log("Setup complete received from Gemini. Media will now stream.")
            isSetupCompleteRef.current = true
          }
          
          if (response.serverContent?.modelTurn?.parts) {
            const parts = response.serverContent.modelTurn.parts
            for (const part of parts) {
              if (part.inlineData && part.inlineData.mimeType.startsWith("audio/pcm")) {
                // We received audio from the model, decode base64 and play it
                playAudioChunk(part.inlineData.data)
              }
            }
          }
        } catch (e) {
          console.error("Error parsing WS message:", e)
        }
      }

      ws.onclose = (event) => {
        console.error(`WS Closed: code=${event.code} reason=${event.reason}`)
        setIsConnected(false)
        setStatusText("Disconnected")
        stopMediaCapture()
      }

      ws.onerror = (e) => {
        console.error("WS Error:", e)
        setStatusText("Connection Error")
      }
      
    } catch (error: any) {
      console.error(error)
      setStatusText("Failed to connect")
    }
  }

  const handleDisconnect = () => {
    if (wsRef.current) {
      wsRef.current.close()
    }
    stopMediaCapture()
    setIsConnected(false)
    setStatusText("Disconnected")
  }

  const startMediaCapture = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true
        },
        video: true // Request video regardless so the stream has the track available to toggle
      })
      mediaStreamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 })
      audioCtxRef.current = audioCtx
      
      // Ensure context is not suspended
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume()
      }

      const source = audioCtx.createMediaStreamSource(stream)
      
      // Load inline AudioWorklet
      const blob = new Blob([pcmWorkletCode], { type: "application/javascript" })
      const workletUrl = URL.createObjectURL(blob)
      await audioCtx.audioWorklet.addModule(workletUrl)
      
      const workletNode = new AudioWorkletNode(audioCtx, "pcm-processor")
      workletNodeRef.current = workletNode

      workletNode.port.onmessage = (e) => {
        if (!isConnected || isMuted || !isSetupCompleteRef.current) return
        
        const { pcm, volumeSum, length } = e.data
        const pcm16 = new Int16Array(pcm)
        
        // Visualize volume level roughly
        setVolumeLevel(Math.min(100, Math.floor((volumeSum / length) * 1000)))

        // Convert Int16Array to Base64
        const uint8 = new Uint8Array(pcm16.buffer)
        let binary = ""
        for (let i = 0; i < uint8.length; i++) {
          binary += String.fromCharCode(uint8[i])
        }
        const base64Audio = btoa(binary)

        // Send to Gemini
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            realtimeInput: {
              audio: {
                mimeType: "audio/pcm;rate=16000",
                data: base64Audio
              }
            }
          }))
        }
      }

      source.connect(workletNode)
      workletNode.connect(audioCtx.destination)
      return true
    } catch (e) {
      console.error("Microphone access denied or error:", e)
      setStatusText("Hardware Error")
      window.alert("Camera or microphone access was denied. Please allow permissions in your browser and try again.")
      return false
    }
  }

  const stopMediaCapture = () => {
    if (workletNodeRef.current) {
      workletNodeRef.current.disconnect()
      workletNodeRef.current = null
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop())
      mediaStreamRef.current = null
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close()
      audioCtxRef.current = null
    }
    setVolumeLevel(10)
  }

  // Play incoming PCM audio from model
  const playAudioChunk = async (base64String: string) => {
    if (!audioCtxRef.current) return
    try {
      const binary = atob(base64String)
      const buffer = new ArrayBuffer(binary.length)
      const view = new DataView(buffer)
      
      for (let i = 0; i < binary.length; i++) {
        view.setUint8(i, binary.charCodeAt(i))
      }
      
      // Gemini returns 16kHz, 16-bit, Mono PCM (little-endian)
      const audioBuffer = audioCtxRef.current.createBuffer(1, buffer.byteLength / 2, 16000)
      const channelData = audioBuffer.getChannelData(0)
      
      for (let i = 0; i < buffer.byteLength / 2; i++) {
        const int16 = view.getInt16(i * 2, true) 
        channelData[i] = int16 / 32768.0
      }

      const source = audioCtxRef.current.createBufferSource()
      source.buffer = audioBuffer
      source.connect(audioCtxRef.current.destination)
      source.start()
    } catch (e) {
      console.error("Error playing audio chunk:", e)
    }
  }

  return (
    <div className="w-full max-w-5xl h-[85vh] bg-zinc-950 rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col relative">
      
      {/* Top Bar with Multimodal Toggle */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 absolute top-0 w-full z-20 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-zinc-600"}`} />
          <span className="text-white/90 text-sm font-medium tracking-wide">
            {statusText}
          </span>
        </div>

        {/* Mode Selector */}
        {!isConnected && (
          <div className="flex items-center bg-white/5 p-1 rounded-full border border-white/10">
            <button 
              onClick={() => setMode('text')} 
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${mode === 'text' ? "bg-indigo-500 text-white" : "text-white/50 hover:text-white"}`}
            >
              <MessageSquare className="w-3.5 h-3.5" /> Text
            </button>
            <button 
              onClick={() => { setMode('voice'); setIsVideoOn(false) }} 
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${mode === 'voice' ? "bg-indigo-500 text-white" : "text-white/50 hover:text-white"}`}
            >
              <Mic className="w-3.5 h-3.5" /> Voice
            </button>
            <button 
              onClick={() => { setMode('video'); setIsVideoOn(true) }} 
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${mode === 'video' ? "bg-indigo-500 text-white" : "text-white/50 hover:text-white"}`}
            >
              <Video className="w-3.5 h-3.5" /> Video
            </button>
          </div>
        )}

        <div className="flex items-center gap-4 text-white/70">
          <Settings className="w-5 h-5 hover:text-white transition-colors cursor-pointer" />
        </div>
      </div>

      {mode === 'text' ? (
        <div className="flex-1 w-full h-full pt-16 flex justify-center pb-6">
          <ChatBox />
        </div>
      ) : (
        <>
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col lg:flex-row p-6 pt-20 gap-6">
        
        {/* Companion Camera Placeholder */}
        <div className="flex-1 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-900/40 to-purple-900/20 border border-white/5 relative flex items-center justify-center group">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30 mix-blend-luminosity" />
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center border shadow-2xl transition-all duration-500 ${isConnected ? "bg-indigo-500/20 border-indigo-500/50" : "bg-white/10 backdrop-blur-md border-white/20"}`}>
              <Video className={`w-10 h-10 ${isConnected ? "text-indigo-300" : "text-white/50"}`} />
            </div>
            <p className="text-white/60 font-medium tracking-widest text-sm uppercase">AI Companion</p>
          </div>
          
          {/* User Video Preview (PiP) */}
          <div className={`absolute bottom-4 right-4 w-32 h-48 bg-black/80 border border-white/20 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 ${isConnected && isVideoOn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
            <div className="absolute bottom-2 left-0 w-full text-center">
              <span className="text-[10px] uppercase font-bold text-white/70 bg-black/50 px-2 py-0.5 rounded-full">You</span>
            </div>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Voice & Transcript Panel */}
        <div className="w-full lg:w-96 flex flex-col gap-4">
          <div className="flex-1 bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center relative">
            {/* Dynamic Voice Waveform */}
            <div className="flex items-center justify-center gap-1.5 h-16 w-full">
              {[...Array(24)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1.5 rounded-full transition-all duration-75 ${isConnected && !isMuted ? "bg-indigo-500/80" : "bg-white/10"}`} 
                  style={{ 
                    height: isConnected && !isMuted ? `${Math.max(10, volumeLevel * (Math.random() * 1.5 + 0.5))}%` : "10%",
                  }} 
                />
              ))}
            </div>
            <p className="text-white/40 text-xs mt-6 text-center italic">
              {isConnected 
                ? (isMuted ? "Microphone muted" : "Listening to your emotional cues...")
                : "Awaiting connection..."}
            </p>
          </div>

          {/* Memory Context Panel */}
          <div className="h-48 bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-col">
            <h3 className="text-white/70 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4" />
              Live Insights
            </h3>
            <div className="flex-1 overflow-y-auto space-y-3">
              {memoryInsights.map((insight, idx) => (
                <div key={idx} className="text-white/70 text-xs bg-white/5 p-3 rounded-xl border border-white/5 animate-in fade-in slide-in-from-bottom-2">
                  {insight}
                </div>
              ))}
              {memoryInsights.length === 0 && (
                <div className="text-white/30 text-xs text-center italic mt-10">
                  Insights will appear here during your conversation.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Call Controls */}
      <div className="h-24 bg-black/40 border-t border-white/5 flex items-center justify-center gap-6 pb-2">
        {!isConnected ? (
          <button 
            onClick={handleConnect}
            className="px-8 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center gap-2 font-bold text-white shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
          >
            <PhoneCall className="w-5 h-5" /> Start {mode === 'video' ? 'Video' : 'Voice'} Session
          </button>
        ) : (
          <>
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all text-white border ${isMuted ? "bg-rose-500/20 border-rose-500/50 text-rose-400" : "bg-white/10 hover:bg-white/20 border-white/10"}`}
            >
              <Mic className="w-5 h-5" />
            </button>
            <button 
              onClick={handleDisconnect}
              className="w-14 h-14 rounded-full bg-rose-500 hover:bg-rose-600 flex items-center justify-center transition-all text-white shadow-lg shadow-rose-500/20 active:scale-90"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all text-white border ${isVideoOn ? "bg-indigo-500/30 border-indigo-500/50 text-indigo-300" : "bg-white/10 hover:bg-white/20 border-white/10"}`}
            >
              <Video className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
        </>
      )}
    </div>
  )
}

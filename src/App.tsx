import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, VolumeX, Sparkles, Send, MessageSquare, Keyboard } from "lucide-react";
import { resetZoyaSession, getZoyaResponse, getZoyaAudio } from "./services/geminiService";
import { LiveSessionManager } from "./services/liveService";
import Visualizer from "./components/Visualizer";
import PermissionModal from "./components/PermissionModal";
import PremiumBackground, { PKMood } from "./components/PremiumBackground";
import { detectMoodFromText } from "./utils/moodAnalyzer";
import { motion, AnimatePresence } from "motion/react";

type AppState = "idle" | "listening" | "processing" | "speaking";

export default function App() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [pkMood, setPkMood] = useState<PKMood>("calm");
  const [isMuted, setIsMuted] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);

  // Text Chat Mode Settings & States
  const [isTextMode, setIsTextMode] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<{ sender: "user" | "pk"; text: string }[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const liveSessionRef = useRef<LiveSessionManager | null>(null);
  const textAudioRef = useRef<HTMLAudioElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll chat to bottom when messages are updated
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (liveSessionRef.current) {
      liveSessionRef.current.isMuted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    return () => {
      if (liveSessionRef.current) {
        liveSessionRef.current.stop();
      }
      if (textAudioRef.current) {
        textAudioRef.current.pause();
      }
    };
  }, []);

  const toggleListening = async () => {
    if (isSessionActive) {
      setIsSessionActive(false);
      if (liveSessionRef.current) {
        liveSessionRef.current.stop();
        liveSessionRef.current = null;
      }
      setAppState("idle");
      setPkMood("calm");
      resetZoyaSession();
    } else {
      try {
        setIsSessionActive(true);
        resetZoyaSession();
        
        const session = new LiveSessionManager();
        session.isMuted = isMuted;
        liveSessionRef.current = session;
        
        session.onStateChange = (state) => {
          setAppState(state);
        };
        
        session.onMessage = (sender, text) => {
          console.log(`[${sender}]: ${text}`);
          if (sender === "pk") {
            const mood = detectMoodFromText(text);
            setPkMood(mood);
          }
        };
        
        session.onCommand = (url) => {
          setTimeout(() => {
            window.open(url, "_blank");
          }, 1000);
        };

        await session.start();
      } catch (e) {
        console.error("Failed to start session", e);
        setShowPermissionModal(true);
        setIsSessionActive(false);
        setAppState("idle");
        setPkMood("calm");
      }
    }
  };

  const toggleMode = (textMode: boolean) => {
    setIsTextMode(textMode);
    
    // Cleanup active vocal streams
    if (isSessionActive) {
      setIsSessionActive(false);
      if (liveSessionRef.current) {
        liveSessionRef.current.stop();
        liveSessionRef.current = null;
      }
    }
    
    // Stop playing text-to-speech
    if (textAudioRef.current) {
      textAudioRef.current.pause();
      textAudioRef.current = null;
    }
    
    setAppState("idle");
    setPkMood("calm");
    setChatInput("");
    resetZoyaSession();
  };

  const handleSendText = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const prompt = chatInput.trim();
    if (!prompt || isGenerating) return;

    setChatInput("");
    setIsGenerating(true);
    setAppState("processing");

    const updatedMessages = [...messages, { sender: "user" as const, text: prompt }];
    setMessages(updatedMessages);

    try {
      // 1. Send query to Gemini fallback service
      const responseText = await getZoyaResponse(prompt, updatedMessages);
      
      // 2. Refresh PK visual mood and visualizer
      const mood = detectMoodFromText(responseText);
      setPkMood(mood);

      setMessages(prev => [...prev, { sender: "pk" as const, text: responseText }]);
      
      // 3. Play auditory feedback using text-to-speech if unmuted
      if (!isMuted) {
        setAppState("speaking");
        const audioBase64 = await getZoyaAudio(responseText);
        if (audioBase64) {
          if (textAudioRef.current) {
            textAudioRef.current.pause();
            textAudioRef.current = null;
          }
          
          const audioUrl = `data:audio/mp3;base64,${audioBase64}`;
          const audio = new Audio(audioUrl);
          textAudioRef.current = audio;

          audio.onended = () => {
            setAppState("idle");
            textAudioRef.current = null;
          };
          audio.onerror = () => {
            setAppState("idle");
            textAudioRef.current = null;
          };

          await audio.play();
        } else {
          setAppState("idle");
        }
      } else {
        setAppState("speaking");
        setTimeout(() => {
          setAppState("idle");
        }, 1200);
      }
    } catch (error) {
      console.error("Text mode error:", error);
      setAppState("idle");
    } finally {
      setIsGenerating(false);
    }
  };

  const currentMoodBadge = () => {
    switch (pkMood) {
      case "roasting":
        return {
          label: "রোস্টিং মুড • Sassy & Funny",
          color: "border-orange-500/30 bg-orange-500/10 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.15)]",
        };
      case "mature":
        return {
          label: "ম্যাচিউর মুড • Serious & Intellectual",
          color: "border-violet-500/30 bg-violet-500/10 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.15)]",
        };
      case "calm":
      default:
        return {
          label: "শান্ত মুড • Gentle & Soft",
          color: "border-pink-500/30 bg-pink-500/10 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.15)]",
        };
    }
  };

  const badgeConfig = currentMoodBadge();

  return (
    <div className="h-[100dvh] w-screen bg-[#030206] text-slate-100 flex flex-col font-sans relative overflow-hidden m-0 p-0 selection:bg-pink-500/35 selection:text-white">
      
      {showPermissionModal && (
        <PermissionModal 
          onClose={() => setShowPermissionModal(false)} 
        />
      )}

      {/* Dynamic Sweet Violet, Orange, Pink or Indigo cosmic radiant backdrop depending on emotional moods */}
      <PremiumBackground mood={pkMood} state={appState} />

      {/* Modern Glassmorphic Mode Toggle & Settings Header */}
      <div className="absolute top-4 inset-x-4 z-40 flex items-center justify-between px-2">
        {/* Interaction Mode Pill Switch */}
        <div className="flex bg-neutral-950/65 backdrop-blur-xl border border-white/5 rounded-full p-1 shadow-2xl">
          <button
            onClick={() => toggleMode(false)}
            className={`px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-300 cursor-pointer ${
              !isTextMode
                ? "bg-pink-500 text-black shadow-md shadow-pink-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Mic size={12} />
            <span>Voice</span>
          </button>
          
          <button
            onClick={() => toggleMode(true)}
            className={`px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-300 cursor-pointer ${
              isTextMode
                ? "bg-pink-500 text-black shadow-md shadow-pink-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <MessageSquare size={12} />
            <span>Text Chat</span>
          </button>
        </div>

        {/* Dynamic Voice Out Enable/Mute Toggle */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`flex items-center justify-center p-2 rounded-full border transition-all duration-350 cursor-pointer ${
            isMuted 
              ? "border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20" 
              : "border-white/5 bg-white/5 text-slate-400 hover:bg-white/10"
          }`}
          title={isMuted ? "Speak Audio Muted" : "Speak Audio Enabled"}
        >
          {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="text-pink-400" />}
        </button>
      </div>

      {/* Main Single-Screen Minimal Layout */}
      <main className="flex-1 w-full h-full flex flex-col items-center justify-center z-10 px-4 pt-16 pb-6">
        
        {/* 1. Visualizer (Active Core) dynamically responds to states */}
        <div className={`flex flex-col items-center justify-center transition-all duration-500 ${isTextMode ? "h-36 md:h-44 scale-[0.6] md:scale-[0.7]" : "h-auto"}`}>
          <Visualizer state={appState} />
        </div>

        {/* 2. Interactive Mode Renderers */}
        <div className="w-full max-w-lg flex flex-col items-center justify-center flex-1 min-h-0">
          <AnimatePresence mode="wait">
            {!isTextMode ? (
              // VOICE MODE DECK
              <motion.div
                key="voice-deck"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="flex flex-col items-center gap-6"
              >
                {/* Active mood display indicator */}
                <div className="h-7 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {isSessionActive && (appState === "speaking" || appState === "processing") && (
                      <motion.div
                        key={pkMood}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className={`text-[10px] md:text-xs font-semibold tracking-wider font-sans uppercase px-4 py-1 border rounded-full flex items-center gap-2 select-none duration-500 ${badgeConfig.color}`}
                      >
                        <Sparkles size={11} className="animate-spin duration-3000" />
                        <span>{badgeConfig.label}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Microscopic prompt note if failed previously */}
                <p className="text-[10px] text-slate-500 font-medium text-center max-w-xs leading-relaxed">
                  যদি মাইক্রোফোন না আসে, ডানদিকের <strong className="text-pink-400">Text Chat</strong> অপশনটি ব্যবহার বা ওপরের লিঙ্কের সাহায্যে নতুন ট্যাবে খুলুন।
                </p>

                {/* Primary Voice Connection Toggle Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleListening}
                  className={`
                    font-sans text-xs md:text-sm uppercase tracking-[0.2em] py-4.5 px-11 border rounded-full transition-all duration-300 md:duration-500 flex items-center gap-3 font-extrabold select-none cursor-pointer ${
                      isSessionActive
                        ? "border-rose-500/30 bg-rose-500/10 text-rose-400 shadow-[0_0_40px_rgba(244,63,94,0.3)] hover:bg-rose-500 hover:text-white"
                        : "border-pink-500/30 bg-pink-500/10 text-pink-400 shadow-[0_0_40px_rgba(236,72,153,0.3)] hover:bg-pink-500 hover:text-white"
                    }
                  `}
                >
                  {isSessionActive ? (
                    <>
                      <MicOff size={16} className="animate-pulse text-rose-400" />
                      <span>Stop Listening</span>
                    </>
                  ) : (
                    <>
                      <Mic size={16} className="animate-bounce text-pink-400" />
                      <span>Interact with PK</span>
                    </>
                  )}
                </motion.button>
              </motion.div>
            ) : (
              // TEXT CHAT MODE DECK
              <motion.div
                key="chat-deck"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="w-full h-full flex flex-col min-h-0 relative bg-neutral-950/20 border border-white/5 rounded-3xl"
              >
                {/* Scrollable messages panel */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-white/5 pr-2">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center px-4 opacity-50 space-y-2">
                      <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center mb-1">
                        <Keyboard size={18} className="text-pink-400" />
                      </div>
                      <p className="text-xs font-bold tracking-wide text-white">PK-র সাথে কথা বলুন</p>
                      <p className="text-[10px] text-slate-400 max-w-xs leading-relaxed">
                        নিচে বাংলায় বা ইংলিশে টাইপ করুন। যেমন: "একটা রোস্ট করো", "কেমন আছো", "Shuvo কে নিয়ে কিছু বলো"।
                      </p>
                    </div>
                  ) : (
                    messages.map((msg, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs inline-block leading-relaxed border ${
                            msg.sender === "user"
                              ? "bg-violet-500/10 border-violet-500/25 text-violet-200 rounded-tr-none"
                              : "bg-pink-500/10 border-pink-500/20 text-pink-200 rounded-tl-none shadow-[0_0_15px_rgba(236,72,153,0.06)]"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </motion.div>
                    ))
                  )}

                  {isGenerating && (
                    <motion.div className="flex justify-start">
                      <div className="bg-pink-500/5 border border-pink-500/10 rounded-2xl rounded-tl-none px-4 py-2.5 text-xs text-slate-400 flex items-center gap-1.5 font-medium animate-pulse">
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                        <span className="ml-1 text-[10px] font-mono select-none">PK typing...</span>
                      </div>
                    </motion.div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Sassy Glassmorphic Input Form Panel */}
                <form 
                  onSubmit={handleSendText} 
                  className="p-2 bg-neutral-950/60 border-t border-white/5 rounded-b-3xl gap-2 flex items-center"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={isGenerating ? "PK ভাবছে..." : "বাংলা অথবা English-এ কিছু লিখুন..."}
                    className="flex-1 bg-white/5 border border-white/5 hover:border-white/10 focus:border-pink-500/30 text-white placeholder-slate-500 text-xs rounded-2xl px-4 py-2.5 focus:outline-none transition-colors"
                    disabled={isGenerating}
                  />
                  
                  <button
                    type="submit"
                    disabled={!chatInput.trim() || isGenerating}
                    className="h-10 w-10 flex items-center justify-center rounded-2xl bg-pink-500 text-black hover:bg-pink-400 transition-colors disabled:opacity-40 disabled:hover:bg-pink-500 cursor-pointer"
                  >
                    <Send size={14} className={isGenerating ? "animate-pulse" : ""} />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </main>
    </div>
  );
}

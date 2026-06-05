import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, VolumeX, Sparkles } from "lucide-react";
import { resetZoyaSession } from "./services/geminiService";
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

  const liveSessionRef = useRef<LiveSessionManager | null>(null);

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

      {/* Main Single-Screen Minimal Layout */}
      <main className="flex-1 w-full h-full flex flex-col items-center justify-center z-10 px-4">
        
        {/* Visualizer & Interactive Liquid Core Orb showing "PK" */}
        <div className="flex flex-col items-center justify-center mb-4">
          <Visualizer state={appState} />
        </div>

        {/* Centralised control deck containing Mute and Primary Session triggers */}
        <div className="flex flex-col items-center gap-6 z-20">
          
          {/* Active emotional feedback mini capsule */}
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

          {/* Main Action Conversation Stream Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleListening}
            className={`
              font-sans text-xs md:text-sm uppercase tracking-[0.2em] py-4 px-10 border rounded-full transition-all duration-300 md:duration-500 flex items-center gap-3 font-extrabold select-none cursor-pointer ${
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

          {/* Sassy voice output mute switch */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs tracking-wider transition-all duration-300 cursor-pointer ${
              isMuted 
                ? "border-amber-500/20 bg-amber-500/5 text-amber-400 hover:bg-amber-500/10" 
                : "border-white/5 bg-white/5 text-slate-400 hover:bg-white/10"
            }`}
            title={isMuted ? "Unmute vocal response feedback" : "Mute vocal response feedback"}
          >
            {isMuted ? (
              <>
                <VolumeX size={13} className="text-amber-400" />
                <span className="font-medium">Voice Audio Muted</span>
              </>
            ) : (
              <>
                <Volume2 size={13} className="text-pink-400" />
                <span className="font-medium">Voice Audio Enabled</span>
              </>
            )}
          </button>

        </div>

      </main>
    </div>
  );
}

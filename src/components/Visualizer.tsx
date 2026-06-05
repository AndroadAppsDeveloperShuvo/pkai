import React from "react";
import { motion } from "motion/react";

type VisualizerState = "idle" | "listening" | "processing" | "speaking";

interface VisualizerProps {
  state: VisualizerState;
}

export default function Visualizer({ state }: VisualizerProps) {
  // Soft, sweet violet and pink radiant themes suited for PK's cosmic vibe
  const getTheme = () => {
    switch (state) {
      case "listening":
        return {
          glow: "rgba(236, 72, 153, 0.55)", // Neon pink active glow
          gradient: "from-pink-500 via-purple-500 to-indigo-500",
          shadow: "shadow-pink-500/50",
          ring: "border-pink-500/30",
          accent: "#ec4899",
          label: "Hearing...",
        };
      case "processing":
        return {
          glow: "rgba(139, 92, 246, 0.65)", // Magic violet/indigo thought glow
          gradient: "from-indigo-400 via-purple-600 to-fuchsia-500",
          shadow: "shadow-purple-500/50",
          ring: "border-purple-500/30",
          accent: "#8b5cf6",
          label: "Thinking...",
        };
      case "speaking":
        return {
          glow: "rgba(244, 63, 94, 0.7)", // Radiant warm pinkish-rose voice emission
          gradient: "from-rose-500 via-pink-500 to-purple-500",
          shadow: "shadow-rose-500/60",
          ring: "border-rose-500/30",
          accent: "#f43f5e",
          label: "Speaking...",
        };
      default:
        return {
          glow: "rgba(139, 92, 246, 0.35)", // Calm ambient twilight
          gradient: "from-violet-600 via-fuchsia-600 to-pink-600",
          shadow: "shadow-violet-600/30",
          ring: "border-white/10",
          accent: "#a78bfa",
          label: "Active Core",
        };
    }
  };

  const theme = getTheme();

  // Pulse values for liquid core scaling
  const getPulseScale = () => {
    switch (state) {
      case "speaking":
        return [1, 1.22, 0.94, 1.18, 1];
      case "listening":
        return [1, 1.12, 0.97, 1.08, 1];
      case "processing":
        return [0.98, 1.04, 0.98];
      default:
        return [1, 1.03, 1];
    }
  };

  // Border-radius animation frames for liquid organic fluid behavior
  const liquidBorderFrames = [
    "42% 58% 70% 30% / 45% 45% 55% 55%",
    "70% 30% 52% 48% / 60% 40% 60% 40%",
    "30% 70% 70% 30% / 50% 60% 40% 50%",
    "42% 58% 70% 30% / 45% 45% 55% 55%"
  ];

  const liquidBorderFramesAlt = [
    "50% 50% 30% 70% / 50% 60% 40% 50%",
    "45% 55% 75% 25% / 40% 40% 60% 60%",
    "60% 40% 45% 55% / 50% 45% 55% 50%",
    "50% 50% 30% 70% / 50% 60% 40% 50%"
  ];

  return (
    <div className="relative w-80 h-80 md:w-110 md:h-110 flex items-center justify-center pointer-events-auto select-none">
      
      {/* 1. Backdrop Glowing Cosmic Energy Mesh Nebula */}
      <motion.div
        animate={
          state === "speaking"
            ? { scale: [1, 1.45, 1.08, 1.35, 1], opacity: [0.5, 0.95, 0.6, 0.95, 0.5] }
            : state === "listening"
            ? { scale: [1, 1.25, 0.98, 1.2, 1], opacity: [0.45, 0.85, 0.5, 0.85, 0.45] }
            : state === "processing"
            ? { scale: [1, 1.15, 1], opacity: [0.6, 0.95, 0.6] }
            : { scale: [1, 1.08, 1], opacity: [0.35, 0.55, 0.35] }
        }
        transition={{
          duration: state === "speaking" ? 1.4 : state === "processing" ? 1.0 : 3.0,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 rounded-full blur-[110px] transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${theme.glow} 0%, rgba(3, 2, 6, 0) 75%)`,
        }}
      />

      {/* 2. Concentric Outer Glass Aura Spheres with dash lines */}
      <div className="absolute w-[94%] h-[94%] rounded-full border border-white/5 flex items-center justify-center">
        {/* Slow rotating stellar gauge ring */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 75, repeat: Infinity, ease: "linear" }}
          className="absolute w-full h-full rounded-full border border-dashed border-white/10 opacity-40" 
        />
        <div className="absolute w-[86%] h-[86%] rounded-full border border-white/[0.03]" />
      </div>

      {/* 3. Layer 1: Living Liquid Inner Membrane */}
      <motion.div
        animate={{
          borderRadius: liquidBorderFrames,
          rotate: [0, 120, 240, 360],
          scale: state === "speaking" ? [1, 1.12, 0.97, 1.1, 1] : 1
        }}
        transition={{
          borderRadius: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 16, repeat: Infinity, ease: "linear" },
          scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
        }}
        className={`absolute w-72 h-72 md:w-96 md:h-96 bg-gradient-to-tr ${theme.gradient} opacity-[0.22] mix-blend-screen filter blur-[8px] transition-all duration-700`}
      />

      {/* 4. Layer 2: Counter-Rotating Liquid Outer Mesh Layer */}
      <motion.div
        animate={{
          borderRadius: liquidBorderFramesAlt,
          rotate: [360, 240, 120, 0],
          scale: state === "speaking" ? [0.95, 1.08, 1.15, 0.96, 0.95] : 0.98
        }}
        transition={{
          borderRadius: { duration: 9, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 1.9, repeat: Infinity, ease: "easeInOut" }
        }}
        className={`absolute w-[88%] h-[88%] bg-gradient-to-br ${theme.gradient} opacity-[0.16] mix-blend-screen filter blur-[6px] transition-all duration-700`}
      />

      {/* 5. Dynamic Sinusoidal Wave Audio Ripples */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-full">
        <svg className="w-full h-1/2 absolute opacity-80" viewBox="0 0 400 200" fill="none">
          <motion.path
            animate={{
              d: state === "speaking" 
                ? [
                    "M 30,100 C 120,20 180,180 200,100 C 220,20 280,180 370,100",
                    "M 30,100 C 110,170 170,30 200,100 C 230,170 290,30 370,100",
                    "M 30,100 C 130,40 160,160 200,100 C 240,40 270,160 370,100",
                    "M 30,100 C 120,20 180,180 200,100 C 220,20 280,180 370,100"
                  ]
                : state === "listening"
                ? [
                    "M 50,100 Q 125,75 200,100 T 350,100",
                    "M 50,100 Q 125,125 200,100 T 350,100",
                    "M 50,100 Q 125,75 200,100 T 350,100"
                  ]
                : state === "processing"
                ? [
                    "M 80,100 Q 140,92 200,100 T 320,100",
                    "M 80,100 Q 140,108 200,100 T 320,100",
                    "M 80,100 Q 140,92 200,100 T 320,100"
                  ]
                : ["M 100,100 H 300"]
            }}
            transition={{
              duration: state === "speaking" ? 1.2 : state === "listening" ? 1.5 : 2.5,
              repeat: Infinity,
              ease: "linear"
            }}
            stroke={theme.accent}
            strokeWidth={state === "idle" ? "0.8" : "2.5"}
            className="drop-shadow-[0_0_15px_rgba(139,92,246,0.6)] transition-all duration-500"
            opacity={state === "idle" ? "0.15" : "0.85"}
          />
          {state !== "idle" && (
            <motion.path
              animate={{
                d: state === "speaking"
                  ? [
                      "M 30,100 C 100,160 160,40 200,100 C 240,160 300,40 370,100",
                      "M 30,100 C 130,50 150,150 200,100 C 250,50 270,150 370,100",
                      "M 30,100 C 100,160 160,40 200,100 C 240,160 300,40 370,100"
                    ]
                  : [
                      "M 50,100 Q 125,115 200,100 T 350,100",
                      "M 50,100 Q 125,85 200,100 T 350,100",
                      "M 50,100 Q 125,115 200,100 T 350,100"
                    ]
              }}
              transition={{
                duration: state === "speaking" ? 1.7 : 2.2,
                repeat: Infinity,
                ease: "linear"
              }}
              stroke="#ec4899"
              strokeWidth="1.5"
              className="drop-shadow-[0_0_10px_rgba(236,72,153,0.4)]"
              opacity="0.45"
            />
          )}
        </svg>
      </div>

      {/* 6. Ultimate Glowing Glassmorphic Core Liquid Orb */}
      <motion.div
        animate={{
          scale: getPulseScale(),
          borderRadius: liquidBorderFrames
        }}
        transition={{
          scale: { duration: state === "speaking" ? 0.30 : 1.7, repeat: Infinity, ease: "easeInOut" },
          borderRadius: { duration: 10, repeat: Infinity, ease: "easeInOut" }
        }}
        className={`absolute w-38 h-38 md:w-48 md:h-48 border border-white/20 bg-neutral-950/85 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.85),inset_0_4px_30px_rgba(255,255,255,0.08)] backdrop-blur-3xl z-10 ${theme.shadow} transition-all duration-700`}
      >
        <div className="relative flex flex-col items-center justify-center">
          
          {/* Internal Swirling Energetic Plasma Core */}
          <motion.div
            animate={{
              scale: state === "idle" ? [1, 1.15, 1] : [1, 1.45, 0.9, 1.3, 1],
              rotate: 360
            }}
            transition={{
              scale: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 10, repeat: Infinity, ease: "linear" }
            }}
            className={`w-16 h-16 rounded-full bg-gradient-to-tr ${theme.gradient} opacity-85 blur-[5px] shadow-[0_0_25px_${theme.accent}]`}
          />
          
          {/* Glowing Engraved Typography text "PK" */}
          <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
            <span 
              className="font-sans font-black tracking-[0.08em] text-2xl text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.95)]"
              style={{ textShadow: "0 4px 14px rgba(255, 255, 255, 0.85)" }}
            >
              PK
            </span>
            
            {/* Soft state text label directly inside the liquid core */}
            <span className="font-mono text-[7px] font-bold uppercase tracking-[0.25em] text-slate-300/80 mt-1.5 transition-all duration-300">
              {theme.label}
            </span>
          </div>
          
        </div>
      </motion.div>

    </div>
  );
}


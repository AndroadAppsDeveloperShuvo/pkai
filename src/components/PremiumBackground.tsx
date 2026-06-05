import React, { useEffect, useRef } from "react";
import { motion } from "motion/react";

export type PKMood = "roasting" | "mature" | "calm";
export type AppState = "idle" | "listening" | "processing" | "speaking";

interface PremiumBackgroundProps {
  mood: PKMood;
  state: AppState;
}

const moodThemes = {
  roasting: {
    radialCenter: "rgba(249, 115, 22, 0.15)", // Light orange center glow
    aurora1: "rgba(236, 72, 153, 0.20)",     // Bright fuchsia pink
    aurora2: "rgba(249, 115, 22, 0.16)",     // Light orange
    lineColor: "rgba(236, 72, 153,",
    particleColors: [
      "rgba(249, 115, 22,", // light orange
      "rgba(217, 70, 239,", // fuchsia pink
      "rgba(236, 72, 153,", // pink
      "rgba(244, 63, 94,",  // light rose
    ],
  },
  mature: {
    radialCenter: "rgba(109, 40, 217, 0.16)", // Deep violet center glow
    aurora1: "rgba(124, 58, 237, 0.18)",      // Deep violet
    aurora2: "rgba(79, 70, 229, 0.18)",       // Bluish indigo
    lineColor: "rgba(124, 58, 237,",
    particleColors: [
      "rgba(139, 92, 246,", // deep violet
      "rgba(79, 70, 229,",  // bluish indigo
      "rgba(99, 102, 241,",  // indigo
      "rgba(59, 130, 246,",  // blue
    ],
  },
  calm: {
    radialCenter: "rgba(251, 207, 232, 0.10)", // Soft light pink center glow
    aurora1: "rgba(244, 114, 182, 0.15)",      // Soft light pink
    aurora2: "rgba(241, 245, 249, 0.08)",      // Off-white
    lineColor: "rgba(244, 114, 182,",
    particleColors: [
      "rgba(244, 114, 182,", // soft pink
      "rgba(252, 165, 165,", // warm peach
      "rgba(241, 245, 249,", // off-white
      "rgba(254, 242, 242,", // soft white
    ],
  },
};

export default function PremiumBackground({ mood, state }: PremiumBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentTheme = moodThemes[mood] || moodThemes.calm;

  // Utilize Ref to bypass full canvas teardown and update colors on-the-fly dynamically
  const colorsRef = useRef(currentTheme.particleColors);
  const lineColorsRef = useRef(currentTheme.lineColor);

  useEffect(() => {
    colorsRef.current = currentTheme.particleColors;
    lineColorsRef.current = currentTheme.lineColor;
  }, [currentTheme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const particleCount = 45;
    const particles: {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
      decay: number;
      colorIndex: number;
    }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3.5 + 1.5,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.4 + 0.1,
        decay: (Math.random() - 0.5) * 0.005,
        colorIndex: Math.floor(Math.random() * 4),
      });
    }

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const activeColors = colorsRef.current;
      const activeLineColor = lineColorsRef.current;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce boundaries
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Subtle alpha breathing
        p.alpha += p.decay;
        if (p.alpha < 0.15 || p.alpha > 0.65) {
          p.decay *= -1;
        }

        // Draw dynamic glowing core
        const baseColor = activeColors[p.colorIndex % activeColors.length];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${baseColor}${p.alpha})`;
        ctx.fill();

        // High contrast surrounding glow aura
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `${baseColor}${p.alpha * 0.15})`;
        ctx.fill();
      });

      // Animated connector threads
      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.08;
            ctx.strokeStyle = `${activeLineColor}${alpha})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden bg-[#0a0814] z-0">
      
      {/* 1. Underlying Absolute Dark Matter Canvas Shading */}
      <div className="absolute inset-0 bg-[#04030a]" />

      {/* 2. Emotional Core Radiant Center Glow */}
      <motion.div
        animate={{
          backgroundColor: currentTheme.radialCenter,
          scale: state === "speaking" ? [1, 1.15, 0.96, 1.1, 1] : state === "processing" ? [0.95, 1.05, 0.95] : [1, 1.02, 1],
          opacity: state === "idle" ? 0.4 : 1
        }}
        transition={{
          backgroundColor: { duration: 1.6, ease: "easeInOut" },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 1.0 }
        }}
        className="absolute top-[12%] left-[15%] w-[70%] h-[60%] rounded-full blur-[140px]"
      />

      {/* 3. Left Hand Drifting Aurora Cloud */}
      <motion.div
        animate={{
          backgroundColor: currentTheme.aurora1,
          x: [0, 50, -40, 0],
          y: [0, -35, 25, 0],
          scale: state === "speaking" ? [1.1, 1.25, 1.1] : [1, 1.12, 1],
          opacity: state === "idle" ? 0.35 : 1
        }}
        transition={{
          backgroundColor: { duration: 1.6, ease: "easeInOut" },
          x: { duration: 25, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 25, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 20, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 1.0 }
        }}
        className="absolute top-[-10%] left-[-15%] w-[65%] h-[65%] rounded-full blur-[130px]"
      />

      {/* 4. Right Hand Drifting Aurora Cloud */}
      <motion.div
        animate={{
          backgroundColor: currentTheme.aurora2,
          x: [0, -45, 35, 0],
          y: [0, 40, -20, 0],
          scale: state === "speaking" ? [1.1, 1.18, 1.1] : [1, 1.05, 1],
          opacity: state === "idle" ? 0.3 : 1
        }}
        transition={{
          backgroundColor: { duration: 1.6, ease: "easeInOut" },
          x: { duration: 28, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 28, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 24, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 1.0 }
        }}
        className="absolute bottom-[-15%] right-[-20%] w-[70%] h-[70%] rounded-full blur-[140px]"
      />

      {/* 5. Animated Interactive Particles Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full mix-blend-screen opacity-[0.5]" />

    </div>
  );
}

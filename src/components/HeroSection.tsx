"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

const BOOT_LINES = [
  { text: "sys.kernel.load .............. OK", delay: 0 },
  { text: "net.interface.init ........... OK", delay: 200 },
  { text: "gpu.render.pipeline .......... OK", delay: 400 },
  { text: "auth.biometric.scan .......... OK", delay: 700 },
  { text: "env.creative.mode ............ ACTIVE", delay: 1000 },
  { text: "ui.portfolio.mount ........... READY", delay: 1300 },
];

export default function HeroSection() {
  const [bootPhase, setBootPhase] = useState<"booting" | "revealing" | "complete">("booting");
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Boot sequence
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    BOOT_LINES.forEach((line, i) => {
      timers.push(
        setTimeout(() => setVisibleLines(i + 1), line.delay)
      );
    });

    timers.push(
      setTimeout(() => setBootPhase("revealing"), 1800)
    );
    timers.push(
      setTimeout(() => setBootPhase("complete"), 2400)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  // GSAP kinetic text animation
  useEffect(() => {
    if (bootPhase !== "revealing") return;

    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    if (!title || !subtitle) return;

    // Split title into spans
    const text = title.textContent || "";
    title.innerHTML = text
      .split("")
      .map(
        (char) =>
          `<span class="inline-block opacity-0">${char === " " ? "&nbsp;" : char}</span>`
      )
      .join("");

    const chars = title.querySelectorAll("span");

    gsap.fromTo(
      chars,
      {
        opacity: 0,
        y: 40,
        rotateX: -90,
        scale: 0.8,
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.03,
        ease: "expo.out",
      }
    );

    gsap.fromTo(
      subtitle,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, delay: 0.6, ease: "power3.out" }
    );
  }, [bootPhase]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center pt-9"
    >
      {/* Radial glow behind hero */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-electric-violet/[0.04] blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <AnimatePresence mode="wait">
          {bootPhase === "booting" && (
            <motion.div
              key="boot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
              transition={{ duration: 0.4 }}
              className="glass-panel rounded-xl p-8 text-left max-w-md mx-auto"
              data-glass
            >
              {/* Terminal header */}
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                <span className="ml-2 font-mono text-[10px] text-slate-500 tracking-wider">
                  SYSTEM INIT
                </span>
              </div>

              {/* Boot lines */}
              <div className="space-y-1.5 font-mono text-xs">
                {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex justify-between"
                  >
                    <span className="text-slate-400">
                      {line.text.split("..")[0]}
                    </span>
                    <span className="text-slate-600">
                      {"..".repeat(Math.max(1, 12 - line.text.split("..")[0].length / 2))}
                    </span>
                    <span
                      className={
                        line.text.includes("ACTIVE")
                          ? "text-electric-violet boot-text"
                          : line.text.includes("READY")
                          ? "text-neon-cyan boot-text"
                          : "text-emerald-500/70"
                      }
                    >
                      {line.text.includes("ACTIVE")
                        ? "ACTIVE"
                        : line.text.includes("READY")
                        ? "READY"
                        : "OK"}
                    </span>
                  </motion.div>
                ))}

                {/* Blinking cursor */}
                {visibleLines < BOOT_LINES.length && (
                  <span className="inline-block w-2 h-4 bg-electric-violet/60 animate-pulse" />
                )}
              </div>

              {/* Progress bar */}
              <div className="mt-5 h-px bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-electric-violet to-neon-cyan"
                  initial={{ width: "0%" }}
                  animate={{
                    width: `${(visibleLines / BOOT_LINES.length) * 100}%`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          )}

          {(bootPhase === "revealing" || bootPhase === "complete") && (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {/* Status badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 glass-panel rounded-full px-4 py-1.5 mb-8"
                data-glass
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[11px] tracking-widest text-slate-400 uppercase">
                  System Online
                </span>
              </motion.div>

              {/* Main title */}
              <h1
                ref={titleRef}
                className="text-5xl sm:text-7xl md:text-8xl font-semibold tracking-tight text-white mb-6"
                style={{ perspective: "800px" }}
              >
                Rodrigo Wu
              </h1>

              {/* Subtitle */}
              <p
                ref={subtitleRef}
                className="text-lg sm:text-xl text-slate-400 font-light max-w-lg mx-auto mb-10 opacity-0"
              >
                Creative Developer & Digital Architect.
                <br />
                <span className="text-electric-violet/80 font-mono text-sm">
                  Building interfaces that feel alive.
                </span>
              </p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="flex items-center justify-center gap-4"
              >
                <button
                  data-glass
                  className="glass-panel rounded-xl px-6 py-3 font-mono text-sm tracking-wider text-white/90 hover:bg-white/[0.06] transition-all duration-300 animate-glow-pulse"
                >
                  EXPLORE_WORK()
                </button>
                <button
                  data-glass
                  className="rounded-xl px-6 py-3 font-mono text-sm tracking-wider bg-electric-violet/20 text-electric-violet border border-electric-violet/20 hover:bg-electric-violet/30 hover:border-electric-violet/40 transition-all duration-300"
                >
                  INIT_CONTACT()
                </button>
              </motion.div>

              {/* Scroll indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
              >
                <span className="font-mono text-[10px] tracking-[0.3em] text-slate-500 uppercase">
                  Scroll
                </span>
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-px h-8 bg-gradient-to-b from-electric-violet/50 to-transparent"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

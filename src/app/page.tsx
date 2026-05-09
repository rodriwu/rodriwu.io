"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Taskbar from "@/components/Taskbar";
import DesktopIcons, { DESKTOP_ITEMS } from "@/components/DesktopIcons";
import OsWindow from "@/components/OsWindow";
import AboutWindow from "@/components/windows/AboutWindow";
import ContactWindow from "@/components/windows/ContactWindow";
import TerminalWindow from "@/components/windows/TerminalWindow";
import WorkWindow from "@/components/windows/WorkWindow";
import GimpWindow from "@/components/windows/GimpWindow";
import FlappyWindow from "@/components/windows/FlappyWindow";
import MusicWidget from "@/components/MusicWidget";
import DotGrid from "@/components/DotGrid";
import BlobLayer from "@/components/BlobLayer";
import type { LucideIcon } from "lucide-react";

interface WindowState {
  id: string;
  zIndex: number;
}

export interface MinimizedWindowInfo {
  id: string;
  title: string;
  icon?: LucideIcon;
}

const WINDOW_CONFIG: Record<string, { title: string; w: number; h: number; x: number; y: number }> = {
  about:    { title: "About — Rodrigo Martínez", w: 480, h: 540, x: 160, y: 40  },
  contact:  { title: "Contact",                  w: 440, h: 420, x: 320, y: 100 },
  terminal: { title: "Terminal — bash",          w: 580, h: 380, x: 140, y: 120 },
  resume:   { title: "Resume.pdf",               w: 660, h: 700, x: 140, y: 30  },
  work:     { title: "Work — Case Studies",      w: 560, h: 500, x: 180, y: 80  },
  gimp:     { title: "GNU Image Manipulation Program", w: 860, h: 560, x: 80,  y: 30  },
  flappy:   { title: "Flappy Bird",                    w: 360, h: 520, x: 240, y: 40  },
};

function ResumeWindow() {
  return (
    <iframe
      src="/resume.pdf"
      className="w-full h-full"
      style={{ border: "none", display: "block" }}
      title="Resume — Rodrigo Martínez"
    />
  );
}

function getWindowContent(id: string, locale: "en" | "es", isDark: boolean, onOpenContact?: () => void, onOpenApp?: (appId: string) => void): React.ReactNode {
  switch (id) {
    case "about":    return <AboutWindow locale={locale} isDark={isDark} onOpenContact={onOpenContact} />;
    case "contact":  return <ContactWindow locale={locale} isDark={isDark} />;
    case "terminal": return <TerminalWindow locale={locale} />;
    case "resume":   return <ResumeWindow />;
    case "work":     return <WorkWindow onOpenApp={onOpenApp} />;
    case "gimp":     return <GimpWindow />;
    case "flappy":   return <FlappyWindow />;
    default:         return null;
  }
}


const BOOT_MESSAGES = [
  "sys.kernel.load ......... OK",
  "display.compositor ....... OK",
  "auth.user ............... rodriwu",
  "rodriwu.io .............. READY",
  "♪  ambient sound enabled — click anywhere to play",
];

export default function Desktop() {
  const [isDark, setIsDark] = useState(false);
  const [locale, setLocale] = useState<"en" | "es">("en");
  const [scale, setScale] = useState(1);
  const [canvasW, setCanvasW] = useState(1440);
  const [canvasH, setCanvasH] = useState(900);
  const initialDPR = useRef(1);
  const [openWindows, setOpenWindows] = useState<WindowState[]>([]);
  const [minimizedWindows, setMinimizedWindows] = useState<string[]>([]);
  const [maximizedWindows, setMaximizedWindows] = useState<Set<string>>(new Set());
  const [topZ, setTopZ] = useState(30);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioTime, setAudioTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/ambient.mp4");
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;
    audio.addEventListener("timeupdate", () => setAudioTime(audio.currentTime));
    audio.addEventListener("durationchange", () => {
      if (isFinite(audio.duration)) setAudioDuration(audio.duration);
    });
    audio.addEventListener("loadedmetadata", () => {
      if (isFinite(audio.duration)) setAudioDuration(audio.duration);
    });
    const play = () => { audio.play().then(() => setIsPlaying(true)).catch(() => {}); };
    document.addEventListener("pointerdown", play, { once: true });
    return () => {
      document.removeEventListener("pointerdown", play);
      audio.pause();
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = isMuted;
  }, [isMuted]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  useEffect(() => {
    initialDPR.current = window.devicePixelRatio;
    setCanvasW(window.innerWidth);
    setCanvasH(window.innerHeight);

    const update = () => {
      const zoomRatio = window.devicePixelRatio / initialDPR.current;
      setScale(1 / zoomRatio);
      setCanvasW(Math.round(window.innerWidth * zoomRatio));
      setCanvasH(Math.round(window.innerHeight * zoomRatio));
    };

    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const [booted, setBooted] = useState(false);
  const [bootPhase, setBootPhase] = useState<"logo" | "loading" | "messages" | "done">("logo");
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setBootPhase("loading"), 900);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (bootPhase !== "loading") return;
    const start = performance.now();
    const duration = 700;
    let raf: number;
    const tick = (now: number) => {
      const pct = Math.min((now - start) / duration, 1);
      setLoadProgress(Math.round(pct * 100));
      if (pct < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setBootPhase("messages"), 200);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [bootPhase]);

  useEffect(() => {
    if (bootPhase !== "messages") return;
    BOOT_MESSAGES.forEach((line, i) => {
      setTimeout(() => {
        setBootLines((prev) => [...prev, line]);
        if (i === BOOT_MESSAGES.length - 1) {
          setTimeout(() => {
            setBootPhase("done");
            setTimeout(() => setBooted(true), 500);
          }, 300);
        }
      }, i * 320);
    });
  }, [bootPhase]);

  // Detect system color scheme on mount and listen for changes
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
    }
  }, [isDark]);

  // Persist audio position across mute/unmute via localStorage
  useEffect(() => {
    const saved = parseFloat(localStorage.getItem("audioTime") ?? "0");
    if (isFinite(saved) && saved > 0 && audioRef.current) {
      audioRef.current.currentTime = saved;
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current && isPlaying) {
        localStorage.setItem("audioTime", String(audioRef.current.currentTime));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const openWindow = (id: string) => {
    if (id === "resume") {
      window.open("/resume.pdf", "_blank");
      return;
    }
    if (minimizedWindows.includes(id)) {
      setMinimizedWindows((prev) => prev.filter((w) => w !== id));
      return;
    }
    setTopZ((z) => {
      const newZ = z + 1;
      setOpenWindows((prev) => {
        if (prev.some((w) => w.id === id)) return prev;
        return [...prev, { id, zIndex: newZ }];
      });
      return newZ;
    });
  };

  const closeWindow = (id: string) => {
    setOpenWindows((prev) => prev.filter((w) => w.id !== id));
    setMinimizedWindows((prev) => prev.filter((w) => w !== id));
    setMaximizedWindows((prev) => { const n = new Set(prev); n.delete(id); return n; });
  };

  const handleMaximizeChange = (id: string, isMax: boolean) => {
    setMaximizedWindows((prev) => {
      const n = new Set(prev);
      if (isMax) n.add(id); else n.delete(id);
      return n;
    });
  };

  const anyMaximized = maximizedWindows.size > 0;

  const minimizeWindow = (id: string) => {
    setMinimizedWindows((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const restoreWindow = (id: string) => {
    setMinimizedWindows((prev) => prev.filter((w) => w !== id));
  };

  const minimizedInfo: MinimizedWindowInfo[] = minimizedWindows.map((id) => ({
    id,
    title: WINDOW_CONFIG[id]?.title ?? id,
    icon: DESKTOP_ITEMS.find((d) => d.id === id)?.icon ?? undefined,
  }));

  return (
    <>
      {/* Full-viewport background */}
      <div style={{ position: "fixed", inset: 0, background: isDark ? "#111111" : "#b8b2a5", transition: "background 0.6s ease" }} />

      {/* Design canvas — matches viewport at 100% zoom, counter-scaled on zoom */}
      <div
        className={isDark ? "" : "light"}
        style={{
          width: canvasW,
          height: canvasH,
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: "center center",
          background: isDark ? "#111111" : "#b8b2a5",
          transition: "background 0.6s ease",
        }}
      >
      {/* Squircle desktop */}
      <div
        style={{
          position: "absolute",
          inset: 10,
          borderRadius: 22,
          overflow: "hidden",
          transform: "translateZ(0)",
        }}
      >
        {/* Base background */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: isDark ? "#03040a" : "#c5bfb2", transition: "background-color 0.6s ease" }}
        />

        {/* Ethereal ambient blobs */}
        <BlobLayer isDark={isDark} />

        {/* Interactive dot grid */}
        <DotGrid isDark={isDark} />

        {/* Edge vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isDark
              ? "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 50%, rgba(0,0,0,0.65) 100%)"
              : "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 50%, rgba(0,0,0,0.08) 100%)",
          }}
        />

        {/* Scanline */}
        <div className="scanline-overlay absolute inset-0 pointer-events-none" />

        {/* Boot screen */}
        <AnimatePresence>
          {!booted && (
            <motion.div
              key="boot"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-8"
              style={{ background: isDark ? "rgba(8,8,8,0.96)" : "rgba(242,238,228,0.97)" }}
            >
              {/* Logo + circular progress ring */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col items-center gap-3"
              >
                {/* RM circle with ring loader */}
                <div style={{ position: "relative", width: 56, height: 56 }}>
                  <div
                    className="flex items-center justify-center rounded-full font-mono font-semibold overflow-hidden"
                    style={{
                      width: 56,
                      height: 56,
                      border: isDark ? "1.5px solid rgba(255,255,255,0.35)" : "1.5px solid rgba(0,0,0,0.22)",
                      fontSize: "14px",
                      letterSpacing: "0.08em",
                      color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.82)",
                      position: "relative",
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {loadProgress >= 100 ? (
                        <motion.img
                          key="profile"
                          src="/profile.png"
                          alt="Rodrigo"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.35 }}
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "center 18%",
                          }}
                        />
                      ) : (
                        <motion.span
                          key="rm"
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          RM
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* SVG ring — appears once loading starts */}
                  {(bootPhase === "loading" || bootPhase === "messages" || bootPhase === "done") && (
                    <svg
                      width={76}
                      height={76}
                      style={{
                        position: "absolute",
                        top: -10,
                        left: -10,
                        transform: "rotate(-90deg)",
                        pointerEvents: "none",
                      }}
                    >
                      {/* Track */}
                      <circle
                        cx={38} cy={38} r={34}
                        fill="none"
                        stroke={isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}
                        strokeWidth={1.5}
                      />
                      {/* Progress arc */}
                      <circle
                        cx={38} cy={38} r={34}
                        fill="none"
                        stroke={isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.55)"}
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 34}
                        strokeDashoffset={2 * Math.PI * 34 * (1 - loadProgress / 100)}
                        style={{ transition: "stroke-dashoffset 0.04s linear" }}
                      />
                    </svg>
                  )}
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="font-mono tracking-[0.22em] uppercase"
                  style={{ fontSize: "14px", color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)" }}
                >
                  rodriwu.io
                </motion.p>
              </motion.div>

              {/* Terminal messages */}
              <AnimatePresence>
                {bootPhase === "messages" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="font-mono space-y-1"
                    style={{ fontSize: "10px", color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.42)" }}
                  >
                    {bootLines.map((line, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.18 }}
                      >
                        {line}
                      </motion.div>
                    ))}
                    {bootLines.length < BOOT_MESSAGES.length && (
                      <span
                        className="boot-cursor inline-block w-1.5 h-3"
                        style={{ background: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.25)" }}
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop UI */}
        <AnimatePresence>
          {booted && (
            <motion.div
              key="desktop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Taskbar
                isDark={isDark}
                onToggleTheme={() => setIsDark((d) => !d)}
                minimizedWindows={minimizedInfo}
                onRestoreWindow={restoreWindow}
                onOpenTerminal={() => openWindow("terminal")}
                onOpenAbout={() => openWindow("about")}
                onOpenWork={() => openWindow("work")}
                isMuted={isMuted}
                onToggleMute={() => setIsMuted((m) => !m)}
                locale={locale}
                onSetLocale={setLocale}
              />

              <DesktopIcons onOpen={openWindow} canvasW={canvasW} canvasH={canvasH} dimmed={anyMaximized} />

              {/* Music widget — shown/hidden by sidebar sound button */}
              <AnimatePresence>
                {!isMuted && (
                  <MusicWidget
                    key="music-widget"
                    isPlaying={isPlaying}
                    isMuted={isMuted}
                    isDark={isDark}
                    currentTime={audioTime}
                    duration={audioDuration}
                    onTogglePlay={togglePlay}
                    onToggleMute={() => setIsMuted((m) => !m)}
                    onSeek={(t) => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = t;
                        setAudioTime(t);
                      }
                    }}
                    initX={canvasW - 20 - 264}
                    initY={canvasH - 20 - 92 - 16}
                    canvasW={canvasW}
                    canvasH={canvasH}
                  />
                )}
              </AnimatePresence>

              <AnimatePresence>
                {openWindows.map((win) => {
                  const cfg = WINDOW_CONFIG[win.id];
                  if (!cfg) return null;

                  const TASKBAR = 56;
                  const isMobile = canvasW < 768;
                  const contentW = canvasW - 20 - TASKBAR;
                  const contentH = canvasH - 20;

                  const winW = isMobile ? Math.min(cfg.w, contentW - 16) : cfg.w;
                  const winH = isMobile ? Math.min(cfg.h, contentH - 40) : cfg.h;
                  const winX = isMobile ? TASKBAR + Math.round((contentW - winW) / 2) : cfg.x;
                  const winY = isMobile ? Math.max(10, Math.round((contentH - winH) / 3)) : cfg.y;

                  return (
                    <div
                      key={win.id}
                      style={{
                        position: "absolute",
                        inset: 0,
                        zIndex: win.zIndex,
                        pointerEvents: "none",
                      }}
                    >
                      <OsWindow
                        id={win.id}
                        title={cfg.title}
                        onClose={() => closeWindow(win.id)}
                        onMinimize={() => minimizeWindow(win.id)}
                        isMinimized={minimizedWindows.includes(win.id)}
                        defaultPosition={{ x: winX, y: winY }}
                        defaultSize={{ w: winW, h: winH }}
                        canvasW={canvasW}
                        canvasH={canvasH}
                        maxSizeFraction={win.id === "about" || win.id === "contact" || win.id === "work" ? 0.96 : 0.9}
                        maxPixelW={win.id === "work" ? Math.round((canvasW - 20 - 56) * 0.70) : win.id === "about" || win.id === "contact" ? 720 : win.id === "flappy" ? 480 : undefined}
                        maxPixelH={win.id === "flappy" ? 680 : undefined}
                        snapLeft={win.id === "about"}
                        openMaximized={win.id === "contact"}
                        autoHeight={win.id === "contact"}
                        onMaximize={(isMax) => handleMaximizeChange(win.id, isMax)}
                      >
                        {getWindowContent(win.id, locale, isDark, () => openWindow("contact"), openWindow)}
                      </OsWindow>
                    </div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </div>
    </>
  );
}

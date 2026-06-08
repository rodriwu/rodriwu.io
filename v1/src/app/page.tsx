"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import Taskbar from "@/components/Taskbar";
import DesktopIcons, { DESKTOP_ITEMS } from "@/components/DesktopIcons";
import OsWindow from "@/components/OsWindow";
import AboutWindow from "@/components/windows/AboutWindow";
import ContactWindow from "@/components/windows/ContactWindow";
import TerminalWindow from "@/components/windows/TerminalWindow";
import WorkWindow from "@/components/windows/WorkWindow";
import GimpWindow from "@/components/windows/GimpWindow";
import FlappyWindow from "@/components/windows/FlappyWindow";
import CaseStudyWindow from "@/components/windows/CaseStudyWindow";
import MusicWidget from "@/components/MusicWidget";
import ImageWidget from "@/components/ImageWidget";
import OnboardTooltip from "@/components/OnboardTooltip";
import DotGrid from "@/components/DotGrid";
import BlobLayer from "@/components/BlobLayer";
import { Sun, Moon, Volume2, VolumeX, Globe, type LucideIcon } from "lucide-react";

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
  about:           { title: "About — Rodrigo Martínez",         w: 480, h: 540, x: 160, y: 40  },
  contact:         { title: "Contact",                           w: 440, h: 420, x: 320, y: 100 },
  terminal:        { title: "Terminal — bash",                   w: 580, h: 380, x: 140, y: 120 },
  resume:          { title: "Resume.pdf",                        w: 660, h: 700, x: 140, y: 30  },
  work:            { title: "File Browser",                      w: 560, h: 500, x: 180, y: 80  },
  gimp:            { title: "GNU Image Manipulation Program",    w: 860, h: 560, x: 80,  y: 30  },
  "casestudy-mp":  { title: "MovingPlace — Case Study",          w: 680, h: 600, x: 200, y: 60  },
  "casestudy-pp":  { title: "PermitPuller — Case Study",         w: 680, h: 600, x: 220, y: 70  },
  "casestudy-hah": { title: "HireAHelper — Case Study",          w: 680, h: 600, x: 240, y: 80  },
  "casestudy-hdmn":{ title: "Hahdmin — Case Study",              w: 680, h: 600, x: 260, y: 90  },
};


/* MobileGallery removed — mobile now uses actual ImageWidget + PostItWidget components
   rendered directly in the Desktop component, same as tablet/desktop */

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
    case "about":            return <AboutWindow locale={locale} isDark={isDark} onOpenContact={onOpenContact} />;
    case "contact":          return <ContactWindow locale={locale} isDark={isDark} />;
    case "terminal":         return <TerminalWindow locale={locale} />;
    case "resume":           return <ResumeWindow />;
    case "work":             return <WorkWindow onOpenApp={onOpenApp} />;
    case "gimp":             return <GimpWindow />;
    case "casestudy-mp":     return <CaseStudyWindow id="mp"   isDark={isDark} />;
    case "casestudy-pp":     return <CaseStudyWindow id="pp"   isDark={isDark} />;
    case "casestudy-hah":    return <CaseStudyWindow id="hah"  isDark={isDark} />;
    case "casestudy-hdmn":   return <CaseStudyWindow id="hdmn" isDark={isDark} />;
    default:                 return null;
  }
}


/* ── Mobile nav bar — sits outside the squircle at the bottom ── */
function MobileNavBar({
  isDark, onToggleTheme, isMuted, onToggleMute, locale, onSetLocale, onOpenAbout,
}: {
  isDark: boolean; onToggleTheme: () => void;
  isMuted: boolean; onToggleMute: () => void;
  locale: "en" | "es"; onSetLocale: (l: "en" | "es") => void;
  onOpenAbout: () => void;
}) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: false }));
      setDate(now.toLocaleDateString(undefined, { month: "short", day: "numeric" }));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 48,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingInline: 16,
        background: "var(--taskbar-bg)",
        backdropFilter: "blur(32px) saturate(160%)",
        WebkitBackdropFilter: "blur(32px) saturate(160%)",
        borderTop: "1px solid var(--taskbar-border)",
        zIndex: 45,
      }}
    >
      {/* Left: about avatar + clock */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenAbout}
          className="taskbar-icon flex items-center justify-center rounded-full overflow-hidden"
          style={{
            width: 30, height: 30, flexShrink: 0,
            backgroundImage: "url('/profile.png')",
            backgroundSize: "cover",
            backgroundPosition: "center 20%",
            border: "1.5px solid var(--taskbar-border)",
          }}
        />
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[10px] tabular-nums" style={{ color: "var(--text-secondary)" }}>{time}</span>
          <span className="font-mono text-[8px]" style={{ color: "var(--text-tertiary)" }}>{date}</span>
        </div>
      </div>

      {/* Right: system controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={onToggleTheme}
          className="taskbar-icon rounded-lg flex items-center justify-center"
          style={{ width: 34, height: 34 }}
        >
          {isDark ? <Sun size={14} strokeWidth={1.5} /> : <Moon size={14} strokeWidth={1.5} />}
        </button>
        <button
          onClick={onToggleMute}
          className="taskbar-icon rounded-lg flex items-center justify-center"
          style={{ width: 34, height: 34 }}
        >
          {isMuted ? <VolumeX size={14} strokeWidth={1.5} /> : <Volume2 size={14} strokeWidth={1.5} />}
        </button>
        <button
          onClick={() => onSetLocale(locale === "en" ? "es" : "en")}
          className="taskbar-icon rounded-md flex items-center justify-center font-mono"
          style={{ width: 34, height: 22, fontSize: "9px", letterSpacing: "0.06em" }}
        >
          <Globe size={12} strokeWidth={1.5} style={{ marginRight: 3 }} />
          {locale.toUpperCase()}
        </button>
      </div>
    </motion.div>
  );
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
  // Random position jitter — computed once per page load
  const jitter = useMemo(() => {
    const r = (n: number) => Math.round((Math.random() - 0.5) * 2 * n);
    return {
      big:      { x: r(6),  y: r(5)  },
      mp:       { x: r(4),  y: r(4)  },
      green:    { x: r(4),  y: r(4)  },
      portrait: { x: r(4),  y: r(4)  },
      navy:     { x: r(4),  y: r(4)  },
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Collision / push system ──────────────────────────────────────────────
  type WidgetEntry = {
    getRect: () => { x: number; y: number; w: number; h: number };
    setPos: (x: number, y: number) => void;
  };
  const widgetRegistry = useRef<Record<string, WidgetEntry>>({});
  const canvasSizeRef = useRef({ w: canvasW, h: canvasH });
  useEffect(() => { canvasSizeRef.current = { w: canvasW, h: canvasH }; }, [canvasW, canvasH]);

  const registerWidget = useCallback((
    id: string,
    getRect: WidgetEntry["getRect"],
    setPos: WidgetEntry["setPos"]
  ) => {
    widgetRegistry.current[id] = { getRect, setPos };
  }, []);

  const resolveCollisions = useCallback((movingId: string) => {
    const reg = widgetRegistry.current;
    const ids = Object.keys(reg);
    if (ids.length < 2) return;

    const GAP = 16;
    const TASKBAR = 56;
    const PAD = 20;
    const { w: cW, h: cH } = canvasSizeRef.current;
    const inset = cW >= 1024 ? 10 : 0;
    const areaW = cW - inset * 2;
    const areaH = cH - inset * 2;

    // Snapshot all current positions
    const rects: Record<string, { x: number; y: number; w: number; h: number }> = {};
    for (const id of ids) rects[id] = { ...reg[id].getRect() };

    // Iterative separation (MTV — minimum translation vector)
    for (let iter = 0; iter < 10; iter++) {
      let changed = false;
      for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
          const idA = ids[i], idB = ids[j];
          const rA = rects[idA], rB = rects[idB];
          const ox = Math.min(rA.x + rA.w, rB.x + rB.w) - Math.max(rA.x, rB.x) + GAP;
          const oy = Math.min(rA.y + rA.h, rB.y + rB.h) - Math.max(rA.y, rB.y) + GAP;
          if (ox > 0 && oy > 0) {
            changed = true;
            const aMoving = idA === movingId;
            const bMoving = idB === movingId;
            const cAx = rA.x + rA.w / 2, cAy = rA.y + rA.h / 2;
            const cBx = rB.x + rB.w / 2, cBy = rB.y + rB.h / 2;
            if (ox < oy) {
              const dir = cAx <= cBx ? 1 : -1;
              if (!aMoving) rects[idA].x -= dir * (bMoving ? ox : ox / 2);
              if (!bMoving) rects[idB].x += dir * (aMoving ? ox : ox / 2);
            } else {
              const dir = cAy <= cBy ? 1 : -1;
              if (!aMoving) rects[idA].y -= dir * (bMoving ? oy : oy / 2);
              if (!bMoving) rects[idB].y += dir * (aMoving ? oy : oy / 2);
            }
          }
        }
      }
      if (!changed) break;
    }

    // Apply resolved positions (clamped to canvas) for all non-moving widgets
    for (const id of ids) {
      if (id === movingId) continue;
      const r = rects[id];
      reg[id].setPos(
        Math.max(TASKBAR + PAD, Math.min(r.x, areaW - r.w - PAD)),
        Math.max(PAD, Math.min(r.y, areaH - r.h - PAD))
      );
    }
  }, []);
  // ─────────────────────────────────────────────────────────────────────────

  const [openWindows, setOpenWindows] = useState<WindowState[]>([]);
  const [minimizedWindows, setMinimizedWindows] = useState<string[]>([]);
  const [maximizedWindows, setMaximizedWindows] = useState<Set<string>>(new Set());
  const [topZ, setTopZ] = useState(30);
  const [showOnboard, setShowOnboard] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioTime, setAudioTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [volume, setVolume] = useState(0.35);
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
    return () => {
      audio.pause();
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

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
    const w = window.innerWidth;
    const h = window.innerHeight;
    setCanvasW(w);
    setCanvasH(h);

    if (w < 1024) {
      setIsMuted(true);
    }

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

  // Show onboard tooltip on every page load after boot
  useEffect(() => {
    if (!booted) return;
    const t = setTimeout(() => setShowOnboard(true), 600);
    return () => clearTimeout(t);
  }, [booted]);

  const dismissOnboard = useCallback(() => {
    setShowOnboard(false);
  }, []);

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
    const isMobile = canvasW < 1024;
    if (minimizedWindows.includes(id)) {
      if (isMobile) {
        setOpenWindows([]);
        setMinimizedWindows([]);
      } else {
        setMinimizedWindows((prev) => prev.filter((w) => w !== id));
      }
      if (!isMobile) return;
    }
    if (isMobile) {
      // Close all existing windows before opening new one
      setOpenWindows([]);
      setMinimizedWindows([]);
    }
    setTopZ((z) => {
      const newZ = z + 1;
      setOpenWindows((prev) => {
        if (!isMobile && prev.some((w) => w.id === id)) return prev;
        const filtered = isMobile ? [] : prev.filter((w) => w.id !== id);
        return [...filtered, { id, zIndex: newZ }];
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
      {/* Mobile bottom nav bar — outside the squircle */}
      {canvasW < 1024 && booted && (
        <MobileNavBar
          isDark={isDark}
          onToggleTheme={() => setIsDark((d) => !d)}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted((m) => !m)}
          locale={locale}
          onSetLocale={setLocale}
          onOpenAbout={() => openWindow("about")}
        />
      )}

      {/* Squircle desktop */}
      <div
        style={{
          position: "absolute",
          top: canvasW >= 1024 ? 10 : 0,
          left: canvasW >= 1024 ? 10 : 0,
          right: canvasW >= 1024 ? 10 : 0,
          bottom: canvasW >= 1024 ? 10 : 48,
          borderRadius: canvasW >= 1024 ? 22 : "16px 16px 0 0",
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
                canvasW={canvasW}
                onOpenApp={openWindow}
                highlightWork={showOnboard}
              />

              {/* Onboard tooltip — shows every page load, exit-animated by AnimatePresence */}
              <AnimatePresence>
                {showOnboard && (
                  <OnboardTooltip
                    key="onboard"
                    isDark={isDark}
                    canvasW={canvasW}
                    onDismiss={dismissOnboard}
                    onOpenWork={() => { openWindow("work"); dismissOnboard(); }}
                  />
                )}
              </AnimatePresence>

              {canvasW >= 1024 && <DesktopIcons onOpen={openWindow} canvasW={canvasW} canvasH={canvasH} dimmed={anyMaximized} />}

              {/* ── Desktop: absolutely positioned widgets mapped to case studies ── */}
              {/* big + mp on RIGHT (canvasW-relative). portrait, green, navy on LEFT cluster. */}
              {canvasW >= 1024 && (
                <>
                  {/* MovingPlace — large card, right side */}
                  <ImageWidget
                    isDark={isDark}
                    src="https://framerusercontent.com/images/Wy7kJdr0RGp6Jdn5Ga6IqsAt48s.png"
                    title="MovingPlace"
                    w={646} h={485} rotate={-1.5}
                    initX={Math.max(522, canvasW - 722) + jitter.big.x}
                    initY={20 + jitter.big.y}
                    canvasW={canvasW} canvasH={canvasH}
                    widgetId="big"
                    onRegister={registerWidget}
                    onDragMove={resolveCollisions}
                    onClickOpen={() => openWindow("casestudy-mp")}
                  />
                  {/* Profile portrait — top-left */}
                  <ImageWidget
                    isDark={isDark}
                    src="/profile.png"
                    title="Rodrigo"
                    w={195} h={270} rotate={1.5}
                    initX={76 + jitter.portrait.x}
                    initY={20 + jitter.portrait.y}
                    canvasW={canvasW} canvasH={canvasH}
                    widgetId="portrait"
                    onRegister={registerWidget}
                    onDragMove={resolveCollisions}
                  />
                  {/* PermitPuller — square, left-center */}
                  <ImageWidget
                    isDark={isDark}
                    src="https://framerusercontent.com/images/VHZaEeNa8nbta4tCbBaySIKY.png"
                    title="PermitPuller"
                    w={215} h={215} rotate={-1.8}
                    initX={287 + jitter.green.x}
                    initY={20 + jitter.green.y}
                    canvasW={canvasW} canvasH={canvasH}
                    widgetId="green"
                    onRegister={registerWidget}
                    onDragMove={resolveCollisions}
                    onClickOpen={() => openWindow("casestudy-pp")}
                  />
                  {/* Hahdmin — below portrait, left */}
                  <ImageWidget
                    isDark={isDark}
                    src="https://framerusercontent.com/images/coTFiZvMFRW5tpYV0IaG6n8fRY.png"
                    title="Hahdmin"
                    w={265} h={195} rotate={-0.9}
                    initX={76 + jitter.navy.x}
                    initY={316 + jitter.navy.y}
                    canvasW={canvasW} canvasH={canvasH}
                    widgetId="navy"
                    onRegister={registerWidget}
                    onDragMove={resolveCollisions}
                    onClickOpen={() => openWindow("casestudy-hdmn")}
                  />
                  {/* HireAHelper — below MovingPlace, right */}
                  <ImageWidget
                    isDark={isDark}
                    src="https://framerusercontent.com/images/y7xvRLi2Bc4K2Ji54TYS8Pi1d8.png"
                    title="HireAHelper"
                    w={380} h={285} rotate={0.5}
                    initX={Math.max(522, canvasW - 456) + jitter.mp.x}
                    initY={521 + jitter.mp.y}
                    canvasW={canvasW} canvasH={canvasH}
                    widgetId="mp"
                    onRegister={registerWidget}
                    onDragMove={resolveCollisions}
                    onClickOpen={() => openWindow("casestudy-hah")}
                  />
                </>
              )}

              {/* ── Mobile: scrollable grid layout ── */}
              {canvasW < 1024 && (() => {
                const gap = 12;
                const pad = 16;
                const col = Math.floor((canvasW - pad * 2 - gap) / 2);
                const tall = Math.round(col * 1.35);
                const wide = canvasW - pad * 2;

                return (
                  <div style={{
                    position: "absolute", inset: 0,
                    overflowY: "auto", overflowX: "hidden",
                    WebkitOverflowScrolling: "touch",
                    zIndex: 18,
                    pointerEvents: "auto",
                  }}>
                    <div style={{
                      display: "flex", flexWrap: "wrap",
                      gap, padding: pad,
                      paddingBottom: 80,
                    }}>
                      {/* Row 1: MovingPlace full width */}
                      <ImageWidget
                        isDark={isDark}
                        src="https://framerusercontent.com/images/Wy7kJdr0RGp6Jdn5Ga6IqsAt48s.png"
                        title="MovingPlace"
                        w={wide} h={Math.round(wide * 0.55)} rotate={0}
                        initX={0} initY={0}
                        canvasW={canvasW} canvasH={canvasH}
                        widgetId="big"
                        onRegister={registerWidget}
                        onDragMove={resolveCollisions}
                        onClickOpen={() => openWindow("casestudy-mp")}
                      />

                      {/* Row 2: Portrait + PermitPuller */}
                      <ImageWidget
                        isDark={isDark}
                        src="/profile.png"
                        title="Rodrigo"
                        w={col} h={tall} rotate={0}
                        initX={0} initY={0}
                        canvasW={canvasW} canvasH={canvasH}
                        widgetId="portrait"
                        onRegister={registerWidget}
                        onDragMove={resolveCollisions}
                      />
                      <ImageWidget
                        isDark={isDark}
                        src="https://framerusercontent.com/images/VHZaEeNa8nbta4tCbBaySIKY.png"
                        title="PermitPuller"
                        w={col} h={tall} rotate={0}
                        initX={0} initY={0}
                        canvasW={canvasW} canvasH={canvasH}
                        widgetId="green"
                        onRegister={registerWidget}
                        onDragMove={resolveCollisions}
                        onClickOpen={() => openWindow("casestudy-pp")}
                      />

                      {/* Row 3: HireAHelper full width */}
                      <ImageWidget
                        isDark={isDark}
                        src="https://framerusercontent.com/images/y7xvRLi2Bc4K2Ji54TYS8Pi1d8.png"
                        title="HireAHelper"
                        w={wide} h={Math.round(wide * 0.55)} rotate={0}
                        initX={0} initY={0}
                        canvasW={canvasW} canvasH={canvasH}
                        widgetId="mp"
                        onRegister={registerWidget}
                        onDragMove={resolveCollisions}
                        onClickOpen={() => openWindow("casestudy-hah")}
                      />

                      {/* Row 4: Hahdmin half */}
                      <ImageWidget
                        isDark={isDark}
                        src="https://framerusercontent.com/images/coTFiZvMFRW5tpYV0IaG6n8fRY.png"
                        title="Hahdmin"
                        w={col} h={col} rotate={0}
                        initX={0} initY={0}
                        canvasW={canvasW} canvasH={canvasH}
                        widgetId="navy"
                        onRegister={registerWidget}
                        onDragMove={resolveCollisions}
                        onClickOpen={() => openWindow("casestudy-hdmn")}
                      />
                    </div>
                  </div>
                );
              })()}


              {/* Music widget — fixed bottom-right, collapses when idle */}
              <div style={{ position: "absolute", inset: 0, zIndex: canvasW < 1024 && openWindows.length > 0 ? 1 : "auto", pointerEvents: "none" }}>
              <AnimatePresence>
                {!isMuted && (
                  <MusicWidget
                    key="music-widget"
                    isPlaying={isPlaying}
                    isMuted={isMuted}
                    isDark={isDark}
                    currentTime={audioTime}
                    duration={audioDuration}
                    volume={volume}
                    onTogglePlay={togglePlay}
                    onToggleMute={() => setIsMuted((m) => !m)}
                    onSeek={(t) => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = t;
                        setAudioTime(t);
                      }
                    }}
                    onVolumeChange={setVolume}
                    canvasW={canvasW}
                    canvasH={canvasH}
                  />
                )}
              </AnimatePresence>
              </div>

              <AnimatePresence>
                {openWindows.map((win) => {
                  const cfg = WINDOW_CONFIG[win.id];
                  if (!cfg) return null;

                  const isMobile = canvasW < 1024;
                  const MOBILE_NAV_H = 48;
                  const TASKBAR = isMobile ? 0 : 56;
                  const inset = isMobile ? 0 : 10;
                  const effectiveH = isMobile ? canvasH - MOBILE_NAV_H : canvasH;
                  const contentW = canvasW - inset * 2 - TASKBAR;
                  const contentH = effectiveH - inset * 2;

                  const winW = isMobile ? canvasW : cfg.w;
                  const winH = isMobile ? effectiveH : cfg.h;
                  const winX = isMobile ? 0 : cfg.x;
                  const winY = isMobile ? 0 : cfg.y;

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
                        canvasH={effectiveH}
                        maxSizeFraction={win.id === "about" || win.id === "contact" || win.id === "work" || win.id.startsWith("casestudy-") ? 0.96 : 0.9}
                        maxPixelW={isMobile ? undefined : win.id === "work" ? Math.round((canvasW - 20 - 56) * 0.70) : win.id === "about" || win.id === "contact" ? 720 : win.id === "flappy" ? 480 : undefined}
                        maxPixelH={win.id === "flappy" ? 680 : undefined}
                        snapLeft={win.id === "about"}
                        openMaximized={win.id === "contact" || win.id.startsWith("casestudy-")}
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

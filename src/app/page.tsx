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
import MusicWidget from "@/components/MusicWidget";
import ImageWidget from "@/components/ImageWidget";
import PostItWidget from "@/components/PostItWidget";
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
  work:     { title: "File Browser",             w: 560, h: 500, x: 180, y: 80  },
  gimp:     { title: "GNU Image Manipulation Program", w: 860, h: 560, x: 80,  y: 30  },
};

/* ── Mobile post-it (draggable, in scroll flow) ── */
function MobilePostIt({ isDark, colW }: { isDark: boolean; colW: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const postW = Math.round(colW * 0.72); // ~72% of column width

  const noteBg   = isDark ? "#CBC3E3" : "#fef08a";
  const noteTop  = isDark ? "#B8AED6" : "#fde047";
  const noteText = isDark ? "rgba(38,28,58,0.88)"  : "rgba(60,40,10,0.85)";
  const noteSub  = isDark ? "rgba(55,40,80,0.55)"  : "rgba(80,55,10,0.52)";
  const pinColor = isDark ? "#7c5fa0" : "#ca8a04";
  const shadow   = isDark
    ? "0 4px 14px rgba(0,0,0,0.24), 0 1px 4px rgba(0,0,0,0.12)"
    : "0 2px 10px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04)";

  return (
    <motion.div
      drag dragMomentum={false} dragElastic={0}
      dragConstraints={{ left: 0, right: colW - postW, top: -12, bottom: 12 }}
      style={{ x, y, width: postW, borderRadius: 4, overflow: "hidden", background: noteBg, boxShadow: shadow, cursor: "grab", touchAction: "none", userSelect: "none" as const }}
      initial={{ rotate: -2 }}
      animate={{ rotate: -2 }}
      whileTap={{ cursor: "grabbing" }}
    >
      {/* Header strip */}
      <div style={{ background: noteTop, borderBottom: `1px solid ${isDark ? "rgba(38,28,58,0.10)" : "rgba(180,140,0,0.15)"}`, height: 30, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px" }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: pinColor, boxShadow: "0 1px 3px rgba(0,0,0,0.25)" }} />
        <span style={{ fontFamily: "sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: "0.06em", color: noteSub }}>note.txt</span>
      </div>
      {/* Body */}
      <div style={{ padding: "11px 14px 15px" }}>
        <p style={{ fontFamily: "sans-serif", fontWeight: 600, fontSize: 15, lineHeight: 1.3, color: noteText, margin: 0, marginBottom: 7 }}>
          Hey, welcome! 👋
        </p>
        <p style={{ fontFamily: "sans-serif", fontWeight: 400, fontSize: 14, lineHeight: 1.6, color: noteSub, margin: 0 }}>
          Poke around — open apps, toggle the theme, play some music.
        </p>
        <p style={{ fontFamily: "sans-serif", fontWeight: 400, fontSize: 13, color: noteSub, margin: 0, marginTop: 9, opacity: 0.75 }}>— Rodrigo</p>
      </div>
    </motion.div>
  );
}

/* ── Mobile gallery (phone < 768 px) ── */
function MobileGallery({ isDark, canvasW, onOpen }: { isDark: boolean; canvasW: number; onOpen: (id: string) => void }) {
  const pad   = 18;
  const gap   = 24;   // generous breathing room
  const colW  = canvasW - 56 - pad * 2;
  // Scale cards 20% larger — overflow clipped by parent overflowX: hidden
  const scW    = Math.round(colW * 1.20);
  const halfW  = Math.round((scW - 14) / 2);
  const prtW   = Math.round(scW * 0.64);

  // Exact ImageWidget shadow + border tokens
  const dropShadow = isDark
    ? "0 20px 56px rgba(0,0,0,0.48), 0 4px 14px rgba(0,0,0,0.28)"
    : "0 3px 14px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)";
  const bdr    = isDark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(0,0,0,0.06)";
  const insetHL = isDark ? "inset 0 1px 0 rgba(255,255,255,0.12)" : "inset 0 1px 0 rgba(255,255,255,0.88)";

  // Card shell — matches ImageWidget inner card exactly
  const card = (w: number, h: number, rot: number) => ({
    width: w, height: h,
    borderRadius: 16,
    overflow: "hidden" as const,
    position: "relative" as const,
    flexShrink: 0 as const,
    border: bdr,
    boxShadow: `${dropShadow}, ${insetHL}`,
    transform: `rotate(${rot}deg)`,
  });

  // Overlays — identical to ImageWidget
  const overlays = () => (
    <>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.28) 38%, transparent 62%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, transparent 24%)", pointerEvents: "none" }} />
    </>
  );

  // 3-dot handle (top-right, same as desktop)
  const handle = () => (
    <div style={{ position: "absolute", top: 10, right: 10, zIndex: 4, display: "flex", gap: 3, alignItems: "center", padding: "5px 8px", borderRadius: 6, background: "rgba(0,0,0,0.38)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.12)" }}>
      {[0, 1, 2].map((i) => <div key={i} style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.70)", flexShrink: 0 }} />)}
    </div>
  );

  // Text + optional dot indicators — mirrors ImageWidget bottom overlay
  const label = (title: string, sub: string, showDots: boolean, idx: number, tot: number) => (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 12px 11px", zIndex: 4 }}>
      <div style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "-0.02em", color: "rgba(255,255,255,0.95)", lineHeight: 1.2, marginBottom: 2 }}>{title}</div>
      <div style={{ fontFamily: "monospace", fontSize: 7, letterSpacing: "0.13em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.48)", marginBottom: showDots ? 7 : 0 }}>{sub}</div>
      {showDots && (
        <div style={{ display: "flex", gap: 3 }}>
          {Array.from({ length: tot }).map((_, i) => (
            <div key={i} style={{ width: i === idx - 1 ? 12 : 4, height: 4, borderRadius: 3, background: i === idx - 1 ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.22)" }} />
          ))}
        </div>
      )}
    </div>
  );

  // Extra vertical margin per card to absorb tilt overflow
  const tiltPad = (deg: number) => Math.round(Math.abs(deg) * colW * 0.018);

  const mobileApps = DESKTOP_ITEMS.filter((item) => !item.desktopOnly);

  return (
    <div style={{ position: "absolute", top: 0, left: 56, right: 0, bottom: 0, overflowY: "auto", overflowX: "hidden", pointerEvents: "auto", zIndex: 6 }}>
      <div style={{ padding: `0 ${pad}px 200px` }}>

        {/* App icons — scrolls with content */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", paddingTop: 22, paddingBottom: gap + 10 }}>
          {mobileApps.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={() => onOpen(item.id)}
                className="desktop-icon"
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: 8, borderRadius: 14, width: 76, cursor: "pointer", background: "transparent", border: "none" }}>
                <div className="icon-frame" style={{ width: 54, height: 54, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 16, overflow: "hidden" }}>
                  {Icon && <Icon size={24} strokeWidth={1.3} style={{ color: "var(--desktop-icon-text)" }} />}
                </div>
                <span className="icon-label" style={{ fontFamily: "sans-serif", fontSize: 11, fontWeight: 500, color: "var(--desktop-icon-text)", textAlign: "center" as const, lineHeight: 1.2 }}>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Post-it note */}
        <div style={{ marginBottom: gap + 8 }}>
          <MobilePostIt isDark={isDark} colW={colW} />
        </div>

        {/* 1 — MP · full width · 4:3 · tilt +0.5° */}
        <div style={{ marginBottom: gap + tiltPad(0.5) }}>
          <div style={card(scW, Math.round(scW * (285 / 380)), 0.5)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/mp-preview.webp" alt="Moving Place" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block" }} />
            {overlays()} {handle()}
            {label("Moving Place", "Brand Identity", true, 1, 6)}
          </div>
        </div>

        {/* 2 — Two squares · side by side */}
        <div style={{ display: "flex", gap: 14, marginBottom: gap + tiltPad(2.2) }}>
          <div style={card(halfW, halfW, -1.8)}>
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(145deg,#1e2d1e,#2e4830)" }} />
            {overlays()}
            {label("Untitled 02", "Work in Progress", false, 2, 6)}
          </div>
          <div style={card(halfW, halfW, 2.2)}>
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(145deg,#2a1e18,#3d2a22)" }} />
            {overlays()}
            {label("Untitled 05", "Concept", false, 5, 6)}
          </div>
        </div>

        {/* 3 — Portrait · 64% width · centered · tilt +1.5° */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: gap + tiltPad(1.5) }}>
          <div style={card(prtW, Math.round(prtW * (270 / 195)), 1.5)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/profile.png" alt="Portrait" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 15%", display: "block" }} />
            {overlays()} {handle()}
            {label("Portrait", "Photography", true, 3, 6)}
          </div>
        </div>

        {/* 4 — Navy · full width · 265:195 · tilt −0.9° */}
        <div style={{ marginBottom: gap + tiltPad(0.9) }}>
          <div style={card(scW, Math.round(scW * (195 / 265)), -0.9)}>
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(145deg,#1a1e2e,#252d42)" }} />
            {overlays()} {handle()}
            {label("Untitled 04", "Exploration", true, 4, 6)}
          </div>
        </div>

        {/* 5 — Big · full width · 4:3 · tilt −1.5° */}
        <div style={{ marginBottom: tiltPad(1.5) }}>
          <div style={card(scW, Math.round(scW * (485 / 646)), -1.5)}>
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(145deg,#1a1525,#251835)" }} />
            {overlays()} {handle()}
            {label("Untitled 06", "Exploration", true, 6, 6)}
          </div>
        </div>

      </div>
    </div>
  );
}

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
  // Random position jitter — computed once per page load
  const jitter = useMemo(() => {
    const r = (n: number) => Math.round((Math.random() - 0.5) * 2 * n);
    return {
      big:      { x: r(55), y: r(28) },
      mp:       { x: r(32), y: r(22) },
      green:    { x: r(28), y: r(20) },
      portrait: { x: r(26), y: r(20) },
      navy:     { x: r(28), y: r(18) },
      brown:    { x: r(24), y: r(18) },
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
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioTime, setAudioTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [volume, setVolume] = useState(0.35);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("https://695p4tymotasdrfh.public.blob.vercel-storage.com/ambient.mp4");
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
      {/* Squircle desktop */}
      <div
        style={{
          position: "absolute",
          inset: canvasW >= 1024 ? 10 : 0,
          borderRadius: canvasW >= 1024 ? 22 : 0,
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
              />

              {canvasW >= 768 && <DesktopIcons onOpen={openWindow} canvasW={canvasW} canvasH={canvasH} dimmed={anyMaximized} />}

              {/* Big 1.7× card — desktop only, rendered first so it sits behind cluster */}
              {canvasW >= 1024 && (
                <ImageWidget
                  isDark={isDark}
                  gradient="linear-gradient(145deg,#1a1525,#251835)"
                  title="Untitled 06"
                  subtitle="Exploration"
                  index={6} total={6}
                  w={646} h={485} rotate={-1.5}
                  initX={Math.round(canvasW * 0.07) + jitter.big.x}
                  initY={Math.round(canvasH * 0.30) + jitter.big.y}
                  canvasW={canvasW}
                  canvasH={canvasH}
                  widgetId="big"
                  onRegister={registerWidget}
                  onDragMove={resolveCollisions}
                />
              )}

              {/* Cluster — tablet and desktop (≥ 768 px) */}
              {canvasW >= 768 && (
                <>
                  <PostItWidget
                    isDark={isDark}
                    initX={Math.round(canvasW * 0.26)}
                    initY={Math.round(canvasH * 0.09)}
                    canvasW={canvasW}
                    canvasH={canvasH}
                    widgetId="postit"
                    onRegister={registerWidget}
                    onDragMove={resolveCollisions}
                  />
                  <ImageWidget
                    isDark={isDark}
                    src="/mp-preview.webp"
                    title="Moving Place"
                    subtitle="Brand Identity"
                    index={1} total={6}
                    rotate={0.5}
                    initX={(canvasW < 1024 ? Math.round(canvasW * 0.42) : Math.round(canvasW * 0.57)) + jitter.mp.x}
                    initY={Math.round(canvasH * 0.38) + jitter.mp.y}
                    canvasW={canvasW}
                    canvasH={canvasH}
                    widgetId="mp"
                    onRegister={registerWidget}
                    onDragMove={resolveCollisions}
                  />
                  <ImageWidget
                    isDark={isDark}
                    gradient="linear-gradient(145deg,#1e2d1e,#2e4830)"
                    title="Untitled 02"
                    subtitle="Work in Progress"
                    index={2} total={6}
                    w={215} h={215} rotate={-1.8} showDots={false}
                    initX={(canvasW < 1024 ? Math.round(canvasW * 0.50) : Math.round(canvasW * 0.58)) + jitter.green.x}
                    initY={Math.round(canvasH * 0.07) + jitter.green.y}
                    canvasW={canvasW}
                    canvasH={canvasH}
                    widgetId="green"
                    onRegister={registerWidget}
                    onDragMove={resolveCollisions}
                  />
                  <ImageWidget
                    isDark={isDark}
                    src="/profile.png"
                    title="Portrait"
                    subtitle="Photography"
                    index={3} total={6}
                    w={195} h={270} rotate={1.5}
                    initX={(canvasW < 1024 ? Math.round(canvasW * 0.68) : Math.round(canvasW * 0.76)) + jitter.portrait.x}
                    initY={Math.round(canvasH * 0.17) + jitter.portrait.y}
                    canvasW={canvasW}
                    canvasH={canvasH}
                    widgetId="portrait"
                    onRegister={registerWidget}
                    onDragMove={resolveCollisions}
                  />
                  <ImageWidget
                    isDark={isDark}
                    gradient="linear-gradient(145deg,#1a1e2e,#252d42)"
                    title="Untitled 04"
                    subtitle="Exploration"
                    index={4} total={6}
                    w={265} h={195} rotate={-0.9}
                    initX={(canvasW < 1024 ? Math.round(canvasW * 0.48) : Math.round(canvasW * 0.54)) + jitter.navy.x}
                    initY={Math.round(canvasH * 0.68) + jitter.navy.y}
                    canvasW={canvasW}
                    canvasH={canvasH}
                    widgetId="navy"
                    onRegister={registerWidget}
                    onDragMove={resolveCollisions}
                  />
                  <ImageWidget
                    isDark={isDark}
                    gradient="linear-gradient(145deg,#2a1e18,#3d2a22)"
                    title="Untitled 05"
                    subtitle="Concept"
                    index={5} total={6}
                    w={190} h={190} rotate={2.2} showDots={false}
                    initX={(canvasW < 1024 ? Math.round(canvasW * 0.62) : Math.round(canvasW * 0.75)) + jitter.brown.x}
                    initY={Math.round(canvasH * 0.72) + jitter.brown.y}
                    canvasW={canvasW}
                    canvasH={canvasH}
                    widgetId="brown"
                    onRegister={registerWidget}
                    onDragMove={resolveCollisions}
                  />
                </>
              )}

              {/* Mobile gallery — phone (< 768 px) */}
              {canvasW < 768 && <MobileGallery isDark={isDark} canvasW={canvasW} onOpen={openWindow} />}


              {/* Music widget — shown/hidden by sidebar sound button */}
              {/* On mobile, sink behind active windows */}
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
                    initX={canvasW < 1024 ? canvasW - 280 : canvasW - 290}
                    initY={canvasH - 168}
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

                  const TASKBAR = 56;
                  const isMobile = canvasW < 1024;
                  const inset = isMobile ? 0 : 10;
                  const contentW = canvasW - inset * 2 - TASKBAR;
                  const contentH = canvasH - inset * 2;

                  const mobileW = Math.round(contentW * 0.95);
                  const winW = isMobile ? mobileW : cfg.w;
                  const winH = isMobile ? contentH - 8 : cfg.h;
                  const winX = isMobile ? TASKBAR + Math.round((contentW - mobileW) / 2) : cfg.x;
                  const winY = isMobile ? inset + 4 : cfg.y;

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

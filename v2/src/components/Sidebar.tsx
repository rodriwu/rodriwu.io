"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { Sun, Moon, Wifi, Volume2, VolumeX, Globe, ChevronLeft, ChevronRight, Terminal as TerminalIcon } from "lucide-react";
import { useShell } from "./context/ShellContext";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function MiniCalendar() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  const prev = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const next = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  return (
    <div style={{ padding: "4px 0" }}>
      <div className="flex items-center justify-between mb-3">
        <button onClick={prev} className="taskbar-icon rounded-md flex items-center justify-center" style={{ width: 28, height: 28 }}>
          <ChevronLeft size={13} strokeWidth={2} />
        </button>
        <span className="font-mono text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button onClick={next} className="taskbar-icon rounded-md flex items-center justify-center" style={{ width: 28, height: 28 }}>
          <ChevronRight size={13} strokeWidth={2} />
        </button>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="flex items-center justify-center font-mono text-[9px]" style={{ color: "var(--text-tertiary)", height: 22 }}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
          return (
            <div key={i} className="flex items-center justify-center font-mono text-[10px] rounded-md"
              style={{ height: 28, color: day ? (isToday ? "var(--window-bg)" : "var(--text-secondary)") : "transparent", background: isToday ? "var(--text-primary)" : "transparent", fontWeight: isToday ? 600 : 400 }}>
              {day ?? ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const SOCIAL_LINKS = [
  {
    id: "behance", label: "Behance", handle: "@rodriwu",
    url: "https://www.behance.net/rodriwu", color: "#1769FF",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7.799 5.698c.589 0 1.12.051 1.606.156.482.108.895.285 1.235.534.34.247.601.582.788 1.002.183.418.275.93.275 1.53 0 .66-.148 1.21-.444 1.65-.296.44-.737.804-1.32 1.09.794.23 1.386.63 1.771 1.2.385.57.578 1.26.578 2.06 0 .66-.127 1.23-.378 1.71-.254.48-.597.87-1.03 1.17-.434.3-.935.52-1.506.66-.567.14-1.16.21-1.775.21H0V5.698h7.799zm-.47 5.51c.504 0 .914-.12 1.228-.37.313-.25.47-.63.47-1.14 0-.29-.05-.53-.154-.72a1.19 1.19 0 00-.415-.45 1.69 1.69 0 00-.59-.24 3.27 3.27 0 00-.7-.07H2.87v2.99h4.46zm.202 5.772c.27 0 .526-.026.768-.077.244-.05.458-.138.642-.265.186-.127.333-.302.44-.523.109-.22.163-.505.163-.853 0-.68-.19-1.165-.57-1.455-.38-.29-.882-.435-1.504-.435H2.87v3.608h4.66zm9.35-9.544c1.018 0 1.907.19 2.668.57.76.38 1.387.893 1.88 1.54a6.6 6.6 0 011.087 2.22c.23.835.315 1.71.252 2.625H14.18c.05.97.37 1.71.963 2.23.59.515 1.32.773 2.19.773.627 0 1.167-.157 1.62-.47.45-.315.754-.65.908-1.01h2.833c-.45 1.34-1.143 2.3-2.08 2.88-.934.576-2.063.864-3.387.864a7.08 7.08 0 01-2.517-.432 5.65 5.65 0 01-1.95-1.23 5.56 5.56 0 01-1.263-1.91c-.298-.747-.448-1.574-.448-2.48 0-.876.156-1.69.466-2.44a5.63 5.63 0 011.315-1.918 6.02 6.02 0 011.986-1.25 6.7 6.7 0 012.493-.46zm.043 2.3c-.738 0-1.356.21-1.851.63-.494.42-.797 1.05-.907 1.89h5.35c-.067-.794-.34-1.41-.82-1.845-.478-.435-1.07-.653-1.772-.653zM16.89 4.1h5.52v1.55H16.89V4.1z"/></svg>,
  },
  {
    id: "linkedin", label: "LinkedIn", handle: "Rodrigo Martínez",
    url: "https://www.linkedin.com/in/rodriwu", color: "#0A66C2",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  },
  {
    id: "github", label: "GitHub", handle: "@rodriwu",
    url: "https://github.com/rodriwu", color: "#ffffff",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>,
  },
  {
    id: "instagram", label: "Instagram", handle: "@rodriwu",
    url: "https://www.instagram.com/rodriwu", color: "#E1306C",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
  },
];

export default function Sidebar() {
  const { isDark, toggleTheme, isMuted, toggleMute, locale, setLocale, terminalOpen, toggleTerminal } = useShell();
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const sidebarRef = useRef<HTMLDivElement>(null);

  const [showCalendar, setShowCalendar] = useState(false);
  const [showWifi, setShowWifi] = useState(false);
  const [showLang, setShowLang] = useState(false);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: false }));
      setDate(now.toLocaleDateString(undefined, { month: "short", day: "numeric" }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const closeAll = useCallback(() => {
    setShowCalendar(false);
    setShowWifi(false);
    setShowLang(false);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent | TouchEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) closeAll();
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("touchstart", onClick);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("touchstart", onClick);
    };
  }, [closeAll]);

  const toggleCalendar = () => { const n = !showCalendar; closeAll(); if (n) setShowCalendar(true); };
  const toggleWifi     = () => { const n = !showWifi;     closeAll(); if (n) setShowWifi(true); };
  const toggleLang     = () => { const n = !showLang;     closeAll(); if (n) setShowLang(true); };

  return (
    <div ref={sidebarRef} className="taskbar fixed left-0 top-0 bottom-0 z-40 w-14 flex flex-col items-center justify-between py-3">
      {/* Top: avatar → back to gallery */}
      <div className="flex flex-col items-center gap-2">
        <Link
          href="/"
          className="taskbar-icon flex items-center justify-center rounded-full overflow-hidden"
          style={{ width: 36, height: 36, flexShrink: 0, backgroundImage: "url('/profile.png')", backgroundSize: "cover", backgroundPosition: "center 20%" }}
          title="Back to gallery"
        />
        <div className="w-6" style={{ borderTop: "1px solid var(--separator)" }} />
        <button
          onClick={toggleTerminal}
          className="taskbar-icon rounded-xl flex items-center justify-center"
          style={{
            width: 38, height: 38,
            background: terminalOpen ? "var(--taskbar-icon-active-bg)" : undefined,
            color: terminalOpen ? "var(--taskbar-icon-hover)" : undefined,
          }}
          title="Terminal ( ` )"
        >
          <TerminalIcon size={16} strokeWidth={1.5} />
        </button>
        <div className="font-mono" style={{ fontSize: 8, color: "var(--text-tertiary)", letterSpacing: "0.12em", writingMode: "vertical-rl", transform: "rotate(180deg)", marginTop: 8 }}>
          rodriwu / v2
        </div>
      </div>

      {/* Middle: nothing (placeholder) */}
      <div className="flex-1" />

      {/* Bottom: system controls */}
      <div className="flex flex-col items-center gap-1.5">
        <button onClick={toggleTheme} className="taskbar-icon rounded-xl flex items-center justify-center" style={{ width: 38, height: 38 }} title={isDark ? "Switch to light" : "Switch to dark"}>
          {isDark ? <Sun size={15} strokeWidth={1.5} /> : <Moon size={15} strokeWidth={1.5} />}
        </button>

        <div className="relative">
          <button onClick={toggleWifi} className="taskbar-icon rounded-lg flex items-center justify-center" style={{ width: 34, height: 34 }} title="Socials">
            <Wifi size={14} strokeWidth={1.5} />
          </button>
          {showWifi && (
            <div className="absolute z-50 rounded-xl overflow-hidden"
              style={{ left: 42, bottom: 0, width: 200, background: "var(--window-bg)", border: "1px solid var(--window-border)", backdropFilter: "blur(32px)", boxShadow: "0 16px 48px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.1)" }}>
              <div className="font-mono text-[9px] uppercase tracking-widest px-3 pt-3 pb-1.5" style={{ color: "var(--text-tertiary)", letterSpacing: "0.14em" }}>Find me online</div>
              <div className="flex flex-col pb-2">
                {SOCIAL_LINKS.map((s) => (
                  <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2 transition-colors" style={{ textDecoration: "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--taskbar-icon-active-bg)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                    <div className="flex items-center justify-center rounded-lg flex-shrink-0"
                      style={{ width: 30, height: 30, background: s.id === "github" ? "rgba(255,255,255,0.08)" : `${s.color}22`, color: s.id === "github" ? "var(--text-primary)" : s.color, border: `1px solid ${s.id === "github" ? "var(--window-border)" : `${s.color}44`}` }}>
                      {s.icon}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-mono text-[10px] font-medium leading-tight" style={{ color: "var(--text-primary)" }}>{s.label}</span>
                      <span className="font-mono text-[9px] leading-tight truncate" style={{ color: "var(--text-tertiary)" }}>{s.handle}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <button onClick={toggleMute} className="taskbar-icon rounded-lg flex items-center justify-center" style={{ width: 34, height: 34 }} title={isMuted ? "Unmute" : "Mute"}>
          {isMuted ? <VolumeX size={14} strokeWidth={1.5} /> : <Volume2 size={14} strokeWidth={1.5} />}
        </button>

        <div className="w-6 my-1" style={{ borderTop: "1px solid var(--separator)" }} />

        <div className="relative flex flex-col items-center cursor-pointer" onClick={toggleCalendar}>
          <span className="font-mono text-[9px] tabular-nums" style={{ color: "var(--text-secondary)" }}>{time}</span>
          <span className="font-mono text-[8px]" style={{ color: "var(--text-tertiary)" }}>{date}</span>
          {showCalendar && (
            <div className="os-window absolute z-50 rounded-xl overflow-hidden"
              style={{ left: 56, bottom: 0, width: 220, padding: "12px", background: "var(--window-bg)", border: "1px solid var(--window-border)", backdropFilter: "blur(32px)", boxShadow: "0 16px 48px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.1)" }}>
              <MiniCalendar />
            </div>
          )}
        </div>

        <div className="relative">
          <button onClick={toggleLang} className="taskbar-icon rounded-md flex items-center justify-center font-mono"
            style={{ width: 34, height: 22, fontSize: "8px", letterSpacing: "0.08em", opacity: 0.55 }} title="Language / Idioma">
            <Globe size={10} strokeWidth={1.5} style={{ marginRight: 2 }} />
            {locale.toUpperCase()}
          </button>
          {showLang && (
            <div className="absolute z-50 rounded-xl overflow-hidden"
              style={{ left: 42, bottom: 0, background: "var(--window-bg)", border: "1px solid var(--window-border)", backdropFilter: "blur(32px)", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", padding: "4px", minWidth: 88 }}>
              {(["en", "es"] as const).map((lang) => (
                <button key={lang} onClick={() => { setLocale(lang); setShowLang(false); }}
                  className="taskbar-icon rounded-md w-full text-left font-mono"
                  style={{ display: "block", padding: "5px 10px", fontSize: "10px", color: locale === lang ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: locale === lang ? 600 : 400, background: locale === lang ? "var(--taskbar-icon-active-bg)" : "transparent" }}>
                  {lang === "en" ? "English" : "Español"}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

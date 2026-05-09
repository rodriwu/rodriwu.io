"use client";

import { useEffect, useRef, useState } from "react";
import { Sun, Moon, Wifi, Volume2, VolumeX, Terminal, FolderOpen, Globe, ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";

interface MinimizedWindowInfo {
  id: string;
  title: string;
  icon?: LucideIcon;
}

interface TaskbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
  minimizedWindows: MinimizedWindowInfo[];
  onRestoreWindow: (id: string) => void;
  onOpenTerminal: () => void;
  onOpenAbout: () => void;
  onOpenWork: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  locale: "en" | "es";
  onSetLocale: (l: "en" | "es") => void;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function MiniCalendar({ anchorRef }: { anchorRef: React.RefObject<HTMLDivElement> }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  // pad to full rows
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
    <div
      className="os-window absolute z-50 rounded-xl overflow-hidden"
      style={{
        left: 56,
        bottom: 0,
        width: 220,
        padding: "12px",
        background: "var(--window-bg)",
        border: "1px solid var(--window-border)",
        backdropFilter: "blur(32px)",
        boxShadow: "0 16px 48px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      {/* Month nav */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={prev} className="taskbar-icon rounded-md flex items-center justify-center" style={{ width: 24, height: 24 }}>
          <ChevronLeft size={13} strokeWidth={2} />
        </button>
        <span className="font-mono text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button onClick={next} className="taskbar-icon rounded-md flex items-center justify-center" style={{ width: 24, height: 24 }}>
          <ChevronRight size={13} strokeWidth={2} />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="flex items-center justify-center font-mono text-[9px]" style={{ color: "var(--text-tertiary)", height: 22 }}>
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
          return (
            <div
              key={i}
              className="flex items-center justify-center font-mono text-[10px] rounded-md"
              style={{
                height: 24,
                color: day ? (isToday ? "var(--window-bg)" : "var(--text-secondary)") : "transparent",
                background: isToday ? "var(--text-primary)" : "transparent",
                fontWeight: isToday ? 600 : 400,
              }}
            >
              {day ?? ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const WIFI_MESSAGES = [
  "Like what you see? Let's work together.",
  "Got a project in mind? rodriwuu@gmail.com",
  "Open to new opportunities — say hello.",
  "Good design starts with a conversation.",
  "Let's build something meaningful together.",
];

export default function Taskbar({
  isDark,
  onToggleTheme,
  minimizedWindows,
  onRestoreWindow,
  onOpenTerminal,
  onOpenAbout,
  isMuted,
  onToggleMute,
  onOpenWork,
  locale,
  onSetLocale,
}: TaskbarProps) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [showWifi, setShowWifi] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [wifiMsg] = useState(() => WIFI_MESSAGES[Math.floor(Math.random() * WIFI_MESSAGES.length)]);
  const calendarAnchor = useRef<HTMLDivElement>(null!);
  const calendarTimeout = useRef<ReturnType<typeof setTimeout>>();
  const wifiTimeout = useRef<ReturnType<typeof setTimeout>>();
  const volumeTimeout = useRef<ReturnType<typeof setTimeout>>();
  const langTimeout = useRef<ReturnType<typeof setTimeout>>();

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

  const openCalendar = () => { clearTimeout(calendarTimeout.current); setShowCalendar(true); };
  const closeCalendar = () => { calendarTimeout.current = setTimeout(() => setShowCalendar(false), 180); };
  const openWifi = () => { clearTimeout(wifiTimeout.current); setShowWifi(true); };
  const closeWifi = () => { wifiTimeout.current = setTimeout(() => setShowWifi(false), 180); };
  const openVolume = () => { clearTimeout(volumeTimeout.current); setShowVolume(true); };
  const closeVolume = () => { volumeTimeout.current = setTimeout(() => setShowVolume(false), 180); };
  const openLang = () => { clearTimeout(langTimeout.current); setShowLang(true); };
  const closeLang = () => { langTimeout.current = setTimeout(() => setShowLang(false), 180); };

  return (
    <div className="taskbar absolute left-0 top-0 bottom-0 z-40 w-14 flex flex-col items-center justify-between py-3">

      {/* Top — RM Monogram + Terminal */}
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={onOpenAbout}
          className="taskbar-icon flex items-center justify-center rounded-full overflow-hidden"
          style={{
            width: 36,
            height: 36,
            flexShrink: 0,
            backgroundImage: "url('/profile.png')",
            backgroundSize: "cover",
            backgroundPosition: "center 20%",
          }}
          title="About Me"
        />

        <div className="w-6" style={{ borderTop: "1px solid var(--separator)" }} />

        <button
          onClick={onOpenWork}
          className="taskbar-icon rounded-xl flex items-center justify-center"
          style={{ width: 38, height: 38 }}
          title="Work"
        >
          <FolderOpen size={16} strokeWidth={1.5} />
        </button>

        <button
          onClick={onOpenTerminal}
          className="taskbar-icon rounded-xl flex items-center justify-center"
          style={{ width: 38, height: 38 }}
          title="Terminal"
        >
          <Terminal size={16} strokeWidth={1.5} />
        </button>
      </div>

      {/* Middle — Minimized window thumbnails */}
      <div className="flex flex-col items-center gap-1.5 flex-1 justify-center py-3">
        {minimizedWindows.map((win) => {
          const Icon = win.icon;
          return (
            <button
              key={win.id}
              onClick={() => onRestoreWindow(win.id)}
              className="taskbar-icon rounded-lg flex flex-col items-center justify-center relative"
              style={{ width: 38, height: 38 }}
              title={`Restore — ${win.title}`}
            >
              {Icon && <Icon size={14} strokeWidth={1.5} />}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ background: "var(--taskbar-icon)" }} />
            </button>
          );
        })}
      </div>

      {/* Bottom — System tray */}
      <div className="flex flex-col items-center gap-1.5">
        <button
          onClick={onToggleTheme}
          className="taskbar-icon rounded-xl flex items-center justify-center"
          style={{ width: 38, height: 38 }}
          title={isDark ? "Switch to light" : "Switch to dark"}
        >
          {isDark ? <Sun size={15} strokeWidth={1.5} /> : <Moon size={15} strokeWidth={1.5} />}
        </button>

        {/* Wifi — easter egg */}
        <div className="relative" onMouseEnter={openWifi} onMouseLeave={closeWifi}>
          <button className="taskbar-icon rounded-lg flex items-center justify-center" style={{ width: 34, height: 34 }} title="Network">
            <Wifi size={14} strokeWidth={1.5} />
          </button>
          {showWifi && (
            <div
              className="absolute z-50 rounded-xl font-mono text-[10px] leading-snug whitespace-nowrap"
              style={{
                left: 42,
                bottom: 0,
                padding: "8px 12px",
                background: "var(--window-bg)",
                border: "1px solid var(--window-border)",
                color: "var(--text-secondary)",
                backdropFilter: "blur(32px)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.14)",
              }}
            >
              {wifiMsg}
            </div>
          )}
        </div>

        {/* Volume — mute toggle + track name on hover */}
        <div className="relative" onMouseEnter={openVolume} onMouseLeave={closeVolume}>
          <button
            onClick={onToggleMute}
            className="taskbar-icon rounded-lg flex items-center justify-center"
            style={{ width: 34, height: 34 }}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={14} strokeWidth={1.5} /> : <Volume2 size={14} strokeWidth={1.5} />}
          </button>
          {showVolume && (
            <div
              className="absolute z-50 rounded-xl font-mono text-[10px] leading-snug whitespace-nowrap"
              style={{
                left: 42,
                bottom: 0,
                padding: "8px 12px",
                background: "var(--window-bg)",
                border: "1px solid var(--window-border)",
                color: "var(--text-secondary)",
                backdropFilter: "blur(32px)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.14)",
              }}
            >
              <span style={{ color: "var(--text-tertiary)" }}>Now playing —</span>{" "}
              {isMuted ? "muted" : "Techno Jazz Ambient Mix"}
            </div>
          )}
        </div>

        <div className="w-6 my-1" style={{ borderTop: "1px solid var(--separator)" }} />

        {/* Clock + Calendar */}
        <div
          ref={calendarAnchor}
          className="relative flex flex-col items-center cursor-default"
          onMouseEnter={openCalendar}
          onMouseLeave={closeCalendar}
        >
          <span className="font-mono text-[9px] tabular-nums" style={{ color: "var(--text-secondary)" }}>{time}</span>
          <span className="font-mono text-[8px]" style={{ color: "var(--text-tertiary)" }}>{date}</span>

          {showCalendar && (
            <div onMouseEnter={openCalendar} onMouseLeave={closeCalendar}>
              <MiniCalendar anchorRef={calendarAnchor} />
            </div>
          )}
        </div>

        {/* Language — discreet text toggle at very bottom */}
        <div className="relative" onMouseEnter={openLang} onMouseLeave={closeLang}>
          <button
            className="taskbar-icon rounded-md flex items-center justify-center font-mono"
            style={{ width: 34, height: 22, fontSize: "8px", letterSpacing: "0.08em", opacity: 0.55 }}
            title="Language / Idioma"
          >
            {locale.toUpperCase()}
          </button>
          {showLang && (
            <div
              className="absolute z-50 rounded-xl overflow-hidden"
              style={{
                left: 42,
                bottom: 0,
                background: "var(--window-bg)",
                border: "1px solid var(--window-border)",
                backdropFilter: "blur(32px)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                padding: "4px",
                minWidth: 88,
              }}
              onMouseEnter={openLang}
              onMouseLeave={closeLang}
            >
              {(["en", "es"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => { onSetLocale(lang); setShowLang(false); }}
                  className="taskbar-icon rounded-md w-full text-left font-mono"
                  style={{
                    display: "block",
                    padding: "5px 10px",
                    fontSize: "10px",
                    color: locale === lang ? "var(--text-primary)" : "var(--text-secondary)",
                    fontWeight: locale === lang ? 600 : 400,
                    background: locale === lang ? "var(--taskbar-icon-active-bg)" : "transparent",
                  }}
                >
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

function TrayIcon({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <button className="taskbar-icon rounded-lg flex items-center justify-center" style={{ width: 34, height: 34 }} title={label}>
      <Icon size={14} strokeWidth={1.5} />
    </button>
  );
}

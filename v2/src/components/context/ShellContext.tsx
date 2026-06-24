"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

export type Locale = "en" | "es";

interface ShellState {
  isDark: boolean;
  toggleTheme: () => void;
  setIsDark: (v: boolean) => void;

  locale: Locale;
  setLocale: (l: Locale) => void;

  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  togglePlay: () => void;
  toggleMute: () => void;
  setMuted: (v: boolean) => void;
  setVolume: (v: number) => void;
  seek: (t: number) => void;

  terminalOpen: boolean;
  openTerminal: () => void;
  closeTerminal: () => void;
  toggleTerminal: () => void;
}

const ShellCtx = createContext<ShellState | null>(null);

export function useShell(): ShellState {
  const ctx = useContext(ShellCtx);
  if (!ctx) throw new Error("useShell must be used inside <ShellProvider>");
  return ctx;
}

export function ShellProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true);
  const [locale, setLocale] = useState<Locale>("en");
  const [terminalOpen, setTerminalOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.35);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  /* ── Theme — read once on mount; the actual class is already set by the
       blocking script in <head> (layout.tsx), so state just mirrors it. ── */
  useEffect(() => {
    const saved = localStorage.getItem("v2-theme");
    if (saved === "light") setIsDark(false);
    // dark is the default — no saved preference means stay dark
  }, []);

  /* Mirror state → DOM class. No localStorage write here — only explicit
     user actions persist a choice (see toggle/setIsDark in the value). */
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (isDark) document.documentElement.classList.remove("light");
    else document.documentElement.classList.add("light");
  }, [isDark]);


  /* ── Audio — created once, persists across navigation ── */
  useEffect(() => {
    if (audioRef.current) return;
    const audio = new Audio("https://695p4tymotasdrfh.public.blob.vercel-storage.com/ambient.mp4");
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;

    audio.addEventListener("timeupdate", () => setCurrentTime(audio.currentTime));
    audio.addEventListener("durationchange", () => {
      if (isFinite(audio.duration)) setDuration(audio.duration);
    });
    audio.addEventListener("loadedmetadata", () => {
      if (isFinite(audio.duration)) setDuration(audio.duration);
    });
    audio.addEventListener("play",  () => setIsPlaying(true));
    audio.addEventListener("pause", () => setIsPlaying(false));

    /* Restore position */
    const savedT = parseFloat(localStorage.getItem("v2-audioTime") ?? "0");
    if (isFinite(savedT) && savedT > 0) audio.currentTime = savedT;
  }, []);

  /* Mute by default on mobile */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 1024) setIsMuted(true);
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  /* Persist audio position every 5s while playing */
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      if (audioRef.current) localStorage.setItem("v2-audioTime", String(audioRef.current.currentTime));
    }, 5000);
    return () => clearInterval(id);
  }, [isPlaying]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  };

  const seek = (t: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = t;
    setCurrentTime(t);
  };

  const persistTheme = (dark: boolean) => {
    try { localStorage.setItem("v2-theme", dark ? "dark" : "light"); } catch {}
  };

  const value = useMemo<ShellState>(() => ({
    isDark,
    toggleTheme: () => setIsDark(d => { const n = !d; persistTheme(n); return n; }),
    setIsDark: (v: boolean) => { persistTheme(v); setIsDark(v); },
    locale,
    setLocale,
    isPlaying,
    isMuted,
    volume,
    currentTime,
    duration,
    togglePlay,
    toggleMute: () => setIsMuted(m => !m),
    setMuted: setIsMuted,
    setVolume: setVolumeState,
    seek,
    terminalOpen,
    openTerminal: () => setTerminalOpen(true),
    closeTerminal: () => setTerminalOpen(false),
    toggleTerminal: () => setTerminalOpen(o => !o),
  }), [isDark, locale, isPlaying, isMuted, volume, currentTime, duration, terminalOpen]);

  return <ShellCtx.Provider value={value}>{children}</ShellCtx.Provider>;
}

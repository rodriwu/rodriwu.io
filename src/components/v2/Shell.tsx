"use client";

import { useEffect, useState } from "react";
import MusicWidget from "@/components/MusicWidget";
import { ShellProvider, useShell } from "./context/ShellContext";
import Sidebar from "./Sidebar";

function ShellInner({ children }: { children: React.ReactNode }) {
  const {
    isDark,
    isPlaying, isMuted, volume, currentTime, duration,
    togglePlay, toggleMute, setVolume, seek,
  } = useShell();

  const [canvasW, setCanvasW] = useState(1440);
  const [canvasH, setCanvasH] = useState(900);

  useEffect(() => {
    const update = () => {
      setCanvasW(window.innerWidth);
      setCanvasH(window.innerHeight);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const isMobile = canvasW < 1024;

  return (
    <div
      className={isDark ? "" : "light"}
      style={{
        position: "fixed",
        inset: 0,
        background: isDark ? "#121212" : "#d2d0c8",
        transition: "background 0.6s ease",
        overflow: "hidden",
      }}
    >
      {/* Sidebar (desktop only) */}
      {!isMobile && <Sidebar />}

      {/* Page content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          paddingLeft: isMobile ? 0 : 56,
          paddingBottom: isMobile ? 60 : 0,
        }}
      >
        {children}
      </div>

      {/* Music widget */}
      {!isMuted && (
        <MusicWidget
          isPlaying={isPlaying}
          isMuted={isMuted}
          isDark={isDark}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          onTogglePlay={togglePlay}
          onToggleMute={toggleMute}
          onSeek={seek}
          onVolumeChange={setVolume}
          canvasW={canvasW}
          canvasH={canvasH}
        />
      )}
    </div>
  );
}

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <ShellProvider>
      <ShellInner>{children}</ShellInner>
    </ShellProvider>
  );
}

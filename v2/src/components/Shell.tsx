"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import MusicWidget from "@/components/MusicWidget";
import { ShellProvider, useShell } from "./context/ShellContext";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import Terminal from "./Terminal";
import CustomCursor from "./CustomCursor";
import UnavailableModal from "./UnavailableModal";

function ShellInner({ children }: { children: React.ReactNode }) {
  const {
    isDark,
    isPlaying, isMuted, volume, currentTime, duration,
    togglePlay, toggleMute, setVolume, seek,
  } = useShell();

  const [canvasW, setCanvasW] = useState(0);
  const [canvasH, setCanvasH] = useState(0);

  useLayoutEffect(() => {
    const update = () => {
      setCanvasW(window.innerWidth);
      setCanvasH(window.innerHeight);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* Apply the theme class to <html> so background/colors update globally */
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (isDark) document.documentElement.classList.remove("light");
    else document.documentElement.classList.add("light");
  }, [isDark]);

  const isMobile = canvasW < 1024;

  return (
    <>
      {/* Sidebar (desktop only) — fixed to viewport */}
      {!isMobile && <Sidebar />}

      {/* Mobile top nav */}
      {isMobile && <MobileNav />}

      {/* Page content scrolls naturally with body */}
      <div
        style={{
          paddingLeft: isMobile ? 0 : 56,
          paddingTop: isMobile ? 56 : 0,
        }}
      >
        {children}
      </div>

      {/* Terminal drawer */}
      <Terminal />

      {/* Unavailable case-study modal */}
      <UnavailableModal />

      {/* Custom cursor — fine-pointer devices only */}
      <CustomCursor />

      {/* Music widget — fixed bottom-right, desktop only */}
      {!isMobile && !isMuted && (
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
    </>
  );
}

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <ShellProvider>
      <ShellInner>{children}</ShellInner>
    </ShellProvider>
  );
}

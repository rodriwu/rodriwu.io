"use client";

import { useMotionValue, motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from "lucide-react";
import { useRef, useState, useCallback } from "react";

interface MusicWidgetProps {
  isPlaying: boolean;
  isMuted: boolean;
  isDark: boolean;
  currentTime: number;
  duration: number;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onSeek: (time: number) => void;
  initX: number;
  initY: number;
  canvasW: number;
  canvasH: number;
}

const BAR_HEIGHTS = [5, 9, 13, 8, 11, 6, 10, 4];

function fmt(s: number) {
  if (!isFinite(s) || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
}

const WIDGET_W  = 252;
const WIDGET_H  = 92;   // approximate rendered height
const TASKBAR_W = 56;
const PAD       = 10;   // gap from each edge

export default function MusicWidget({
  isPlaying, isMuted, isDark,
  currentTime, duration,
  onTogglePlay, onToggleMute, onSeek,
  initX, initY,
  canvasW, canvasH,
}: MusicWidgetProps) {
  const x = useMotionValue(initX);
  const y = useMotionValue(initY);

  // Squircle inner area = canvas minus 10px inset on each side
  const areaW = canvasW - 20;
  const areaH = canvasH - 20;

  const bounds = {
    left:   TASKBAR_W + PAD,
    right:  areaW - WIDGET_W - PAD,
    top:    PAD,
    bottom: areaH - WIDGET_H - PAD,
  };
  const trackRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [scrubbing, setScrubbing] = useState(false);
  const [scrubFrac, setScrubFrac] = useState(0);

  const active = isPlaying && !isMuted;
  const hasDuration = duration > 0 && isFinite(duration);
  const naturalProgress = hasDuration ? currentTime / duration : 0;
  const displayProgress = scrubbing ? scrubFrac : naturalProgress;
  const displayTime = scrubbing ? scrubFrac * duration : currentTime;

  const getFrac = useCallback((clientX: number) => {
    if (!trackRef.current) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (!hasDuration) return;

    const startFrac = getFrac(e.clientX);
    setScrubbing(true);
    setScrubFrac(startFrac);

    const onMove = (ev: MouseEvent) => {
      setScrubFrac(getFrac(ev.clientX));
    };
    const onUp = (ev: MouseEvent) => {
      const frac = getFrac(ev.clientX);
      onSeek(frac * duration);
      setScrubbing(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [hasDuration, duration, getFrac, onSeek]);

  /* ── Glass surface ── */
  const bg     = isDark ? "rgba(12,12,18,0.38)"        : "rgba(255,255,255,0.36)";
  const border = isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.055)";
  const shadow = isDark
    ? "0 4px 20px rgba(0,0,0,0.22), 0 1px 0 rgba(255,255,255,0.05) inset"
    : "0 4px 20px rgba(0,0,0,0.07), 0 1px 0 rgba(255,255,255,0.8) inset";

  const dimText  = isDark ? "rgba(255,255,255,0.3)"  : "rgba(0,0,0,0.32)";
  const mainText = isDark ? "rgba(255,255,255,0.82)" : "rgba(0,0,0,0.72)";
  const barColor = isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.22)";
  const trackBg  = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const fillBg   = isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.40)";
  const thumbBg  = isDark ? "rgba(255,255,255,0.90)" : "rgba(0,0,0,0.72)";

  const trackH = (hovering || scrubbing) ? 5 : 3;

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={bounds}
      style={{
        x, y,
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "auto",
        zIndex: 20,
        width: 252,
        cursor: scrubbing ? "grabbing" : "grab",
        borderRadius: 20,
        background: bg,
        border,
        boxShadow: shadow,
        backdropFilter: "blur(52px) saturate(160%)",
        WebkitBackdropFilter: "blur(52px) saturate(160%)",
      }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
    >
      <div style={{ padding: "11px 13px 9px" }}>
        {/* Top row */}
        <div className="flex items-center gap-2.5">
          {/* Equalizer bars */}
          <div className="flex items-end gap-px flex-shrink-0" style={{ height: 14 }}>
            {BAR_HEIGHTS.map((h, i) => (
              <motion.div
                key={i}
                style={{ width: 2, borderRadius: 2, background: barColor }}
                animate={{ height: active ? [h * 0.2, h, h * 0.45, h * 0.75, h * 0.3] : 2 }}
                transition={{ duration: 1.1 + i * 0.13, repeat: Infinity, ease: "easeInOut", delay: i * 0.08 }}
              />
            ))}
          </div>

          {/* Track info */}
          <div className="flex-1 min-w-0">
            <div className="font-mono font-medium truncate" style={{ fontSize: "10px", color: mainText, lineHeight: 1.4 }}>
              Jazz·Beats — lo·fi
            </div>
            <div className="font-mono" style={{ fontSize: "8px", color: dimText, lineHeight: 1.4 }}>
              ambient mix
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); onSeek(Math.max(0, currentTime - 15)); }}
              className="taskbar-icon rounded-lg flex items-center justify-center"
              style={{ width: 24, height: 24 }}
              title="−15s"
            >
              <SkipBack size={9} strokeWidth={2.5} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onTogglePlay(); }}
              className="taskbar-icon rounded-lg flex items-center justify-center"
              style={{ width: 26, height: 26 }}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={10} strokeWidth={2.5} /> : <Play size={10} strokeWidth={2.5} />}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onSeek(currentTime + 15); }}
              className="taskbar-icon rounded-lg flex items-center justify-center"
              style={{ width: 24, height: 24 }}
              title="+15s"
            >
              <SkipForward size={9} strokeWidth={2.5} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onToggleMute(); }}
              className="taskbar-icon rounded-lg flex items-center justify-center"
              style={{ width: 26, height: 26 }}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={10} strokeWidth={2.5} /> : <Volume2 size={10} strokeWidth={2.5} />}
            </button>
          </div>
        </div>

        {/* Scrubber */}
        <div style={{ marginTop: 9 }}>
          {/* Hit area — tall enough for easy grabbing, thumb lives here */}
          <div
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => { if (!scrubbing) setHovering(false); }}
            onMouseDown={handleMouseDown}
            style={{
              position: "relative",
              height: 16,
              display: "flex",
              alignItems: "center",
              cursor: hasDuration ? "pointer" : "default",
              userSelect: "none",
            }}
          >
            {/* Track bar — ref here for accurate position math */}
            <div
              ref={trackRef}
              style={{
                position: "absolute",
                left: 0, right: 0,
                height: hovering || scrubbing ? 4 : 3,
                borderRadius: 3,
                background: trackBg,
                overflow: "hidden",
                transition: "height 0.12s ease",
              }}
            >
              {/* Fill */}
              <div
                style={{
                  position: "absolute",
                  left: 0, top: 0, bottom: 0,
                  width: `${displayProgress * 100}%`,
                  background: fillBg,
                  transition: scrubbing ? "none" : "width 0.25s linear",
                }}
              />
            </div>

            {/* Thumb — sibling of track, free to overflow */}
            {hasDuration && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: `${displayProgress * 100}%`,
                  transform: "translate(-50%, -50%)",
                  width: hovering || scrubbing ? 11 : 8,
                  height: hovering || scrubbing ? 11 : 8,
                  borderRadius: "50%",
                  background: thumbBg,
                  boxShadow: isDark
                    ? "0 0 0 1.5px rgba(255,255,255,0.15), 0 1px 4px rgba(0,0,0,0.4)"
                    : "0 0 0 1.5px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.2)",
                  transition: scrubbing
                    ? "width 0.1s ease, height 0.1s ease"
                    : "left 0.25s linear, width 0.12s ease, height 0.12s ease",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              />
            )}
          </div>

          {/* Time stamps */}
          <div
            className="flex justify-between font-mono tabular-nums"
            style={{ marginTop: 1, fontSize: "8px", color: dimText }}
          >
            <span>{fmt(displayTime)}</span>
            {hasDuration && <span>{fmt(duration)}</span>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

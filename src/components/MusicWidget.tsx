"use client";

import { useMotionValue, motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Volume1, SkipBack, SkipForward } from "lucide-react";
import { useRef, useState, useCallback, useEffect } from "react";

interface MusicWidgetProps {
  isPlaying: boolean;
  isMuted: boolean;
  isDark: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (v: number) => void;
  initX: number;
  initY: number;
  canvasW: number;
  canvasH: number;
}

function fmt(s: number) {
  if (!isFinite(s) || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
}

const WIDGET_W  = 260;
const WIDGET_H  = 148;
const TASKBAR_W = 56;
const PAD       = 20;

/* ── Waveform canvas ── */
function WaveformCanvas({ active, isDark }: { active: boolean; isDark: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const t   = useRef(0);
  const raf = useRef(0);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t.current += active ? 0.04 : 0.008;
      const tc  = t.current;
      const spd = active ? 1 : 0.3;

      const wave = (amp: number, freq: number, phase: number, alpha: number, lw: number) => {
        ctx.beginPath(); ctx.lineWidth = lw; ctx.globalAlpha = alpha;
        for (let x = 0; x <= W; x++) {
          const modAmp = amp * (0.6 + 0.4 * Math.sin(x * 0.02 + tc * 0.5));
          const y = H / 2
            + modAmp * Math.sin(x * freq + tc * spd + phase)
            + (modAmp * 0.3) * Math.sin(x * freq * 2.3 + tc * spd * 1.4 + phase);
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        const grad = ctx.createLinearGradient(0, 0, W, 0);
        if (isDark) {
          grad.addColorStop(0,   "rgba(188,194,228,0.08)");
          grad.addColorStop(0.3, "rgba(195,200,235,1)");
          grad.addColorStop(0.7, "rgba(172,180,218,1)");
          grad.addColorStop(1,   "rgba(188,194,228,0.08)");
        } else {
          grad.addColorStop(0,   "rgba(46,52,78,0.08)");
          grad.addColorStop(0.3, "rgba(44,50,76,0.88)");
          grad.addColorStop(0.7, "rgba(60,66,94,0.88)");
          grad.addColorStop(1,   "rgba(46,52,78,0.08)");
        }
        ctx.strokeStyle = grad; ctx.stroke();
      };

      wave(7, 0.045, 0,   0.88, 1.5);
      wave(4, 0.08,  1.5, 0.32, 1.0);
      wave(3, 0.025, 3.0, 0.15, 0.8);

      ctx.beginPath();
      ctx.globalAlpha = isDark ? 0.10 : 0.07;
      ctx.strokeStyle = isDark ? "rgba(205,210,240,1)" : "rgba(38,44,70,1)";
      ctx.lineWidth = 0.5;
      ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.stroke();

      ctx.globalAlpha = isDark ? 0.05 : 0.04;
      for (let x = 0; x < W; x += 16) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }

      ctx.globalAlpha = 1;
      raf.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf.current);
  }, [active, isDark]);

  return (
    <canvas ref={ref} width={232} height={38}
      style={{ width: "100%", height: 38, display: "block" }} />
  );
}

/* ── Scrubber ── */
function Scrubber({ value, onChange, onCommit, isDark }: {
  value: number; onChange: (v: number) => void; onCommit?: (v: number) => void; isDark: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [dragging, setDragging] = useState(false);

  const getFrac = useCallback((clientX: number) => {
    if (!trackRef.current) return 0;
    const r = trackRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - r.left) / r.width));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); e.preventDefault();
    setDragging(true); onChange(getFrac(e.clientX));
    const onMove = (ev: MouseEvent) => onChange(getFrac(ev.clientX));
    const onUp   = (ev: MouseEvent) => {
      const f = getFrac(ev.clientX); onChange(f); onCommit?.(f);
      setDragging(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [getFrac, onChange, onCommit]);

  const active  = hovering || dragging;
  const h       = active ? 4 : 2.5;
  const accent  = isDark ? "rgba(255,255,255,0.80)"  : "rgba(0,0,0,0.60)";
  const trackBg = isDark ? "rgba(255,255,255,0.10)"  : "rgba(0,0,0,0.08)";
  const fill    = isDark
    ? "linear-gradient(90deg, rgba(195,200,232,0.45), rgba(255,255,255,0.80))"
    : "linear-gradient(90deg, rgba(38,44,70,0.28), rgba(0,0,0,0.60))";

  return (
    <div onMouseEnter={() => setHovering(true)} onMouseLeave={() => { if (!dragging) setHovering(false); }}
      onMouseDown={handleMouseDown}
      style={{ position: "relative", height: 16, display: "flex", alignItems: "center", cursor: "pointer", userSelect: "none" }}>
      <div ref={trackRef} style={{
        position: "absolute", left: 0, right: 0, height: h, borderRadius: 4,
        background: trackBg, transition: "height 0.1s ease", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${value * 100}%`, background: fill, transition: dragging ? "none" : "width 0.12s ease" }} />
      </div>
      <div style={{
        position: "absolute", top: "50%", left: `${value * 100}%`,
        transform: "translate(-50%,-50%)", width: active ? 10 : 7, height: active ? 10 : 7,
        borderRadius: "50%", background: accent,
        boxShadow: isDark ? "0 1px 4px rgba(0,0,0,0.55)" : "0 1px 3px rgba(0,0,0,0.22)",
        transition: dragging ? "width 0.08s,height 0.08s" : "left 0.12s ease,width 0.1s,height 0.1s",
        pointerEvents: "none", zIndex: 1,
      }} />
    </div>
  );
}

export default function MusicWidget({
  isPlaying, isMuted, isDark,
  currentTime, duration, volume,
  onTogglePlay, onToggleMute, onSeek, onVolumeChange,
  initX, initY, canvasW, canvasH,
}: MusicWidgetProps) {
  const isMobile = canvasW < 1024;

  const x = useMotionValue(initX);
  const y = useMotionValue(initY);

  const inset = isMobile ? 0 : 10;
  const areaW = canvasW - inset * 2;
  const areaH = canvasH - inset * 2;

  const bounds = {
    left:   TASKBAR_W + PAD,
    right:  areaW - WIDGET_W - PAD,
    top:    PAD,
    bottom: areaH - WIDGET_H - PAD,
  };

  const active      = isPlaying && !isMuted;
  const hasDuration = duration > 0 && isFinite(duration);

  const [scrubbing, setScrubbing] = useState(false);
  const [scrubFrac, setScrubFrac] = useState(0);
  const displayProgress = scrubbing ? scrubFrac : (hasDuration ? currentTime / duration : 0);
  const displayTime     = scrubbing ? scrubFrac * duration : currentTime;

  const VolIcon = isMuted ? VolumeX : volume < 0.4 ? Volume1 : Volume2;

  // OS-adaptive neutral liquid glass tokens
  const bg       = isDark ? "rgba(12,12,18,0.58)"                   : "rgba(252,251,248,0.52)";
  const border   = isDark ? "rgba(255,255,255,0.10)"                 : "rgba(0,0,0,0.07)";
  const hiShadow = isDark ? "inset 0 1px 0 rgba(255,255,255,0.12)"  : "inset 0 1px 0 rgba(255,255,255,0.92)";
  const drop     = isDark ? "0 8px 32px rgba(0,0,0,0.50)"           : "0 4px 16px rgba(0,0,0,0.06)";
  const textHi   = isDark ? "rgba(255,255,255,0.88)"                 : "rgba(0,0,0,0.82)";
  const textMed  = isDark ? "rgba(255,255,255,0.42)"                 : "rgba(0,0,0,0.38)";
  const textLow  = isDark ? "rgba(255,255,255,0.24)"                 : "rgba(0,0,0,0.20)";
  const waveBg   = isDark ? "rgba(255,255,255,0.04)"                 : "rgba(0,0,0,0.03)";
  const waveB    = isDark ? "rgba(255,255,255,0.07)"                 : "rgba(0,0,0,0.06)";
  const btnBg    = isDark ? "rgba(255,255,255,0.09)"                 : "rgba(0,0,0,0.05)";
  const btnB     = isDark ? "rgba(255,255,255,0.15)"                 : "rgba(0,0,0,0.09)";
  const btnClr   = isDark ? "rgba(255,255,255,0.85)"                 : "rgba(0,0,0,0.72)";
  const iconClr  = isDark ? "rgba(255,255,255,0.46)"                 : "rgba(0,0,0,0.38)";

  const controls = [
    { icon: SkipBack,                 size: 9,  title: "−15s",                    onClick: () => onSeek(Math.max(0, currentTime - 15)), main: false },
    { icon: isPlaying ? Pause : Play, size: 10, title: isPlaying ? "Pause" : "Play", onClick: onTogglePlay,                             main: true  },
    { icon: SkipForward,              size: 9,  title: "+15s",                    onClick: () => onSeek(currentTime + 15),               main: false },
    { icon: VolIcon,                  size: 9,  title: isMuted ? "Unmute" : "Mute",  onClick: onToggleMute,                             main: false },
  ];

  return (
    <motion.div
      drag dragMomentum={false} dragElastic={0} dragConstraints={bounds}
      style={{
        x, y, position: "absolute", top: 0, left: 0,
        pointerEvents: "auto", zIndex: 20,
        width: WIDGET_W,
        cursor: scrubbing ? "grabbing" : "grab",
      }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        animate={{ opacity: active ? [0.15, 0.30, 0.15] : 0.06 }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", inset: -2, borderRadius: 22, boxShadow: isDark ? "0 0 20px rgba(255,255,255,0.08)" : "0 0 16px rgba(0,0,0,0.05)", pointerEvents: "none" }}
      />

      <div style={{
        position: "relative", borderRadius: 20, overflow: "hidden",
        background: bg, border: `1px solid ${border}`,
        boxShadow: `${drop}, ${hiShadow}`,
        backdropFilter: "blur(52px) saturate(180%)",
        WebkitBackdropFilter: "blur(52px) saturate(180%)",
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 10, borderRadius: 20,
          backgroundImage: isDark
            ? "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.016) 3px,rgba(255,255,255,0.016) 4px)"
            : "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.010) 3px,rgba(0,0,0,0.010) 4px)",
        }} />

        <div style={{ padding: "10px 12px 11px" }}>

          {/* Waveform */}
          <div style={{ position: "relative", borderRadius: 8, overflow: "hidden", marginBottom: 9, background: waveBg, border: `1px solid ${waveB}` }}>
            <div style={{ position: "absolute", top: 4, left: 6, zIndex: 2, pointerEvents: "none", display: "flex", alignItems: "center", gap: 4 }}>
              <motion.div animate={{ opacity: active ? [1, 0.3, 1] : 0.3 }} transition={{ duration: 1.1, repeat: Infinity }}
                style={{ width: 4, height: 4, borderRadius: "50%", background: textMed }} />
              <span style={{ fontFamily: "monospace", fontSize: 7, color: textLow, letterSpacing: "0.12em" }}>
                {active ? "SND·LIVE" : "SND·IDLE"}
              </span>
            </div>
            <div style={{ position: "absolute", top: 4, right: 6, zIndex: 2, pointerEvents: "none", fontFamily: "monospace", fontSize: 7, color: textLow, letterSpacing: "0.10em" }}>
              44.1kHz
            </div>
            <WaveformCanvas active={active} isDark={isDark} />
          </div>

          {/* Track info + controls */}
          <div className="flex items-center gap-2">
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 600, color: textHi, letterSpacing: "0.04em", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                Jazz·Beats — lo·fi
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 8, color: textMed, letterSpacing: "0.06em", lineHeight: 1.4 }}>
                ambient mix
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
              {controls.map(({ icon: Icon, size, title, onClick, main }, i) => (
                <motion.button key={i} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); onClick(); }} title={title}
                  style={{ width: main ? 26 : 22, height: main ? 26 : 22, borderRadius: main ? 8 : 6, border: main ? `1px solid ${btnB}` : "none", background: main ? btnBg : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: main ? btnClr : iconClr, flexShrink: 0 }}>
                  <Icon size={size} strokeWidth={2.2} />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div style={{ marginTop: 8 }}>
            <Scrubber value={displayProgress} isDark={isDark}
              onChange={(f) => { setScrubbing(true); setScrubFrac(f); }}
              onCommit={(f) => { onSeek(f * duration); setScrubbing(false); }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: 8, color: textLow, letterSpacing: "0.06em", marginTop: 2 }}>
              <span>{fmt(displayTime)}</span>
              {hasDuration && <span>{fmt(duration)}</span>}
            </div>
          </div>

          {/* Volume */}
          <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
            <VolIcon size={9} strokeWidth={2} style={{ color: iconClr, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <Scrubber value={isMuted ? 0 : volume} isDark={isDark} onChange={onVolumeChange} />
            </div>
            <span style={{ fontFamily: "monospace", fontSize: 7, color: textLow, width: 22, textAlign: "right", flexShrink: 0 }}>
              {isMuted ? "0%" : `${Math.round(volume * 100)}%`}
            </span>
          </div>

        </div>

        <motion.div
          animate={{ scaleX: active ? [0.3, 1, 0.3] : 0.2 }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: isDark ? "linear-gradient(90deg,transparent,rgba(255,255,255,0.16),transparent)" : "linear-gradient(90deg,transparent,rgba(0,0,0,0.08),transparent)", transformOrigin: "center", pointerEvents: "none" }}
        />
      </div>
    </motion.div>
  );
}

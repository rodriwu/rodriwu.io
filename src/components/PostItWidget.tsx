"use client";

import { useMotionValue, motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

interface PostItWidgetProps {
  isDark: boolean;
  initX: number;
  initY: number;
  canvasW: number;
  canvasH: number;
  widgetId?: string;
  onRegister?: (id: string, getRect: () => { x: number; y: number; w: number; h: number }, setPos: (x: number, y: number) => void) => void;
  onDragMove?: (id: string) => void;
}

const W = 210;
const H = 192;
const TASKBAR_W = 56;
const PAD = 20;

export default function PostItWidget({ isDark, initX, initY, canvasW, canvasH, widgetId, onRegister, onDragMove }: PostItWidgetProps) {
  const x = useMotionValue(initX);
  const y = useMotionValue(initY);
  const [hovered, setHovered] = useState(false);

  const whRef = useRef({ w: W, h: H });

  useEffect(() => {
    if (widgetId && onRegister) {
      onRegister(
        widgetId,
        () => ({ x: x.get(), y: y.get(), ...whRef.current }),
        (nx: number, ny: number) => { x.set(nx); y.set(ny); }
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widgetId]);

  const inset = canvasW >= 1024 ? 10 : 0;
  const areaW = canvasW - inset * 2;
  const areaH = canvasH - inset * 2;

  const bounds = {
    left:   TASKBAR_W + PAD,
    right:  Math.max(TASKBAR_W + PAD, areaW - W - PAD),
    top:    PAD,
    bottom: areaH - H - PAD,
  };

  // Post-it yellow in light, soft lavender (#CBC3E3) in dark
  const noteBg   = isDark ? "#CBC3E3" : "#fef08a";
  const noteTop  = isDark ? "#B8AED6" : "#fde047";
  const noteText = isDark ? "rgba(38,28,58,0.88)" : "rgba(60,40,10,0.85)";
  const noteSub  = isDark ? "rgba(55,40,80,0.52)" : "rgba(80,55,10,0.50)";
  const pinColor = isDark ? "#7c5fa0" : "#ca8a04";
  const lineClr  = isDark ? "rgba(38,28,58,0.07)" : "rgba(60,40,10,0.06)";
  const shadow   = isDark
    ? "0 4px 16px rgba(0,0,0,0.30), 0 1px 5px rgba(0,0,0,0.14)"
    : "0 2px 10px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)";

  return (
    <motion.div
      drag dragMomentum={false} dragElastic={0} dragConstraints={bounds}
      onDrag={widgetId && onDragMove ? () => onDragMove(widgetId) : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ x, y, position: "absolute", top: 0, left: 0, pointerEvents: "auto", zIndex: 28, width: W, height: H, cursor: "grab" }}
      initial={{ opacity: 0, scale: 0.92, rotate: -2.5 }}
      animate={{ opacity: 1, scale: 1, rotate: -2.5 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        animate={{ scale: hovered ? 1.02 : 1, rotate: hovered ? -1 : 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: "100%", height: "100%", borderRadius: 4,
          background: noteBg,
          boxShadow: shadow,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Ruled lines */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{
            position: "absolute", left: 0, right: 0,
            top: 48 + i * 20, height: 1,
            background: lineClr,
          }} />
        ))}

        {/* Top tape / header strip */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 32,
          background: noteTop,
          borderBottom: `1px solid ${isDark ? "rgba(180,130,255,0.15)" : "rgba(180,140,0,0.15)"}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 10px",
        }}>
          {/* Pin dot */}
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: pinColor, boxShadow: `0 1px 3px rgba(0,0,0,0.3)` }} />
          <span style={{ fontFamily: "sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: "0.06em", color: noteSub }}>
            note.txt
          </span>
        </div>

        {/* Body text */}
        <div style={{ position: "absolute", top: 40, left: 14, right: 14, bottom: 12 }}>
          <p style={{
            fontFamily: "sans-serif", fontWeight: 600,
            fontSize: 15, lineHeight: 1.3,
            color: noteText,
            margin: 0, marginBottom: 8,
          }}>
            Hey, welcome! 👋
          </p>
          <p style={{
            fontFamily: "sans-serif", fontWeight: 400, fontSize: 13, lineHeight: 1.6,
            color: noteSub, margin: 0,
          }}>
            Feel free to poke around — drag the cards, open apps, toggle the theme, play some music.
          </p>
          <p style={{
            fontFamily: "sans-serif", fontWeight: 400, fontSize: 12,
            color: noteSub, margin: 0, marginTop: 10,
            opacity: 0.7,
          }}>
            — Rodrigo
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

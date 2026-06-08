"use client";

import { useMotionValue, motion } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";

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
const LONG_PRESS_MS = 400;

export default function PostItWidget({ isDark, initX, initY, canvasW, canvasH, widgetId, onRegister, onDragMove }: PostItWidgetProps) {
  const x = useMotionValue(initX);
  const y = useMotionValue(initY);
  const [hovered, setHovered] = useState(false);

  const isMobile = canvasW < 1024;

  // ── Long-press wiggle (mobile only, visual feedback) ──
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [wiggle, setWiggle] = useState(false);

  const clearLongPress = useCallback(() => {
    if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; }
  }, []);

  const handlePointerDown = useCallback(() => {
    if (!isMobile) return;
    clearLongPress();
    longPressTimer.current = setTimeout(() => setWiggle(true), LONG_PRESS_MS);
  }, [isMobile, clearLongPress]);

  const handlePointerUp = useCallback(() => {
    clearLongPress();
    if (isMobile) setWiggle(false);
  }, [isMobile, clearLongPress]);

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
      drag={isMobile ? false : true}
      dragMomentum={false} dragElastic={0}
      onDrag={!isMobile && widgetId && onDragMove ? () => onDragMove(widgetId) : undefined}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...(isMobile ? {} : { x, y }),
        position: isMobile ? "relative" : "absolute",
        top: 0, left: 0, pointerEvents: "auto", zIndex: 28,
        width: W, height: H,
        cursor: isMobile ? "default" : "grab",
        touchAction: isMobile ? "pan-y" : "none",
        flexShrink: 0,
      }}
      initial={{ opacity: 0, scale: 0.92, rotate: -2.5 }}
      animate={{ opacity: 1, scale: wiggle ? 1.03 : 1, rotate: wiggle ? [-3, -2] : -2.5 }}
      transition={wiggle ? { rotate: { repeat: Infinity, repeatType: "reverse", duration: 0.15 }, scale: { duration: 0.15 } } : { duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
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

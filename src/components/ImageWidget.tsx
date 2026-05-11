"use client";

import { useMotionValue, motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

interface ImageWidgetProps {
  isDark: boolean;
  src?: string;
  gradient?: string;   // shown when no src
  initX: number;
  initY: number;
  canvasW: number;
  canvasH: number;
  title?: string;
  subtitle?: string;
  w?: number;
  h?: number;
  rotate?: number;
  index?: number;      // gallery tag numerator
  total?: number;      // gallery tag denominator
  desktopOnly?: boolean;
  showDots?: boolean;
  widgetId?: string;
  onRegister?: (id: string, getRect: () => { x: number; y: number; w: number; h: number }, setPos: (x: number, y: number) => void) => void;
  onDragMove?: (id: string) => void;
}

const DEFAULT_W = 380;
const DEFAULT_H = 285; // 4:3
const TASKBAR_W = 56;
const PAD       = 20;

export default function ImageWidget({
  isDark, src, gradient,
  initX, initY, canvasW, canvasH,
  title = "Project", subtitle = "Case Study",
  w, h, rotate = 0, index = 1, total = 4,
  desktopOnly = false, showDots = true,
  widgetId, onRegister, onDragMove,
}: ImageWidgetProps) {
  const isMobile = canvasW < 1024;
  const isPhone  = canvasW < 768;

  if (isPhone && desktopOnly) return null;

  // Mobile: scale down proportionally, cap at 300px wide
  const mobScale = Math.min(1, (canvasW - TASKBAR_W - PAD * 2) / (w ?? DEFAULT_W));
  const desktopW = w ?? DEFAULT_W;
  const desktopH = h ?? DEFAULT_H;
  const W = isMobile ? Math.round(desktopW * mobScale) : desktopW;
  const H = isMobile ? Math.round(desktopH * mobScale) : desktopH;

  const x = useMotionValue(initX);
  const y = useMotionValue(initY);

  const whRef = useRef({ w: W, h: H });
  useEffect(() => { whRef.current = { w: W, h: H }; }, [W, H]);

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

  const inset = isMobile ? 0 : 10;
  const areaW = canvasW - inset * 2;
  const areaH = canvasH - inset * 2;

  const bounds = {
    left:   TASKBAR_W + PAD,
    right:  Math.max(TASKBAR_W + PAD, areaW - W - PAD),
    top:    PAD,
    bottom: areaH - H - PAD,
  };

  const [hovered, setHovered] = useState(false);

  const dropShadow = isDark
    ? "0 20px 56px rgba(0,0,0,0.48), 0 4px 14px rgba(0,0,0,0.28)"
    : "0 3px 14px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)";

  return (
    <motion.div
      drag dragMomentum={false} dragElastic={0} dragConstraints={bounds}
      onDrag={widgetId && onDragMove ? () => onDragMove(widgetId) : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ x, y, position: "absolute", top: 0, left: 0, pointerEvents: "auto", zIndex: 19, width: W, height: H, cursor: "grab" }}
      initial={{ opacity: 0, scale: 0.94, rotate }}
      animate={{ opacity: 1, scale: 1, rotate }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Drop shadow */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0.65 }}
        style={{ position: "absolute", inset: 0, borderRadius: 16, boxShadow: dropShadow, pointerEvents: "none" }}
      />

      {/* Card */}
      <motion.div
        animate={{ scale: hovered ? 1.012 : 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: "100%", height: "100%", borderRadius: 16, overflow: "hidden",
          border: isDark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(0,0,0,0.06)",
          boxShadow: isDark ? "inset 0 1px 0 rgba(255,255,255,0.12)" : "inset 0 1px 0 rgba(255,255,255,0.88)",
          position: "relative",
        }}
      >
        {/* Image or gradient placeholder */}
        {src ? (
          <motion.img
            src={src} alt={title}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block" }}
            animate={{ scale: hovered ? 1.05 : 1 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          />
        ) : (
          <motion.div
            style={{ position: "absolute", inset: 0, background: gradient ?? "linear-gradient(145deg, #1e2530, #2e3540)" }}
            animate={{ scale: hovered ? 1.03 : 1 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          />
        )}

        {/* Bottom gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.28) 38%, transparent 62%)", pointerEvents: "none" }} />
        {/* Top vignette */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, transparent 24%)", pointerEvents: "none" }} />

        {/* Hover scanlines */}
        <AnimatePresence>
          {hovered && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.014) 3px,rgba(255,255,255,0.014) 4px)", pointerEvents: "none" }}
            />
          )}
        </AnimatePresence>

        {/* Drag handle — 3-dot indicator */}
        <div style={{
          position: "absolute", top: 10, right: 10, zIndex: 4,
          display: "flex", gap: 3, alignItems: "center",
          padding: "5px 8px", borderRadius: 6,
          background: "rgba(0,0,0,0.38)",
          backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.12)",
          cursor: "grab",
        }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.70)", flexShrink: 0 }} />
          ))}
        </div>

        {/* Text overlay */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 12px 11px", zIndex: 4 }}>
          <div style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: W < 220 ? 12 : 14, letterSpacing: "-0.02em", color: "rgba(255,255,255,0.95)", lineHeight: 1.2, marginBottom: 2 }}>
            {title}
          </div>
          <div style={{ fontFamily: "monospace", fontSize: 7, letterSpacing: "0.13em", color: "rgba(255,255,255,0.48)", textTransform: "uppercase", marginBottom: 8 }}>
            {subtitle}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {showDots ? (
              <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
                {Array.from({ length: total }).map((_, i) => (
                  <div key={i} style={{
                    width: i === index - 1 ? 12 : 4, height: 4, borderRadius: 3,
                    background: i === index - 1 ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.22)",
                    transition: "all 0.2s ease",
                  }} />
                ))}
              </div>
            ) : <div />}
            <AnimatePresence>
              {hovered && (
                <motion.span
                  initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 3 }}
                  transition={{ duration: 0.2 }}
                  style={{ fontFamily: "monospace", fontSize: 7, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.40)" }}>
                  View →
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

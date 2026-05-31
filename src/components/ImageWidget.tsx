"use client";

import { useMotionValue, motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";

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
  onClickOpen?: () => void;
}

const DEFAULT_W = 380;
const DEFAULT_H = 285; // 4:3
const TASKBAR_W = 56;
const PAD       = 20;
const LONG_PRESS_MS = 400;

export default function ImageWidget({
  isDark, src, gradient,
  initX, initY, canvasW, canvasH,
  title = "Project", subtitle = "Case Study",
  w, h, rotate = 0, index = 1, total = 4,
  desktopOnly = false, showDots = true,
  widgetId, onRegister, onDragMove, onClickOpen,
}: ImageWidgetProps) {
  const isMobile = canvasW < 1024;
  const isPhone  = canvasW < 768;

  if (isPhone && desktopOnly) return null;

  const effectiveTaskbarW = isPhone ? 0 : TASKBAR_W;
  // On mobile, use the w/h as passed (page.tsx controls sizing)
  const W = w ?? DEFAULT_W;
  const H = h ?? DEFAULT_H;

  const x = useMotionValue(initX);
  const y = useMotionValue(initY);

  // ── Long-press wiggle (mobile only, iOS-style visual feedback) ──
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [wiggle, setWiggle] = useState(false);

  const clearLongPress = useCallback(() => {
    if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; }
  }, []);

  const handlePointerDown = useCallback(() => {
    if (!isMobile) return;
    clearLongPress();
    longPressTimer.current = setTimeout(() => {
      setWiggle(true);
    }, LONG_PRESS_MS);
  }, [isMobile, clearLongPress]);

  const handlePointerUp = useCallback(() => {
    clearLongPress();
    if (isMobile) setWiggle(false);
  }, [isMobile, clearLongPress]);

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

  const [hovered, setHovered] = useState(false);

  const dropShadow = isDark
    ? "0 20px 56px rgba(0,0,0,0.48), 0 4px 14px rgba(0,0,0,0.28)"
    : "0 3px 14px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)";

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
      onTap={onClickOpen}
      style={{
        ...(isMobile ? {} : { x, y }),
        position: isMobile ? "relative" : "absolute",
        top: 0, left: 0, pointerEvents: "auto", zIndex: 19,
        width: W, height: H,
        cursor: isMobile ? "default" : "grab",
        touchAction: isMobile ? "pan-y" : "none",
        flexShrink: 0,
      }}
      initial={{ opacity: 0, scale: 0.94, rotate }}
      animate={{ opacity: 1, scale: wiggle ? 1.03 : 1, rotate: wiggle ? [rotate - 0.8, rotate + 0.8] : rotate }}
      transition={wiggle ? { rotate: { repeat: Infinity, repeatType: "reverse", duration: 0.15 }, scale: { duration: 0.15 } } : { duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
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
          isolation: "isolate",
        }}
      >
        {/* Image or gradient placeholder */}
        {src ? (
          <motion.img
            src={src} alt={title}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
            animate={{ scale: hovered ? 1.02 : 1 }}
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
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: W < 220 ? 12 : 14, letterSpacing: "-0.02em", color: "rgba(255,255,255,0.95)", lineHeight: 1.2 }}>
              {title}
            </div>
            <AnimatePresence>
              {hovered && (
                <motion.span
                  initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 3 }}
                  transition={{ duration: 0.2 }}
                  style={{ fontFamily: "monospace", fontSize: 7, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.40)", flexShrink: 0, marginLeft: 8 }}>
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

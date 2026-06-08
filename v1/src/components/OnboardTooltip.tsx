"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface OnboardTooltipProps {
  isDark: boolean;
  canvasW: number;
  onDismiss: () => void;
  onOpenWork: () => void;
}

const WORK_BTN_Y = 84;
const TASKBAR_W = 64;

export default function OnboardTooltip({ isDark, canvasW, onDismiss, onOpenWork }: OnboardTooltipProps) {
  const isMobile = canvasW < 1024;

  useEffect(() => {
    const t = setTimeout(onDismiss, 8000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const bg      = isDark ? "rgba(20,18,30,0.97)"         : "rgba(240,237,228,0.98)";
  const border  = isDark ? "rgba(255,255,255,0.10)"       : "rgba(0,0,20,0.09)";
  const shadow  = isDark
    ? "0 8px 32px rgba(0,0,0,0.50), 0 2px 8px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.06)"
    : "0 4px 20px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.85)";
  const headClr = isDark ? "rgba(255,255,255,0.90)"       : "rgba(10,12,35,0.88)";
  const subClr  = isDark ? "rgba(255,255,255,0.40)"       : "rgba(10,12,35,0.40)";
  const dotClr  = isDark ? "rgba(140,100,255,0.95)"       : "rgba(90,50,210,0.90)";
  const xClr    = isDark ? "rgba(255,255,255,0.22)"       : "rgba(0,0,20,0.22)";

  const tooltipBox = (text: string) => (
    <button
      onClick={() => { onOpenWork(); onDismiss(); }}
      style={{
        background: bg,
        backdropFilter: "blur(40px) saturate(180%)",
        WebkitBackdropFilter: "blur(40px) saturate(180%)",
        border: `1px solid ${border}`,
        borderRadius: 12,
        padding: "11px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 5,
        cursor: "pointer",
        boxShadow: shadow,
        minWidth: 216,
        textAlign: "left",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <motion.div
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: 6, height: 6, borderRadius: "50%", background: dotClr, flexShrink: 0 }}
          />
          <span style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", color: headClr }}>
            EXPLORE MY WORK
          </span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDismiss(); }}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: xClr, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <X size={10} strokeWidth={2.5} />
        </button>
      </div>
      <span style={{ fontFamily: "sans-serif", fontSize: 12, color: subClr, paddingLeft: 13 }}>
        {text}
      </span>
    </button>
  );

  if (isMobile) {
    return (
      <motion.div
        key="onboard-mobile"
        initial={{ opacity: 0, y: 8, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 5, scale: 0.96 }}
        transition={{ type: "spring", damping: 22, stiffness: 300, delay: 0.3 }}
        style={{
          position: "absolute",
          bottom: 100,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 55,
          pointerEvents: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {tooltipBox("Tap Work in the dock below")}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: -1 }}>
          <div style={{ width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: `8px solid ${border}` }} />
          <div style={{ width: 0, height: 0, borderLeft: "7px solid transparent", borderRight: "7px solid transparent", borderTop: `7px solid ${bg}`, marginTop: -8 }} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="onboard-desktop"
      initial={{ opacity: 0, x: -8, scale: 0.94 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -5, scale: 0.96 }}
      transition={{ type: "spring", damping: 22, stiffness: 300, delay: 0.25 }}
      style={{
        position: "absolute",
        left: TASKBAR_W,
        top: WORK_BTN_Y - 36,
        zIndex: 55,
        pointerEvents: "auto",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Left-pointing arrow */}
      <div style={{ position: "relative", flexShrink: 0, width: 8, height: 16 }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: 0, height: 0, borderTop: "8px solid transparent", borderBottom: "8px solid transparent", borderRight: `8px solid ${border}` }} />
        <div style={{ position: "absolute", top: 1, left: 1, width: 0, height: 0, borderTop: "7px solid transparent", borderBottom: "7px solid transparent", borderRight: `7px solid ${bg}` }} />
      </div>
      {tooltipBox("Open the folder above to see case studies")}
    </motion.div>
  );
}

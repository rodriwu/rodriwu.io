"use client";

import { motion } from "framer-motion";
import { useShell } from "../context/ShellContext";

const T = {
  en: {
    label: "HELLO.exe",
    greeting: "Hello! ✨",
    line1: "I'm a Designer",
    body: "and I've been creating digital experiences that resonate with people for over half a decade.",
    scroll: "scroll →",
    statusLabel: "SYS·STATUS",
    statusValue: "OPEN_TO_WORK",
  },
  es: {
    label: "HOLA.exe",
    greeting: "¡Hola! ✨",
    line1: "Soy un Diseñador",
    body: "y llevo más de media década creando experiencias digitales que conectan con las personas.",
    scroll: "scroll →",
    statusLabel: "SYS·ESTADO",
    statusValue: "DISPONIBLE",
  },
};

export default function HeroPanel({ index, total }: { index: number; total: number }) {
  const { isDark, locale } = useShell();
  const t = T[locale];

  const ink   = isDark ? "rgba(255,255,255,0.92)" : "rgba(10,12,35,0.92)";
  const dim   = isDark ? "rgba(255,255,255,0.42)" : "rgba(10,12,35,0.45)";
  const fade  = isDark ? "rgba(255,255,255,0.22)" : "rgba(10,12,35,0.28)";
  const accent= isDark ? "rgba(195,200,232,0.85)" : "rgba(60,66,94,0.85)";

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section
      style={{
        flex: "0 0 100%",
        width: "100%",
        height: "100%",
        scrollSnapAlign: "start",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        padding: "48px 64px 64px",
      }}
    >
      {/* Top-left index label */}
      <div className="font-mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: dim }}>
        [ {pad(index + 1)} / {pad(total)} ]&nbsp;&nbsp;{t.label}
      </div>

      {/* Top-right status */}
      <div className="font-mono" style={{ position: "absolute", top: 48, right: 64, fontSize: 10, letterSpacing: "0.16em", color: dim, display: "flex", alignItems: "center", gap: 8 }}>
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(90,210,120,0.85)", display: "inline-block" }}
          aria-hidden="true"
        />
        <span>{t.statusLabel}·{t.statusValue}</span>
      </div>

      {/* Centered content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 880 }}>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Mono framing — top rule */}
          <div className="font-mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: fade, marginBottom: 24 }}>
            ┌─ <span style={{ color: accent }}>intro</span> ─────────────────────
          </div>

          {/* Greeting */}
          <p style={{ fontSize: 22, fontWeight: 400, color: dim, marginBottom: 16, letterSpacing: "-0.01em" }}>
            {t.greeting}
          </p>

          {/* Big headline — JetBrains Mono */}
          <h1 className="font-mono" style={{ fontSize: "clamp(48px, 7vw, 96px)", fontWeight: 500, color: ink, lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: 28 }}>
            {t.line1}
          </h1>

          {/* Body */}
          <p style={{ fontSize: 18, lineHeight: 1.5, color: dim, maxWidth: 640, fontWeight: 400 }}>
            {t.body}
          </p>

          {/* Mono framing — bottom rule + prompt */}
          <div className="font-mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: fade, marginTop: 36, display: "flex", alignItems: "center", gap: 10 }}>
            └─&nbsp;
            <span style={{ color: ink, fontWeight: 500 }}>$</span>
            <motion.span
              animate={{ x: [0, 6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              style={{ color: accent }}
            >
              {t.scroll}
            </motion.span>
            <span style={{ flex: 1, borderTop: `1px solid ${fade}`, marginLeft: 6 }} />
          </div>
        </motion.div>
      </div>

      {/* Bottom hint */}
      <div className="font-mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: fade }}>
        ← / → · trackpad · wheel
      </div>
    </section>
  );
}

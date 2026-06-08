"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useShell } from "../context/ShellContext";

const T = {
  en: {
    label: "HELLO.exe",
    greeting: "Hello! ✨",
    line1: "I'm a Designer",
    body: "and I've been creating digital experiences that resonate with people for over half a decade — leading design at early-stage startups, shaping design systems, and shipping product end-to-end.",
    based: "Based in Mexico City · working globally",
    focus: "Currently: design systems · web platforms · mobile",
    cta: "Download résumé",
    scroll: "scroll",
    statusLabel: "SYS·STATUS",
    statusValue: "OPEN_TO_WORK",
  },
  es: {
    label: "HOLA.exe",
    greeting: "¡Hola! ✨",
    line1: "Soy un Diseñador",
    body: "y llevo más de media década creando experiencias digitales que conectan con las personas — liderando diseño en startups en etapa temprana, construyendo design systems y enviando producto de principio a fin.",
    based: "Desde Ciudad de México · trabajando globalmente",
    focus: "Actualmente: design systems · plataformas web · mobile",
    cta: "Descargar CV",
    scroll: "scroll",
    statusLabel: "SYS·ESTADO",
    statusValue: "DISPONIBLE",
  },
};

export default function HeroPanel() {
  const { isDark, locale } = useShell();
  const t = T[locale];

  const ink   = isDark ? "rgba(255,255,255,0.92)" : "rgba(10,12,35,0.92)";
  const dim   = isDark ? "rgba(255,255,255,0.42)" : "rgba(10,12,35,0.45)";
  const fade  = isDark ? "rgba(255,255,255,0.22)" : "rgba(10,12,35,0.28)";
  const accent= isDark ? "rgba(195,200,232,0.85)" : "rgba(60,66,94,0.85)";

  // Fade the scroll indicator out as soon as the user starts scrolling
  const { scrollY } = useScroll();
  const indicatorOpacity = useTransform(scrollY, [0, 80], [1, 0]);
  const indicatorY = useTransform(scrollY, [0, 80], [0, 8]);

  return (
    <section
      style={{
        // Fill the viewport on desktop; the scroll indicator + dot grid imply more below.
        // (Mobile is shorter via the floor.)
        minHeight: "max(620px, 100vh)",
        width: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        paddingTop: "clamp(40px, 5vh, 72px)",
        paddingBottom: "clamp(56px, 6vh, 88px)",
        paddingLeft: "clamp(48px, 7vw, 160px)",
        paddingRight: "clamp(48px, 7vw, 160px)",
        boxSizing: "border-box",
      }}
    >
      {/* Top-left intro label */}
      <div className="font-mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: dim }}>
        [ 00 ]&nbsp;&nbsp;{t.label}
      </div>

      {/* Top-right status */}
      <div className="font-mono" style={{ position: "absolute", top: "clamp(40px, 5vh, 72px)", right: "clamp(48px, 7vw, 160px)", fontSize: 10, letterSpacing: "0.16em", color: dim, display: "flex", alignItems: "center", gap: 8 }}>
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
          {/* Greeting */}
          <p style={{ fontSize: 20, fontWeight: 400, color: dim, marginBottom: 10, letterSpacing: "-0.01em" }}>
            {t.greeting}
          </p>

          {/* Big headline — JetBrains Mono */}
          <h1 className="font-mono" style={{ fontSize: "clamp(44px, 6.4vw, 88px)", fontWeight: 500, color: ink, lineHeight: 1.04, letterSpacing: "-0.04em", marginBottom: 20 }}>
            {t.line1}
          </h1>

          {/* Body */}
          <p style={{ fontSize: 17, lineHeight: 1.55, color: dim, maxWidth: 640, fontWeight: 400, marginBottom: 18 }}>
            {t.body}
          </p>

          {/* Meta lines — replace the heavy mono ornaments */}
          <div className="font-mono" style={{ fontSize: 11, letterSpacing: "0.06em", color: fade, display: "flex", flexDirection: "column", gap: 4 }}>
            <span><span style={{ color: accent }}>·</span>&nbsp; {t.based}</span>
            <span><span style={{ color: accent }}>·</span>&nbsp; {t.focus}</span>
          </div>

          {/* CTA — download résumé (outline) */}
          <motion.a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -1 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="font-mono rw-cta"
            style={{
              marginTop: 26,
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 14px",
              fontSize: 12,
              letterSpacing: "0.04em",
              color: dim,
              background: "transparent",
              border: `1px solid ${fade}`,
              borderRadius: 6,
              textDecoration: "none",
              cursor: "pointer",
              alignSelf: "flex-start",
              userSelect: "none",
            }}
          >
            {t.cta}
            <ArrowUpRight size={14} strokeWidth={1.6} />
          </motion.a>
        </motion.div>
      </div>

      {/* Conventional scroll indicator — fades away as the user starts scrolling */}
      <motion.div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "clamp(20px, 3.2vh, 32px)",
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          pointerEvents: "none",
          opacity: indicatorOpacity,
          y: indicatorY,
        }}
      >
        <span
          className="font-mono"
          style={{ fontSize: 9, letterSpacing: "0.24em", color: dim, textTransform: "uppercase" }}
        >
          {t.scroll}
        </span>
        <motion.div
          animate={{ y: [0, 6, 0], opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", color: accent }}
        >
          <ChevronDown size={18} strokeWidth={1.6} />
        </motion.div>
      </motion.div>
    </section>
  );
}


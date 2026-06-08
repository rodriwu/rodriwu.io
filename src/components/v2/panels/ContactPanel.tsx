"use client";

import { motion } from "framer-motion";
import { useShell } from "../context/ShellContext";
import ContactBody from "../ContactBody";

const T = {
  en: {
    label: "CONTACT.exe",
    eyebrow: "Do I have your attention?",
    heading: "Hit me up.",
    sub: "Open to projects, collaborations, and conversations. Response usually within 24h.",
    footer: "© Rodriwu. All rights reserved. · Eat fruits and vegetables.",
  },
  es: {
    label: "CONTACTO.exe",
    eyebrow: "¿Tengo tu atención?",
    heading: "Escríbeme.",
    sub: "Abierto a proyectos, colaboraciones y conversaciones. Respondo normalmente en 24h.",
    footer: "© Rodriwu. Todos los derechos reservados. · Come frutas y verduras.",
  },
};

export default function ContactPanel({ index, total }: { index: number; total: number }) {
  const { isDark, locale } = useShell();
  const t = T[locale];

  const ink   = isDark ? "rgba(255,255,255,0.94)" : "rgba(10,12,35,0.92)";
  const body  = isDark ? "rgba(255,255,255,0.62)" : "rgba(10,12,35,0.58)";
  const dim   = isDark ? "rgba(255,255,255,0.40)" : "rgba(10,12,35,0.42)";
  const fade  = isDark ? "rgba(255,255,255,0.20)" : "rgba(10,12,35,0.24)";

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
        padding: "48px 64px 48px",
      }}
    >
      {/* Top label */}
      <div className="font-mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: dim, marginBottom: 8 }}>
        [ {pad(index + 1)} / {pad(total)} ]&nbsp;&nbsp;{t.label}
      </div>

      {/* Two-column body */}
      <div style={{ flex: 1, display: "flex", gap: 64, alignItems: "stretch", minHeight: 0, overflow: "hidden" }}>
        {/* Left — pitch */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{ flex: "1 1 0", display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 560 }}
        >
          {/* Mono framing */}
          <div className="font-mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: fade, marginBottom: 22 }}>
            ┌─ <span style={{ color: dim }}>outro</span> ─────────────────────
          </div>

          <p style={{ fontSize: 18, fontWeight: 400, color: dim, marginBottom: 14, letterSpacing: "-0.01em" }}>
            {t.eyebrow}
          </p>

          <h2 className="font-mono" style={{ fontSize: "clamp(40px, 5vw, 72px)", fontWeight: 500, color: ink, lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: 22 }}>
            {t.heading}
          </h2>

          <p style={{ fontSize: 16, lineHeight: 1.6, color: body, maxWidth: 480, marginBottom: 28 }}>
            {t.sub}
          </p>

          <div className="font-mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: fade, display: "flex", alignItems: "center", gap: 8 }}>
            └─&nbsp;<span style={{ color: dim }}>$</span> contact --open
            <span style={{ flex: 1, borderTop: `1px solid ${fade}`, marginLeft: 8 }} />
          </div>
        </motion.div>

        {/* Right — form */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          style={{ flex: "1 1 0", overflowY: "auto", minWidth: 0, paddingRight: 8 }}
        >
          <ContactBody />
        </motion.div>
      </div>

      {/* Footer */}
      <div className="font-mono" style={{ fontSize: 9, letterSpacing: "0.12em", color: fade, marginTop: 24, textAlign: "center" }}>
        {t.footer}
      </div>
    </section>
  );
}

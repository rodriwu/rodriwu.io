"use client";

import { motion } from "framer-motion";
import { useShell } from "../context/ShellContext";
import ContactBody from "../ContactBody";

const T = {
  en: {
    label: "Get in touch",
    eyebrow: "Do I have your attention?",
    heading: "Hit me up.",
    sub: "Open to projects, collaborations, and conversations. Response usually within 24h.",
    footer: "© Rodriwu. All rights reserved. · Eat fruits and vegetables.",
  },
  es: {
    label: "Contáctame",
    eyebrow: "¿Tengo tu atención?",
    heading: "Escríbeme.",
    sub: "Abierto a proyectos, colaboraciones y conversaciones. Respondo normalmente en 24h.",
    footer: "© Rodriwu. Todos los derechos reservados. · Come frutas y verduras.",
  },
};

export default function ContactPanel() {
  const { isDark, locale } = useShell();
  const t = T[locale];

  const ink   = isDark ? "rgba(255,255,255,0.94)" : "rgba(10,12,35,0.92)";
  const body  = isDark ? "rgba(255,255,255,0.62)" : "rgba(10,12,35,0.58)";
  const dim   = isDark ? "rgba(255,255,255,0.40)" : "rgba(10,12,35,0.42)";
  const fade  = isDark ? "rgba(255,255,255,0.20)" : "rgba(10,12,35,0.24)";

  return (
    <section
      id="contact"
      style={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        paddingTop: "clamp(56px, 6vh, 96px)",
        paddingBottom: "clamp(40px, 5vh, 64px)",
        paddingLeft: "clamp(48px, 7vw, 160px)",
        paddingRight: "clamp(48px, 7vw, 160px)",
        boxSizing: "border-box",
      }}
    >
      {/* Top label */}
      <div className="font-mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: dim }}>
        {t.label}
      </div>

      {/* Centered content stack */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "clamp(40px, 6vh, 80px)",
          paddingBottom: "clamp(24px, 4vh, 48px)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: "100%", maxWidth: 720 }}
        >
          {/* Header — centered */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ fontSize: 18, fontWeight: 400, color: dim, marginBottom: 14, letterSpacing: "-0.01em" }}>
              {t.eyebrow}
            </p>

            <h2 className="font-mono" style={{ fontSize: "clamp(40px, 5vw, 72px)", fontWeight: 500, color: ink, lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: 20 }}>
              {t.heading}
            </h2>

            <p style={{ fontSize: 16, lineHeight: 1.6, color: body, maxWidth: 480, margin: "0 auto" }}>
              {t.sub}
            </p>
          </div>

          {/* Form */}
          <ContactBody />
        </motion.div>
      </div>

      {/* Footer */}
      <div className="font-mono" style={{ fontSize: 9, letterSpacing: "0.12em", color: fade, textAlign: "center" }}>
        {t.footer}
      </div>
    </section>
  );
}

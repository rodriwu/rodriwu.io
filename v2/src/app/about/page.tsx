"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useShell } from "@/components/context/ShellContext";

const SKILLS = [
  "User Interface", "User Experience", "Visual Identity", "Platform Implementation",
  "Figma", "Adobe Suite", "Framer", "Lottie Animation",
  "Design Systems", "CMS Templates", "HTML & CSS", "Tailwind CSS",
  "Wix · Webflow", "Elementor", "Social Media Design",
];

const EXPERIENCE = [
  {
    years: "2024 – Present",
    company: "Omni Common",
    role: "Sr. Product Designer & Platform Integrator",
    desc: "Lead end-to-end UX/UI design for U.S.-based clients including Talitha Coffee, NumberBarn, and RapidOs. Bridge design, development, and strategy to ship conversion-focused digital products.",
  },
  {
    years: "2022 – 2025",
    company: "Porch Moving Group",
    role: "Product Designer (Remote)",
    desc: "Led UX and marketing design for Porch, HireAHelper, Permit Puller, Moving Place, and MovingStaffers. Built and maintained design systems, style guides, wireframes, and web prototypes.",
  },
  {
    years: "2021 – 2022",
    company: "HireAHelper",
    role: "UX Design Intern",
    desc: "Worked with diverse clients on projects ranging from web design to branding, creating visually appealing and effective solutions.",
  },
  {
    years: "2018 – 2019",
    company: "Tirza Moda Creativa",
    role: "Graphic Design Intern",
    desc: "Managed social media content and handled photography and editing for catalog images at a fashion design studio.",
  },
];

export default function AboutPage() {
  const { isDark } = useShell();

  const ink  = isDark ? "rgba(255,255,255,0.92)" : "rgba(10,12,35,0.90)";
  const body = isDark ? "rgba(255,255,255,0.64)" : "rgba(10,12,35,0.76)";
  const dim  = isDark ? "rgba(255,255,255,0.40)" : "rgba(10,12,35,0.58)";
  const fade = isDark ? "rgba(255,255,255,0.14)" : "rgba(10,12,35,0.14)";
  const pill = isDark ? "rgba(255,255,255,0.07)" : "rgba(10,12,35,0.06)";
  const pillBorder = isDark ? "rgba(255,255,255,0.10)" : "rgba(10,12,35,0.12)";

  return (
    <main
      style={{
        width: "100%",
        maxWidth: 880,
        margin: "0 auto",
        padding: "clamp(48px, 7vh, 96px) clamp(24px, 6vw, 80px) clamp(64px, 8vh, 120px)",
        boxSizing: "border-box",
      }}
    >
      {/* Page label */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="font-mono"
        style={{ fontSize: 10, letterSpacing: "0.18em", color: dim, marginBottom: "clamp(32px, 5vh, 56px)" }}
      >
        ABOUT.me
      </motion.div>

      {/* ── Section 1: Photo + Bio ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "clamp(28px, 5vw, 64px)",
          flexWrap: "wrap",
          marginBottom: "clamp(56px, 8vh, 96px)",
        }}
      >
        {/* Photo */}
        <div
          style={{
            width: "clamp(120px, 22vw, 200px)",
            aspectRatio: "1 / 1",
            borderRadius: "50%",
            overflow: "hidden",
            flexShrink: 0,
            backgroundImage: `url('${isDark ? "/profile.png" : "/profile-light.png"}')`,
            backgroundSize: "cover",
            backgroundPosition: "center 20%",
            border: `1px solid ${fade}`,
          }}
        />

        {/* Bio */}
        <div style={{ flex: 1, minWidth: 220 }}>
          {/* Status pill */}
          <div
            className="font-mono"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 12px",
              borderRadius: 20,
              border: `1px solid ${pillBorder}`,
              background: pill,
              fontSize: 10,
              letterSpacing: "0.14em",
              color: dim,
              marginBottom: 20,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block", flexShrink: 0 }} />
            OPEN·TO·WORK
          </div>

          <h1
            className="font-mono"
            style={{
              fontSize: "clamp(28px, 5vw, 44px)",
              fontWeight: 500,
              color: ink,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              marginBottom: 20,
            }}
          >
            Rodrigo Martínez Sánchez
          </h1>

          <p style={{ fontSize: "clamp(15px, 1.8vw, 17px)", lineHeight: 1.65, color: body, marginBottom: 16 }}>
            Visual & Product Designer with 7+ years of experience shipping digital products end-to-end — from brand identity and UI design to platform implementation. Currently leading UX/UI at Omni Common, working with U.S.-based growth companies.
          </p>
          <p style={{ fontSize: "clamp(15px, 1.8vw, 17px)", lineHeight: 1.65, color: body }}>
            Based in Mexico. Open to freelance projects, full-time roles, and interesting collaborations.
          </p>
        </div>
      </motion.div>

      {/* Divider */}
      <div style={{ borderTop: `1px solid ${fade}`, marginBottom: "clamp(48px, 7vh, 80px)" }} />

      {/* ── Section 2: Skills & Tools ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: "clamp(56px, 8vh, 96px)" }}
      >
        <div className="font-mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: dim, marginBottom: 28 }}>
          SKILLS.tools
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px 10px",
          }}
        >
          {SKILLS.map((skill) => (
            <span
              key={skill}
              className="font-mono"
              style={{
                padding: "8px 16px",
                borderRadius: 6,
                background: pill,
                border: `1px solid ${pillBorder}`,
                fontSize: 12,
                letterSpacing: "0.06em",
                color: body,
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Divider */}
      <div style={{ borderTop: `1px solid ${fade}`, marginBottom: "clamp(48px, 7vh, 80px)" }} />

      {/* ── Section 3: Experience ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: "clamp(64px, 9vh, 112px)" }}
      >
        <div className="font-mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: dim, marginBottom: 36 }}>
          EXPERIENCE.log
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(32px, 5vh, 48px)" }}>
          {EXPERIENCE.map(({ years, company, role, desc }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5% 0px" }}
              transition={{ delay: i * 0.07, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: "grid",
                gridTemplateColumns: "clamp(110px, 20%, 160px) 1fr",
                gap: "0 clamp(20px, 4vw, 48px)",
                alignItems: "start",
              }}
            >
              <span
                className="font-mono"
                style={{ fontSize: 11, letterSpacing: "0.10em", color: dim, paddingTop: 3, lineHeight: 1.4 }}
              >
                {years}
              </span>
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                  <span className="font-mono" style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.04em", color: ink }}>
                    {role}
                  </span>
                  <span style={{ fontSize: 12, color: dim }}>@ {company}</span>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: body, margin: 0 }}>{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        style={{ textAlign: "center" }}
      >
        <p style={{ fontSize: 15, color: dim, marginBottom: 24 }} className="font-mono">
          Want to work together?
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <motion.a
            href="/#contact"
            whileHover={{ y: -1 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="font-mono"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "11px 18px",
              fontSize: 12,
              letterSpacing: "0.06em",
              color: "#0c0e22",
              background: "var(--accent-highlight)",
              border: "1px solid var(--accent-highlight)",
              borderRadius: 6,
              textDecoration: "none",
              cursor: "pointer",
              userSelect: "none",
              fontWeight: 500,
              boxShadow: "0 6px 18px rgba(207,242,74,0.28)",
            }}
          >
            Get in touch
            <ArrowDown size={14} strokeWidth={1.8} />
          </motion.a>

          <motion.a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -1 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="font-mono rw-cta"
            style={{
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
              userSelect: "none",
            }}
          >
            Download résumé
            <ArrowUpRight size={14} strokeWidth={1.6} />
          </motion.a>
        </div>
      </motion.div>
    </main>
  );
}

"use client";

import { motion } from "framer-motion";

type Locale = "en" | "es";

const T = {
  en: {
    role: "Product Designer",
    available: "ONLINE · AVAILABLE FOR WORK",
    exp: "5+", expLabel: "YEARS",
    loc: "Mexico", locLabel: "COUNTRY",
    tz: "CST", tzLabel: "UTC−6",
    bioHeader: "PROFILE",
    bio: "Easy-going, persistent, and a lot of fun. Human-centered design philosophy — building interfaces that feel meaningful and alive, one pixel at a time.",
    toolkitHeader: "TOOLKIT",
    linksHeader: "FIND ME",
    version: "© Rodriwu. All rights reserved. · Eat fruits and vegetables.",
  },
  es: {
    role: "Diseñador de Producto",
    available: "EN LÍNEA · DISPONIBLE",
    exp: "5+", expLabel: "AÑOS",
    loc: "México", locLabel: "PAÍS",
    tz: "CST", tzLabel: "UTC−6",
    bioHeader: "PERFIL",
    bio: "Amigable, persistente y con mucha energía. Filosofía de diseño centrada en el humano — construyendo interfaces que se sienten vivas y significativas, un píxel a la vez.",
    toolkitHeader: "HERRAMIENTAS",
    linksHeader: "ENCUÉNTRAME",
    version: "© Rodriwu. Todos los derechos reservados. · Come frutas y verduras.",
  },
};

const SKILLS = ["Figma", "Framer", "Principle", "GSAP", "Adobe XD", "React", "TypeScript", "Lottie", "Prototyping"];

const LINKS = [
  { label: "GitHub",   href: "https://github.com/rodriwu",       display: "github.com/rodriwu" },
  { label: "LinkedIn", href: "https://linkedin.com/in/rodriwu",  display: "linkedin.com/in/rodriwu" },
  { label: "Behance",  href: "https://behance.net/rodriwu",      display: "behance.net/rodriwu" },
  { label: "Email",    href: "mailto:rodriwuu@gmail.com",        display: "rodriwuu@gmail.com" },
];

const PHOTO_SIZE = 76;
const PHOTO_OVERLAP = 38; // how much the photo hangs below the hero

export default function AboutWindow({ locale = "en", isDark = true, onOpenContact }: { locale?: Locale; isDark?: boolean; onOpenContact?: () => void }) {
  const t = T[locale];

  const glass = {
    background: isDark ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.03)",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
    borderRadius: 12,
  };

  const dimText  = isDark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.38)";
  const bodyText = isDark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.60)";
  const headText = isDark ? "rgba(255,255,255,0.90)" : "rgba(0,0,0,0.85)";
  const rowSep   = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

  return (
    <div className="h-full overflow-auto" style={{ color: headText }}>

      {/* ── Hero ── */}
      {/* Outer wrapper: no overflow clip so the photo can hang below */}
      <div style={{ position: "relative", marginBottom: PHOTO_OVERLAP }}>

        {/* Background — clipped independently */}
        <div style={{ height: 144, overflow: "hidden", position: "relative", borderRadius: "0 0 0 0" }}>
          {/* Blurred photo fill */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "url('/profile.png')",
            backgroundSize: "cover",
            backgroundPosition: "center 10%",
            filter: isDark
              ? "blur(20px) brightness(0.25) saturate(1.3)"
              : "blur(20px) brightness(1.15) saturate(0.7)",
            transform: "scale(1.15)",
          }} />
          {/* Fade to window bg */}
          <div style={{
            position: "absolute", inset: 0,
            background: isDark
              ? "linear-gradient(to bottom, rgba(14,14,20,0) 20%, rgba(14,14,20,0.75) 70%, rgba(14,14,20,1) 100%)"
              : "linear-gradient(to bottom, rgba(252,252,252,0) 20%, rgba(252,252,252,0.75) 70%, rgba(252,252,252,1) 100%)",
          }} />
          {/* Dot grid overlay */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `radial-gradient(circle, ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"} 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
            maskImage: "linear-gradient(to bottom, black, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
          }} />
        </div>

        {/* Profile photo — sits outside the clipped div so it won't be cut off */}
        <div style={{
          position: "absolute",
          bottom: -PHOTO_OVERLAP,
          left: "50%",
          transform: "translateX(-50%)",
          width: PHOTO_SIZE,
          height: PHOTO_SIZE,
          borderRadius: "50%",
          overflow: "hidden",
          border: isDark ? "2px solid rgba(255,255,255,0.16)" : "2px solid rgba(0,0,0,0.10)",
          boxShadow: isDark
            ? "0 0 0 4px rgba(110,55,255,0.14), 0 10px 32px rgba(0,0,0,0.55)"
            : "0 0 0 4px rgba(110,55,255,0.08), 0 10px 24px rgba(0,0,0,0.14)",
          zIndex: 2,
          flexShrink: 0,
        }}>
          <img
            src="/profile.png"
            alt="Rodrigo"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 18%",
              display: "block",
            }}
          />
        </div>
      </div>

      {/* ── Identity ── */}
      <div className="flex flex-col items-center text-center px-6 pb-5" style={{ paddingTop: 8 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em", color: headText, marginBottom: 4 }}>
          Rodrigo Martínez
        </h2>
        <p className="font-mono mb-4" style={{ fontSize: 12, color: bodyText }}>
          {t.role} · @rodriwu
        </p>
        {/* Status pill */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          padding: "5px 14px", borderRadius: 999,
          background: isDark ? "rgba(110,50,255,0.10)" : "rgba(100,40,220,0.07)",
          border: isDark ? "1px solid rgba(140,80,255,0.28)" : "1px solid rgba(100,40,220,0.22)",
          fontFamily: "monospace",
          fontSize: 10, letterSpacing: "0.1em",
          color: isDark ? "rgba(195,155,255,0.92)" : "rgba(100,40,220,0.85)",
        }}>
          <motion.span
            animate={{ opacity: [1, 0.25, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(90,210,120,0.85)", display: "inline-block", flexShrink: 0 }}
          />
          {t.available}
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-3 gap-2 px-4 pb-4">
        {[
          { value: t.exp, label: t.expLabel },
          { value: t.loc, label: t.locLabel },
          { value: t.tz,  label: t.tzLabel  },
        ].map(({ value, label }) => (
          <div key={label} style={{ ...glass, padding: "12px 8px", textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 600, color: headText, letterSpacing: "-0.03em", lineHeight: 1 }}>
              {value}
            </div>
            <div className="font-mono" style={{ fontSize: 9, color: dimText, marginTop: 5, letterSpacing: "0.12em" }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Bio ── */}
      <div className="px-4 pb-4">
        <p className="font-mono mb-2" style={{ fontSize: 10, letterSpacing: "0.14em", color: dimText }}>
          {t.bioHeader}
        </p>
        <div style={{ ...glass, padding: "13px 15px" }}>
          <p style={{ fontSize: 13, lineHeight: 1.65, color: bodyText }}>
            {t.bio}
          </p>
        </div>
      </div>

      {/* ── Toolkit ── */}
      <div className="px-4 pb-4">
        <p className="font-mono mb-2" style={{ fontSize: 10, letterSpacing: "0.14em", color: dimText }}>
          {t.toolkitHeader}
        </p>
        <div style={{ ...glass, padding: "11px 13px" }}>
          <div className="flex flex-wrap gap-1.5">
            {SKILLS.map((s) => (
              <span key={s} className="font-mono" style={{
                fontSize: 10, padding: "3px 8px", borderRadius: 6,
                background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                border: isDark ? "1px solid rgba(255,255,255,0.09)" : "1px solid rgba(0,0,0,0.08)",
                color: bodyText,
              }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Links ── */}
      <div className="px-4 pb-4">
        <p className="font-mono mb-2" style={{ fontSize: 10, letterSpacing: "0.14em", color: dimText }}>
          {t.linksHeader}
        </p>
        <div style={{ ...glass, overflow: "hidden" }}>
          {LINKS.map(({ label, href, display }, i) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="flex items-center justify-between group"
              style={{
                padding: "9px 14px",
                borderBottom: i < LINKS.length - 1 ? `1px solid ${rowSep}` : "none",
                textDecoration: "none",
                transition: "background 0.12s ease",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <span className="font-mono" style={{ fontSize: 10, letterSpacing: "0.08em", color: dimText }}>{label}</span>
              <span className="font-mono group-hover:opacity-60 transition-opacity" style={{ fontSize: 11, color: bodyText }}>{display}</span>
            </a>
          ))}
        </div>
      </div>

      {/* ── Contact CTA ── */}
      {onOpenContact && (
        <div className="px-4 pb-4">
          <button
            onClick={onOpenContact}
            className="w-full font-mono flex items-center justify-center gap-2"
            style={{
              fontSize: 11,
              padding: "10px 14px",
              borderRadius: 10,
              background: isDark ? "rgba(120,60,255,0.14)" : "rgba(100,40,220,0.08)",
              border: `1px solid ${isDark ? "rgba(140,80,255,0.30)" : "rgba(100,40,220,0.20)"}`,
              color: isDark ? "rgba(195,155,255,0.92)" : "rgba(100,40,220,0.85)",
              cursor: "pointer",
              letterSpacing: "0.06em",
              transition: "opacity 0.15s ease",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.7"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
          >
            {locale === "es" ? "Ponerse en contacto →" : "Get in touch →"}
          </button>
        </div>
      )}

      {/* ── Footer ── */}
      <div className="px-4 pb-6">
        <p className="font-mono" style={{ fontSize: 10, color: dimText, opacity: 0.55, letterSpacing: "0.05em" }}>
          {t.version}
        </p>
      </div>
    </div>
  );
}

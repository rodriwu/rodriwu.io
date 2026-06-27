"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, ChevronDown } from "lucide-react";
import { useShell } from "../context/ShellContext";

const T = {
  en: {
    greeting: "Hello! ✨",
    line1Pre: "I'm a",
    line1Post: "Designer",
    rotatingWords: ["Product", "UX", "UI", "UI/UX", "Visual", "Graphic", "Brand", "Systems", "Digital", "Full Stack"],
    body: "and I've been creating digital experiences that resonate with people for over 7 years — leading design at early-stage startups, shaping design systems, and shipping product end-to-end.",
    based: "Based in Mexico · working globally",
    focus: "Currently: design systems · web platforms · mobile",
    ctaPrimary: "Get in touch",
    ctaSecondary: "Download résumé",
    scroll: "scroll",
    statusLabel: "SYS·STATUS",
    statusValue: "OPEN_TO_WORK",
  },
  es: {
    greeting: "¡Hola! ✨",
    line1Pre: "Soy un Diseñador",
    line1Post: "",
    rotatingWords: ["de Producto", "UX", "UI", "UI/UX", "Visual", "Gráfico", "de Marca", "de Sistemas", "Digital", "Full Stack"],
    body: "y llevo más de 7 años creando experiencias digitales que conectan con las personas — liderando diseño en startups en etapa temprana, construyendo design systems y enviando producto de principio a fin.",
    based: "Desde México · trabajando globalmente",
    focus: "Actualmente: design systems · plataformas web · mobile",
    ctaPrimary: "Hablemos",
    ctaSecondary: "Descargar CV",
    scroll: "scroll",
    statusLabel: "SYS·ESTADO",
    statusValue: "DISPONIBLE",
  },
};

/* useTypewriter — type → hold → backspace → next word, looping. */
function useTypewriter(
  words: string[],
  { typeSpeed = 85, deleteSpeed = 45, holdTime = 4500, betweenTime = 320 } = {}
) {
  const [text, setText] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [phase, setPhase] = useState<"typing" | "deleting">("typing");

  useEffect(() => {
    if (words.length === 0) return;
    const current = words[wordIdx % words.length];
    let timer: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (text.length < current.length) {
        timer = setTimeout(() => setText(current.slice(0, text.length + 1)), typeSpeed);
      } else {
        timer = setTimeout(() => setPhase("deleting"), holdTime);
      }
    } else {
      if (text.length > 0) {
        timer = setTimeout(() => setText(text.slice(0, -1)), deleteSpeed);
      } else {
        timer = setTimeout(() => {
          setPhase("typing");
          setWordIdx((i) => (i + 1) % words.length);
        }, betweenTime);
      }
    }

    return () => clearTimeout(timer);
  }, [text, wordIdx, phase, words, typeSpeed, deleteSpeed, holdTime, betweenTime]);

  return text;
}

export default function HeroPanel() {
  const { isDark, locale } = useShell();
  const t = T[locale];
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const ink   = isDark ? "rgba(255,255,255,0.92)" : "rgba(10,12,35,0.92)";
  const dim   = isDark ? "rgba(255,255,255,0.42)" : "rgba(10,12,35,0.60)";
  const fade  = isDark ? "rgba(255,255,255,0.22)" : "rgba(10,12,35,0.44)";
  const accent= isDark ? "rgba(195,200,232,0.85)" : "rgba(60,66,94,0.85)";

  const rotating = useTypewriter(t.rotatingWords);

  /* Fade the scroll indicator out as soon as the user starts scrolling. */
  const { scrollY } = useScroll();
  const indicatorOpacity = useTransform(scrollY, [0, 80], [1, 0]);
  const indicatorY = useTransform(scrollY, [0, 80], [0, 8]);

  /* Smooth-scroll to the contact panel. Picks the last <section> on the page
     (Contact is the last sibling), so we don't need to thread an id through. */
  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof document === "undefined") return;
    const sections = document.querySelectorAll("section");
    const target = sections[sections.length - 1];
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      style={{
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
      {/* Top-right status */}
      <div className="font-mono hidden lg:flex" style={{ position: "absolute", top: "clamp(40px, 5vh, 72px)", right: "clamp(48px, 7vw, 160px)", fontSize: 10, letterSpacing: "0.16em", color: dim, alignItems: "center", gap: 8 }}>
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(90,210,120,0.85)", display: "inline-block" }}
          aria-hidden="true"
        />
        <span>{t.statusLabel}·{t.statusValue}</span>
      </div>

      {/* Centered content — on mobile, paddingBottom pushes the visual center up so
          the stack clears the URL bar / scroll indicator area. */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 880, paddingBottom: isMobile ? 96 : 0 }}>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Greeting */}
          <p style={{ fontSize: 20, fontWeight: 400, color: dim, marginBottom: 10, letterSpacing: "-0.01em" }}>
            {t.greeting}
          </p>

          {/* Headline with typewriter-rotating noun.
              Desktop: one line, fixed-width rotating slot so "Designer" never moves.
              Mobile: stacks each segment on its own line via .hero-segment. */}
          <h1 className="font-mono hero-headline" style={{ fontSize: "clamp(46px, 4.8vw, 64px)", fontWeight: 500, color: ink, lineHeight: 1.06, letterSpacing: "-0.035em", marginBottom: 20 }}>
            <span className="hero-segment">{t.line1Pre}</span>
            <span className="hero-spacer">&nbsp;</span>
            <span
              className="hero-segment"
              style={{ color: "var(--accent-highlight)", whiteSpace: "nowrap" }}
            >
              {rotating}
              <span
                aria-hidden="true"
                style={{
                  display: "inline-block",
                  width: "0.06em",
                  height: "0.72em",
                  background: "currentColor",
                  marginLeft: "0.06em",
                  verticalAlign: "baseline",
                  animation: "blink 1s step-end infinite",
                  transform: "translateY(0.06em)",
                }}
              />
            </span>
            {t.line1Post && (
              <>
                <span className="hero-spacer">&nbsp;</span>
                <span className="hero-segment">{t.line1Post}</span>
              </>
            )}
          </h1>

          {/* Body */}
          <p style={{ fontSize: 17, lineHeight: 1.55, color: dim, maxWidth: 640, fontWeight: 400, marginBottom: 18 }}>
            {t.body}
          </p>

          {/* Meta lines */}
          <div className="font-mono" style={{ fontSize: 11, letterSpacing: "0.06em", color: fade, display: "flex", flexDirection: "column", gap: 4 }}>
            <span><span style={{ color: accent }}>·</span>&nbsp; {t.based}</span>
            <span><span style={{ color: accent }}>·</span>&nbsp; {t.focus}</span>
          </div>

          {/* CTAs — primary (contact) + secondary (résumé) */}
          <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <motion.a
              href="#contact"
              onClick={scrollToContact}
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
              {t.ctaPrimary}
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
              {t.ctaSecondary}
              <ArrowUpRight size={14} strokeWidth={1.6} />
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Conventional scroll indicator — fades away as the user starts scrolling.
          On mobile, anchor well above the URL bar / home indicator using
          safe-area-inset-bottom + a generous offset so it never gets cropped. */}
      <motion.div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: isMobile
            ? "calc(env(safe-area-inset-bottom, 0px) + 72px)"
            : "clamp(20px, 3.2vh, 32px)",
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: isMobile ? 8 : 6,
          pointerEvents: "none",
          opacity: indicatorOpacity,
          y: indicatorY,
        }}
      >
        <span
          className="font-mono"
          style={{
            fontSize: isMobile ? 11 : 9,
            letterSpacing: "0.24em",
            color: isMobile ? fade : dim,
            textTransform: "uppercase",
          }}
        >
          {t.scroll}
        </span>
        <motion.div
          animate={{ y: [0, 7, 0], opacity: isMobile ? [0.7, 1, 0.7] : [0.55, 1, 0.55] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", color: accent }}
        >
          <ChevronDown size={isMobile ? 26 : 18} strokeWidth={isMobile ? 1.4 : 1.6} />
        </motion.div>
      </motion.div>
    </section>
  );
}

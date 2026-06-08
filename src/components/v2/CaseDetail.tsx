"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useShell } from "./context/ShellContext";
import { CASE_STUDIES, type CaseStudy } from "@/data/caseStudies";

export default function CaseDetail({ cs }: { cs: CaseStudy }) {
  const { isDark } = useShell();

  const ink   = isDark ? "rgba(255,255,255,0.94)" : "rgba(10,12,35,0.92)";
  const body  = isDark ? "rgba(255,255,255,0.66)" : "rgba(10,12,35,0.62)";
  const dim   = isDark ? "rgba(255,255,255,0.40)" : "rgba(10,12,35,0.42)";
  const fade  = isDark ? "rgba(255,255,255,0.10)" : "rgba(10,12,35,0.12)";
  const cardBg = isDark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.022)";

  /* next case (loops) */
  const idx = CASE_STUDIES.findIndex(c => c.id === cs.id);
  const next = CASE_STUDIES[(idx + 1) % CASE_STUDIES.length];

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <article style={{ maxWidth: 1080, margin: "0 auto", padding: "48px 56px 80px" }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36 }}>
          <Link href="/v2" className="font-mono group inline-flex items-center gap-2"
            style={{ fontSize: 11, letterSpacing: "0.14em", color: dim, textDecoration: "none" }}>
            <ArrowLeft size={13} strokeWidth={1.8} />
            BACK TO GALLERY
          </Link>
          <span className="font-mono" style={{ fontSize: 10, letterSpacing: "0.16em", color: dim }}>
            CASE·{cs.id.toUpperCase()} · {pad(idx + 1)} / {pad(CASE_STUDIES.length)}
          </span>
        </div>

        {/* Cover */}
        <motion.div
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "relative", borderRadius: 20, overflow: "hidden",
            border: `1px solid ${fade}`,
            aspectRatio: "16 / 9",
            marginBottom: 36,
            boxShadow: isDark ? "0 20px 50px rgba(0,0,0,0.45)" : "0 12px 36px rgba(0,0,0,0.09)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cs.cover} alt={cs.shortTitle}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 65%, rgba(0,0,0,0.3) 100%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: cs.accent }} />
        </motion.div>

        {/* Title block */}
        <div style={{ marginBottom: 36 }}>
          <div className="font-mono" style={{ fontSize: 10, letterSpacing: "0.16em", color: dim, marginBottom: 14, display: "flex", gap: 14, flexWrap: "wrap" }}>
            <span>{cs.company.toUpperCase()}</span>
            <span style={{ color: fade }}>·</span>
            <span>{cs.year.toUpperCase()}</span>
            <span style={{ color: fade }}>·</span>
            <span style={{ color: cs.accent }}>{cs.tagline.replace(/\.$/, "").toUpperCase()}</span>
          </div>

          <h1 className="font-mono" style={{ fontSize: "clamp(34px, 4.4vw, 58px)", fontWeight: 500, color: ink, lineHeight: 1.08, letterSpacing: "-0.035em", marginBottom: 20 }}>
            {cs.title}
          </h1>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            {cs.tags.map(t => (
              <span key={t} className="font-mono" style={{
                fontSize: 10, letterSpacing: "0.10em", padding: "5px 10px", borderRadius: 6,
                color: body, border: `1px solid ${fade}`, background: cardBg,
              }}>
                {t.toUpperCase()}
              </span>
            ))}
            <a href={cs.url} target="_blank" rel="noopener noreferrer"
              className="font-mono inline-flex items-center gap-1.5"
              style={{ fontSize: 10, letterSpacing: "0.10em", padding: "5px 10px", borderRadius: 6,
                color: cs.accent, border: `1px solid ${cs.accent}55`, background: `${cs.accent}12`,
                textDecoration: "none", marginLeft: 4 }}>
              <ExternalLink size={11} />
              LIVE
            </a>
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(cs.metrics.length, 4)}, 1fr)`, gap: 10, marginBottom: 40 }}>
          {cs.metrics.map(m => (
            <div key={m.label} style={{ padding: "16px 14px", borderRadius: 12, background: cardBg, border: `1px solid ${fade}`, textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 600, color: cs.accent, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 6 }}>
                {m.value}
              </div>
              <div className="font-mono" style={{ fontSize: 9, letterSpacing: "0.12em", color: dim, textTransform: "uppercase" }}>
                {m.label}
              </div>
            </div>
          ))}
        </div>

        {/* Overview */}
        <section style={{ marginBottom: 36 }}>
          <p className="font-mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: dim, marginBottom: 12 }}>
            OVERVIEW
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: body, maxWidth: 760 }}>
            {cs.overview}
          </p>
        </section>

        {/* Challenge */}
        <section style={{ marginBottom: 48 }}>
          <p className="font-mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: dim, marginBottom: 12 }}>
            CHALLENGE
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: body, maxWidth: 760 }}>
            {cs.challenge}
          </p>
        </section>

        {/* Image gallery */}
        {cs.images.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <p className="font-mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: dim, marginBottom: 12 }}>
              GALLERY
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
              {cs.images.map((src, i) => (
                <div key={i} style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${fade}`, aspectRatio: "4 / 3", background: cardBg }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`${cs.shortTitle} ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Next case */}
        <div style={{ borderTop: `1px solid ${fade}`, paddingTop: 28, marginTop: 36 }}>
          <p className="font-mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: dim, marginBottom: 14 }}>
            NEXT CASE
          </p>
          <Link href={`/v2/case/${next.id}`}
            className="group"
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "20px 22px", borderRadius: 14,
              background: cardBg, border: `1px solid ${fade}`,
              textDecoration: "none",
              transition: "background 0.18s ease, border-color 0.18s ease",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = next.accent + "66"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = fade; }}
          >
            <div>
              <div className="font-mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: dim, marginBottom: 6 }}>
                {next.company.toUpperCase()} · {next.year.toUpperCase()}
              </div>
              <div style={{ fontSize: 20, fontWeight: 500, color: ink, letterSpacing: "-0.02em" }}>
                {next.title}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: next.accent, flexShrink: 0 }}>
              <span className="font-mono" style={{ fontSize: 11, letterSpacing: "0.12em" }}>NEXT</span>
              <ArrowRight size={16} strokeWidth={2} />
            </div>
          </Link>
        </div>
      </article>
    </div>
  );
}

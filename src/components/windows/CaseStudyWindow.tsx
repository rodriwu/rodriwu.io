"use client";

import { ExternalLink } from "lucide-react";
import { CASE_STUDIES } from "@/data/caseStudies";

interface Props {
  id: string;
  isDark: boolean;
}

export default function CaseStudyWindow({ id, isDark }: Props) {
  const cs = CASE_STUDIES.find((c) => c.id === id);

  if (!cs) {
    return (
      <div className="h-full flex items-center justify-center" style={{ color: "var(--text-tertiary)", fontFamily: "monospace", fontSize: 12 }}>
        Not found.
      </div>
    );
  }

  const headText   = isDark ? "rgba(255,255,255,0.92)"  : "rgba(10,12,35,0.88)";
  const bodyText   = isDark ? "rgba(255,255,255,0.58)"  : "rgba(10,12,35,0.56)";
  const dimText    = isDark ? "rgba(255,255,255,0.28)"  : "rgba(10,12,35,0.30)";
  const cardBg     = isDark ? "rgba(255,255,255,0.03)"  : "rgba(0,0,20,0.03)";
  const cardBorder = isDark ? "rgba(255,255,255,0.07)"  : "rgba(0,0,20,0.07)";
  const sep        = isDark ? "rgba(255,255,255,0.05)"  : "rgba(0,0,20,0.06)";

  return (
    <div className="h-full overflow-auto">

      {/* Cover */}
      <div style={{ position: "relative", height: 168, overflow: "hidden", flexShrink: 0 }}>
        {cs.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cs.cover}
            alt={cs.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", background: `${cs.accent}22` }} />
        )}
        {/* Fade to window bg */}
        <div style={{
          position: "absolute", inset: 0,
          background: isDark
            ? `linear-gradient(to top, rgba(14,14,20,1) 0%, rgba(14,14,20,0.3) 55%, transparent 100%)`
            : `linear-gradient(to top, rgba(242,238,228,1) 0%, rgba(242,238,228,0.2) 55%, transparent 100%)`,
        }} />
        {/* Accent bottom bar */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: cs.accent, opacity: 0.8 }} />
      </div>

      {/* Header */}
      <div style={{ padding: "14px 20px 10px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em", color: headText, margin: "0 0 4px", lineHeight: 1.2 }}>
              {cs.title}
            </h2>
            <p style={{ fontFamily: "monospace", fontSize: 10, color: dimText, letterSpacing: "0.12em", margin: 0 }}>
              {cs.company} · {cs.year}
            </p>
          </div>
          <a
            href={cs.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "5px 10px", borderRadius: 8, flexShrink: 0,
              border: `1px solid ${cs.accent}44`, background: `${cs.accent}12`,
              color: cs.accent, fontFamily: "monospace", fontSize: 9,
              letterSpacing: "0.10em", textDecoration: "none", marginTop: 2,
            }}
          >
            <ExternalLink size={9} />
            VIEW
          </a>
        </div>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {[cs.role, ...cs.deliverables.split(", ")].map((item) => (
            <span key={item} style={{
              fontFamily: "monospace", fontSize: 9, letterSpacing: "0.07em",
              padding: "3px 8px", borderRadius: 6,
              background: cardBg, border: `1px solid ${cardBorder}`, color: bodyText,
            }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div style={{ margin: "4px 20px 14px", display: "grid", gridTemplateColumns: `repeat(${cs.metrics.length}, 1fr)`, gap: 6 }}>
        {cs.metrics.map((m) => (
          <div key={m.label} style={{
            textAlign: "center", padding: "10px 6px",
            background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 10,
          }}>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em", color: cs.accent, lineHeight: 1, marginBottom: 4 }}>
              {m.value}
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 8, letterSpacing: "0.10em", color: dimText, textTransform: "uppercase" }}>
              {m.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{ height: 1, background: sep, margin: "0 20px 14px" }} />

      {/* Overview */}
      <div style={{ padding: "0 20px 14px" }}>
        <p style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: dimText, margin: "0 0 8px" }}>
          Overview
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.65, color: bodyText, margin: 0 }}>
          {cs.overview}
        </p>
      </div>

      {/* Challenge */}
      <div style={{ padding: "0 20px 14px" }}>
        <p style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: dimText, margin: "0 0 8px" }}>
          Challenge
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.65, color: bodyText, margin: 0 }}>
          {cs.challenge}
        </p>
      </div>

      {/* Bottom padding */}
      <div style={{ height: 24 }} />
    </div>
  );
}

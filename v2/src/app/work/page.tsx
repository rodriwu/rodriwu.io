"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { CASE_STUDIES } from "@/data/caseStudies";
import { useShell } from "@/components/context/ShellContext";

export default function WorkPage() {
  const { isDark } = useShell();

  const accent = isDark ? "#CFF24A" : "#7B5CF6";
  const ink    = isDark ? "rgba(255,255,255,0.94)" : "rgba(10,12,35,0.92)";
  const body   = isDark ? "rgba(255,255,255,0.66)" : "rgba(10,12,35,0.62)";
  const dim    = isDark ? "rgba(255,255,255,0.40)" : "rgba(10,12,35,0.42)";
  const fade   = isDark ? "rgba(255,255,255,0.10)" : "rgba(10,12,35,0.12)";

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div style={{ width: "100%" }}>
      <article style={{ maxWidth: 1240, margin: "0 auto", padding: "28px var(--rw-body-pad) 96px" }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 48 }}>
          <Link
            href="/"
            className="font-mono inline-flex items-center gap-2"
            style={{ fontSize: 11, letterSpacing: "0.14em", color: dim, textDecoration: "none" }}
          >
            <ArrowLeft size={13} strokeWidth={1.8} />
            BACK
          </Link>
          <span className="font-mono" style={{ fontSize: 10, letterSpacing: "0.16em", color: dim }}>
            INDEX · {pad(CASE_STUDIES.length)} CASES
          </span>
        </div>

        {/* Page heading */}
        <header style={{ marginBottom: 64 }}>
          <p className="font-mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: dim, marginBottom: 14, textTransform: "uppercase" }}>
            All work
          </p>
          <h1
            className="font-mono"
            style={{
              fontSize: "clamp(36px, 5.4vw, 72px)",
              fontWeight: 500,
              color: ink,
              lineHeight: 1.02,
              letterSpacing: "-0.04em",
              marginBottom: 18,
              maxWidth: 920,
            }}
          >
            Every case study, end to end.
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.66, color: body, maxWidth: 720 }}>
            The complete index — including older work and projects not featured on the home page. Each case study links to the full write-up.
          </p>
        </header>

        {/* List */}
        <ul style={{ listStyle: "none", padding: 0, margin: 0, borderTop: `1px solid ${fade}` }}>
          {CASE_STUDIES.map((cs, i) => (
            <motion.li
              key={cs.id}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px -8% 0px -8%" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: Math.min(i * 0.03, 0.18) }}
              style={{ borderBottom: `1px solid ${fade}` }}
            >
              <Link
                href={`/case/${cs.id}`}
                className="work-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "60px 96px 1fr auto",
                  alignItems: "center",
                  gap: "clamp(14px, 2.4vw, 28px)",
                  padding: "20px 8px",
                  textDecoration: "none",
                  color: ink,
                  borderRadius: 6,
                  transition: "background 0.22s ease, padding 0.22s ease",
                }}
              >
                {/* Index number */}
                <span
                  className="font-mono"
                  style={{ fontSize: 11, letterSpacing: "0.16em", color: dim, fontVariantNumeric: "tabular-nums" }}
                >
                  {pad(i + 1)}
                </span>

                {/* Thumbnail */}
                <div
                  style={{
                    width: 96,
                    aspectRatio: "4 / 3",
                    borderRadius: 6,
                    overflow: "hidden",
                    background: fade,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cs.cover}
                    alt=""
                    aria-hidden="true"
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
                  />
                </div>

                {/* Title + meta */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
                  <span
                    style={{
                      fontSize: "clamp(17px, 2vw, 22px)",
                      fontWeight: 500,
                      color: ink,
                      letterSpacing: "-0.02em",
                      lineHeight: 1.18,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {cs.shortTitle} — {cs.tagline}
                  </span>
                  <span
                    className="font-mono"
                    style={{ fontSize: 11, letterSpacing: "0.06em", color: dim, lineHeight: 1.4 }}
                  >
                    {cs.company} · {cs.year} · {cs.role}
                  </span>
                </div>

                {/* Arrow */}
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    border: `1px solid ${fade}`,
                    color: accent,
                    transition: "background 0.22s ease, transform 0.22s ease",
                  }}
                >
                  <ArrowUpRight size={16} strokeWidth={1.8} />
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>

        {/* Footer note */}
        <p
          className="font-mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.06em",
            color: dim,
            marginTop: 48,
            lineHeight: 1.6,
          }}
        >
          Some of these cases are also linked from Behance and Dribbble — the write-ups here include the full context, decisions, and outcomes.
        </p>
      </article>

      <style jsx>{`
        .work-row:hover {
          background: ${isDark ? "rgba(255,255,255,0.04)" : "rgba(10,12,35,0.04)"};
          padding-left: 16px !important;
          padding-right: 16px !important;
        }
      `}</style>
    </div>
  );
}

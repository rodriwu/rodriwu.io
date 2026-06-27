"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { CASE_STUDIES, type CaseStudy } from "@/data/caseStudies";
import { useShell } from "@/components/context/ShellContext";

/* Sort key: extract [endYear, startYear] from a `year` string ("2024 to 2025",
   "2023 – 2024", "2025"). Used for newest-first sorting with a start-year
   tiebreaker so a 2025-only project ranks above a 2024-2025 project. */
function yearKey(s: string): [number, number] {
  const m = s.match(/\d{4}/g);
  if (!m || m.length === 0) return [0, 0];
  const start = parseInt(m[0], 10);
  const end = parseInt(m[m.length - 1], 10);
  return [end, start];
}

export default function WorkPage() {
  const { isDark, openUnavailable } = useShell();

  const accent = isDark ? "#CFF24A" : "#7B5CF6";
  const ink    = isDark ? "rgba(255,255,255,0.94)" : "rgba(10,12,35,0.92)";
  const body   = isDark ? "rgba(255,255,255,0.66)" : "rgba(10,12,35,0.78)";
  const dim    = isDark ? "rgba(255,255,255,0.40)" : "rgba(10,12,35,0.58)";
  const fade   = isDark ? "rgba(255,255,255,0.10)" : "rgba(10,12,35,0.12)";

  const pad = (n: number) => String(n).padStart(2, "0");
  const sorted: CaseStudy[] = [...CASE_STUDIES].sort((a, b) => {
    const [aEnd, aStart] = yearKey(a.year);
    const [bEnd, bStart] = yearKey(b.year);
    return bEnd - aEnd || bStart - aStart;
  });

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
            INDEX · {pad(CASE_STUDIES.length)} PROJECTS
          </span>
        </div>

        {/* Page heading */}
        <header style={{ marginBottom: 64 }}>
          <p className="font-mono" style={{ fontSize: 10, letterSpacing: "0.22em", color: dim, marginBottom: 14, textTransform: "uppercase" }}>
            Selected work
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
            All the work.
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.66, color: body, maxWidth: 720 }}>
            A collection of projects: brand identity, product design, UX, digital platforms. Not all are formal write-ups; some just show the output.
          </p>
        </header>

        {/* List */}
        <ul style={{ listStyle: "none", padding: 0, margin: 0, borderTop: `1px solid ${fade}` }}>
          {sorted.map((cs, i) => {
            const rowStyle = {
              display: "grid",
              gridTemplateColumns: "60px 96px 1fr auto",
              alignItems: "center",
              gap: "clamp(14px, 2.4vw, 28px)",
              padding: "20px 8px",
              textDecoration: "none",
              color: ink,
              borderRadius: 6,
              transition: "background 0.22s ease, padding 0.22s ease",
            } as const;

            const rowInner = (
              <>
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
                    src={cs.galleryCover ?? cs.cover}
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
                    {cs.shortTitle} · {cs.tagline}
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
              </>
            );

            return (
              <motion.li
                key={cs.id}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px -8% 0px -8%" }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: Math.min(i * 0.03, 0.18) }}
                style={{ borderBottom: `1px solid ${fade}` }}
              >
                {cs.unavailable ? (
                  <button
                    type="button"
                    onClick={() => openUnavailable(cs.shortTitle)}
                    aria-label={`${cs.shortTitle} (unavailable)`}
                    className="work-row"
                    style={{ ...rowStyle, background: "transparent", border: "none", width: "100%", font: "inherit", cursor: "pointer", textAlign: "left" }}
                  >
                    {rowInner}
                  </button>
                ) : cs.external ? (
                  <a
                    href={cs.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${cs.shortTitle} (opens in new tab)`}
                    className="work-row"
                    style={rowStyle}
                  >
                    {rowInner}
                  </a>
                ) : (
                  <Link
                    href={`/case/${cs.id}`}
                    className="work-row"
                    style={rowStyle}
                  >
                    {rowInner}
                  </Link>
                )}
              </motion.li>
            );
          })}
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
          Some of these projects are also documented on Behance and Dribbble.
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

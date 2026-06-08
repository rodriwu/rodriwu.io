"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useShell } from "../context/ShellContext";
import type { CaseStudy } from "@/data/caseStudies";

interface Props {
  cs: CaseStudy;
  index: number;
  total: number;
}

export default function CaseStudyPanel({ cs, index, total }: Props) {
  const { isDark } = useShell();

  const dim  = isDark ? "rgba(255,255,255,0.40)" : "rgba(10,12,35,0.42)";
  const fade = isDark ? "rgba(255,255,255,0.20)" : "rgba(10,12,35,0.24)";

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
      {/* Top index label — panel chrome, not on the thumbnail */}
      <div className="font-mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: dim }}>
        [ {pad(index + 1)} / {pad(total)} ]&nbsp;&nbsp;CASE·{cs.id.toUpperCase()}
      </div>

      {/* Centered square thumbnail — no text on the thumbnail itself */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 0 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "relative",
            width: "min(72vh, 56vw)",
            aspectRatio: "1 / 1",
          }}
        >
          <Link
            href={`/v2/case/${cs.id}`}
            aria-label={cs.shortTitle}
            style={{
              display: "block",
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: 18,
              overflow: "hidden",
              border: `1px solid ${fade}`,
              boxShadow: isDark
                ? "0 28px 70px rgba(0,0,0,0.50), 0 8px 18px rgba(0,0,0,0.28)"
                : "0 20px 50px rgba(10,12,35,0.10), 0 6px 14px rgba(10,12,35,0.06)",
              transition: "transform 0.4s ease, box-shadow 0.4s ease",
            }}
            className="group rw-thumb"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cs.cover}
              alt=""
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                transition: "transform 0.6s ease",
              }}
            />

            {/* Accent top edge — color only, no text */}
            <div
              aria-hidden="true"
              style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: cs.accent, opacity: 0.95 }}
            />
          </Link>
        </motion.div>
      </div>

      {/* Bottom — pagination dots (panel chrome) */}
      <div className="font-mono" style={{ display: "flex", alignItems: "center", gap: 4, color: fade, fontSize: 9, letterSpacing: "0.18em" }}>
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            style={{
              width: i === index ? 18 : 8,
              height: 2,
              background: i === index ? cs.accent : fade,
              transition: "width 0.3s ease, background 0.3s ease",
            }}
          />
        ))}
      </div>
    </section>
  );
}

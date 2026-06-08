"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useShell } from "../context/ShellContext";
import type { CaseStudy } from "@/data/caseStudies";

interface Props {
  cs: CaseStudy;
}

/* CaseCard — one square thumbnail. Width is controlled by the parent
   (desktop strip wraps it in a fixed-width container; mobile grid sizes
   it via grid column). No text on the thumbnail; click → /case/[id]. */
export default function CaseCard({ cs }: Props) {
  const { isDark } = useShell();
  const fade = isDark ? "rgba(255,255,255,0.20)" : "rgba(10,12,35,0.20)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px -5% 0px -5%" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1 / 1",
      }}
    >
      <Link
        href={`/case/${cs.id}`}
        aria-label={cs.shortTitle}
        className="rw-thumb"
        draggable={false}
        style={{
          display: "block",
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: 14,
          overflow: "hidden",
          border: `1px solid ${fade}`,
          boxShadow: isDark
            ? "0 24px 60px rgba(0,0,0,0.45), 0 6px 14px rgba(0,0,0,0.25)"
            : "0 18px 44px rgba(10,12,35,0.10), 0 5px 12px rgba(10,12,35,0.06)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cs.cover}
          alt=""
          aria-hidden="true"
          draggable={false}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden="true"
          style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: cs.accent, opacity: 0.95 }}
        />
      </Link>
    </motion.div>
  );
}

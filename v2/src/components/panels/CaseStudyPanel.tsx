"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { CaseStudy } from "@/data/caseStudies";
import { useShell } from "@/components/context/ShellContext";

interface Props {
  cs: CaseStudy;
  aspectRatio?: string;
  showOverlay?: boolean;
}

/* CaseCard — thumbnail. Width is controlled by the parent.
   - Internal case: click → /case/[id] (in-app navigation).
   - External case (cs.external): click → cs.url in a new tab.       */
export default function CaseCard({ cs, aspectRatio = "1 / 1", showOverlay = false }: Props) {
  const { openUnavailable } = useShell();
  const sharedStyle = {
    display: "block",
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
  } as const;

  const image = (
    /* eslint-disable-next-line @next/next/no-img-element */
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
  );

  const overlay = showOverlay && (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.44) 50%, transparent 100%)",
        padding: "clamp(18px, 2.6vw, 28px)",
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          display: "block",
          fontSize: "clamp(14px, 1.6vw, 20px)",
          fontWeight: 500,
          color: "rgba(255,255,255,0.96)",
          letterSpacing: "-0.025em",
          lineHeight: 1.15,
          marginBottom: 6,
        }}
      >
        {cs.shortTitle}
      </span>
      <span
        style={{
          display: "block",
          fontFamily: "ui-monospace, monospace",
          fontSize: 10,
          letterSpacing: "0.06em",
          color: "rgba(255,255,255,0.52)",
          lineHeight: 1.3,
        }}
      >
        {cs.tagline}
      </span>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px -5% 0px -5%" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio,
      }}
    >
      {cs.unavailable ? (
        <button
          type="button"
          onClick={() => openUnavailable(cs.shortTitle)}
          aria-label={`${cs.shortTitle} (unavailable)`}
          className="rw-thumb"
          style={{ ...sharedStyle, background: "transparent", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
        >
          {image}
          {overlay}
        </button>
      ) : cs.external ? (
        <a
          href={cs.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${cs.shortTitle} (opens in new tab)`}
          className="rw-thumb"
          draggable={false}
          style={sharedStyle}
        >
          {image}
          {overlay}
        </a>
      ) : (
        <Link
          href={`/case/${cs.id}`}
          aria-label={cs.shortTitle}
          className="rw-thumb"
          draggable={false}
          style={sharedStyle}
        >
          {image}
          {overlay}
        </Link>
      )}
    </motion.div>
  );
}

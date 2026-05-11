"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { CASE_STUDIES, type CaseStudy } from "@/data/caseStudies";

interface BentoGridProps {
  onOpen: (id: string) => void;
  canvasW?: number;
  canvasH?: number;
  isDark?: boolean;
}

// Cell px — col width, row heights
const COL = 164;
const ROW_SM = 118;  // rows 1 & 2
const ROW_LG = 108;  // row 3 (wide banner)
const GAP = 8;

// Grid placement per case study size
const GRID_PLACEMENT: Record<string, React.CSSProperties> = {
  large: { gridColumn: "1 / 3", gridRow: "1 / 3" },  // MP  — 2 cols, 2 rows
  tall:  { gridColumn: "3",     gridRow: "1 / 3" },   // PP  — 1 col, 2 rows
  wide:  { gridColumn: "1 / 4", gridRow: "3" },       // HAH — 3 cols, 1 row
  small: { gridColumn: "3",     gridRow: "3" },        // HDMN — but overridden below
};

// HDMN is a 4th tile; it sits col 3 row 2 alongside PP in this arrangement:
// [MP c1-2 r1-2] [PP c3 r1]
// [MP c1-2 r1-2] [HDMN c3 r2]
// [HAH c1-3 r3              ]
const EXPLICIT: Record<string, React.CSSProperties> = {
  mp:   { gridColumn: "1 / 3", gridRow: "1 / 3" },
  pp:   { gridColumn: "3",     gridRow: "1" },
  hdmn: { gridColumn: "3",     gridRow: "2" },
  hah:  { gridColumn: "1 / 4", gridRow: "3" },
};

function BentoTile({ cs, onOpen, isMobile }: { cs: CaseStudy; onOpen: () => void; isMobile: boolean }) {
  const [hovered, setHovered] = useState(false);
  const isWide = cs.id === "hah";
  const isLarge = cs.id === "mp";

  return (
    <motion.button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onOpen}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "relative",
        borderRadius: 16,
        overflow: "hidden",
        cursor: "pointer",
        border: "none",
        background: "transparent",
        padding: 0,
        display: "block",
        width: "100%",
        height: "100%",
        ...(isMobile ? {} : EXPLICIT[cs.id]),
      }}
    >
      {/* Cover image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={cs.cover}
        alt={cs.shortTitle}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "top center",
          transition: "transform 0.5s ease, filter 0.35s ease",
          transform: hovered ? "scale(1.06)" : "scale(1)",
          filter: hovered ? "brightness(0.72)" : "brightness(0.55)",
        }}
      />

      {/* Gradient overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(160deg, transparent 30%, rgba(0,0,0,0.72) 100%)`,
        pointerEvents: "none",
      }} />

      {/* Accent top edge */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: 2,
        background: cs.accent,
        opacity: hovered ? 1 : 0.6,
        transition: "opacity 0.25s ease",
        pointerEvents: "none",
      }} />

      {/* Content */}
      <div style={{
        position: "absolute",
        inset: 0,
        padding: isLarge ? 16 : isWide ? "10px 14px" : 12,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        gap: 4,
      }}>
        {/* Tags row — only on large tile */}
        {isLarge && (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 4 }}>
            {cs.tags.slice(0, 2).map(tag => (
              <span key={tag} style={{
                fontSize: 8,
                fontFamily: "monospace",
                letterSpacing: "0.08em",
                padding: "2px 6px",
                borderRadius: 4,
                background: "rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.8)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}>{tag}</span>
            ))}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8 }}>
          <div style={{ minWidth: 0 }}>
            <p style={{
              fontSize: isLarge ? 15 : isWide ? 13 : 11,
              fontWeight: 600,
              color: "rgba(255,255,255,0.95)",
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
              marginBottom: 2,
              whiteSpace: isWide ? "nowrap" : "normal",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>{cs.shortTitle}</p>
            <p style={{
              fontSize: isLarge ? 10 : 9,
              fontFamily: "monospace",
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.04em",
            }}>{cs.year}</p>
          </div>

          <div style={{
            width: isLarge ? 28 : 22,
            height: isLarge ? 28 : 22,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.22)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            opacity: hovered ? 1 : 0,
            transform: hovered ? "scale(1)" : "scale(0.7)",
            transition: "opacity 0.2s ease, transform 0.2s ease",
          }}>
            <ArrowUpRight size={isLarge ? 13 : 10} strokeWidth={2} color="white" />
          </div>
        </div>

        {/* Metrics — large tile only */}
        {isLarge && hovered && (
          <div style={{
            display: "flex",
            gap: 10,
            marginTop: 6,
            flexWrap: "wrap",
          }}>
            {cs.metrics.slice(0, 2).map(m => (
              <div key={m.label} style={{ lineHeight: 1.3 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: cs.accent, letterSpacing: "-0.01em" }}>{m.value}</p>
                <p style={{ fontSize: 8, fontFamily: "monospace", color: "rgba(255,255,255,0.5)" }}>{m.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.button>
  );
}

export default function BentoGrid({ onOpen, canvasW = 1440, canvasH = 900, isDark = true }: BentoGridProps) {
  const isMobile = canvasW < 1024;

  // ── Mobile: horizontal scrollable strip ──
  if (isMobile) {
    return (
      <div style={{
        position: "absolute",
        top: 88,   // below the horizontal icon row
        left: 68,
        right: 12,
        pointerEvents: "auto",
        display: "flex",
        flexDirection: "row",
        gap: 8,
        overflowX: "auto",
        overflowY: "visible",
        paddingBottom: 4,
        scrollbarWidth: "none",
      }}>
        {CASE_STUDIES.map((cs) => (
          <div key={cs.id} style={{ flexShrink: 0, width: 140, height: 110, borderRadius: 14, overflow: "hidden" }}>
            <BentoTile cs={cs} onOpen={() => onOpen(cs.id)} isMobile />
          </div>
        ))}
      </div>
    );
  }

  // ── Desktop: organic CSS grid ──
  const gridW = COL * 3 + GAP * 2;
  const gridH = ROW_SM * 2 + GAP + ROW_LG + GAP;

  // Position: right portion of the content area, vertically centered-ish
  const TASKBAR = 56;
  const contentLeft = TASKBAR + 16;
  const contentRight = canvasW - 16;
  const availW = contentRight - contentLeft;
  const gridX = contentLeft + Math.round((availW - gridW) * 0.55);
  const gridY = Math.round((canvasH - gridH) * 0.38);

  return (
    <div
      style={{
        position: "absolute",
        left: gridX,
        top: gridY,
        pointerEvents: "auto",
        zIndex: 2,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `${COL}px ${COL}px ${COL}px`,
          gridTemplateRows: `${ROW_SM}px ${ROW_SM}px ${ROW_LG}px`,
          gap: GAP,
          width: gridW,
        }}
      >
        {CASE_STUDIES.map((cs) => (
          <div key={cs.id} style={{ ...EXPLICIT[cs.id] }}>
            <BentoTile cs={cs} onOpen={() => onOpen(cs.id)} isMobile={false} />
          </div>
        ))}
      </div>
    </div>
  );
}

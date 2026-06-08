"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { CASE_STUDIES } from "@/data/caseStudies";
import { useShell } from "./context/ShellContext";
import CaseCard from "./panels/CaseStudyPanel";

const T = {
  en: { label: "SELECTED.work", footer: "scroll · or drag the bar" },
  es: { label: "TRABAJO.seleccionado", footer: "scroll · o arrastra la barra" },
};

/* Pinned horizontal-scroll gallery on desktop; 2-col square grid on mobile. */
export default function Gallery() {
  const { isDark, locale } = useShell();
  const t = T[locale];

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 1024);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (isMobile) return <MobileGrid isDark={isDark} t={t} />;
  return <DesktopStrip isDark={isDark} t={t} />;
}

/* ──────────────────────────────────────────────────────────────
   Desktop — pinned sticky section with horizontal-translating strip
   ────────────────────────────────────────────────────────────── */
function DesktopStrip({ isDark, t }: { isDark: boolean; t: typeof T["en"] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  // Strip translation — derived from window.scrollY (single source of truth)
  const tx = useMotionValue(0);
  const negTx = useTransform(tx, (v) => -v);
  // maxTx mirrored as a ref so the scrubber transforms can read it cheaply
  const maxTxRef = useRef(1);
  // Progress (0..1) as a motion value so the thumb follows tx with no React re-render
  const progressMv = useTransform(tx, (v) => v / Math.max(1, maxTxRef.current));
  // While the user is scrubbing, the scroll handler must NOT touch tx, or a
  // boundary-clamped scrollY will snap the strip back at the end of the range.
  const scrubbingRef = useRef(false);

  const [activeIdx, setActiveIdx] = useState(0);
  const [scrubbing, setScrubbing] = useState(false);
  // True once the gallery section has scrolled into the pinned position.
  const [pinned, setPinned] = useState(false);

  const totalCards = CASE_STUDIES.length;
  const pad = (n: number) => String(n).padStart(2, "0");

  const dim  = isDark ? "rgba(255,255,255,0.42)" : "rgba(10,12,35,0.45)";
  const fade = isDark ? "rgba(255,255,255,0.20)" : "rgba(10,12,35,0.22)";
  const ink  = isDark ? "rgba(255,255,255,0.92)" : "rgba(10,12,35,0.90)";

  /* Shared helper — computed geometry */
  const getGeometry = () => {
    const section = sectionRef.current!;
    const strip = stripRef.current!;
    const vp = window.innerWidth;
    const vh = window.innerHeight;
    const maxTx = Math.max(0, strip.scrollWidth - vp);
    const scrollableH = Math.max(1, section.offsetHeight - vh);
    return { section, strip, vp, vh, maxTx, scrollableH };
  };

  const updateActiveIdx = (currentTx: number) => {
    const strip = stripRef.current;
    if (!strip) return;
    const vp = window.innerWidth;
    const cardW = strip.scrollWidth / totalCards;
    const idx = Math.max(0, Math.min(totalCards - 1, Math.round((currentTx + vp / 2 - cardW / 2) / cardW)));
    setActiveIdx((prev) => (prev !== idx ? idx : prev));
  };

  /* Scroll → strip translation. window.scrollY is the single source of truth;
     tx and the scrubber thumb are both derived from it. */
  useEffect(() => {
    const section = sectionRef.current;
    const strip = stripRef.current;
    if (!section || !strip) return;

    let raf = 0;

    const compute = () => {
      if (scrubbingRef.current) return; // scrub owns tx while it's active
      const { maxTx, scrollableH } = getGeometry();
      maxTxRef.current = maxTx;
      const rect = section.getBoundingClientRect();
      // "Pinned" once the section has reached the top of the viewport
      setPinned((prev) => {
        const next = rect.top <= 0 && rect.bottom > window.innerHeight;
        return prev !== next ? next : prev;
      });
      const p = Math.max(0, Math.min(1, -rect.top / scrollableH));
      const target = p * maxTx;
      tx.set(target);
      updateActiveIdx(target);
    };

    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalCards]);

  const sectionHeightVh = totalCards * 100;

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        height: `${sectionHeightVh}vh`,
        width: "100%",
        touchAction: "pan-y",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header — only visible once the gallery section is pinned in the viewport */}
        <motion.div
          className="font-mono"
          animate={{ opacity: pinned ? 1 : 0, y: pinned ? 0 : -8 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{
            padding: "clamp(40px, 5vh, 72px) clamp(48px, 7vw, 160px) 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 10,
            letterSpacing: "0.18em",
            color: dim,
            pointerEvents: pinned ? "auto" : "none",
          }}
        >
          <span>[ {pad(activeIdx + 1)} / {pad(totalCards)} ]&nbsp;&nbsp;{t.label}</span>
          <span style={{ color: ink }}>
            {CASE_STUDIES[activeIdx]?.shortTitle?.toUpperCase()}
          </span>
        </motion.div>

        {/* Strip */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          <motion.div
            ref={stripRef}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 48,
              paddingLeft: "clamp(48px, 7vw, 160px)",
              paddingRight: "clamp(48px, 7vw, 160px)",
              x: negTx,
              willChange: "transform",
            }}
          >
            {CASE_STUDIES.map((cs) => (
              <div
                key={cs.id}
                style={{
                  flexShrink: 0,
                  width: "min(72vh, 56vw)",
                }}
              >
                <CaseCard cs={cs} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scrubber — mini system control: thumb is the only interactive part */}
        <Scrubber
          progressMv={progressMv}
          activeIdx={activeIdx}
          totalCards={totalCards}
          isDark={isDark}
          scrubbing={scrubbing}
          setScrubbing={setScrubbing}
          dim={dim}
          fade={fade}
          ink={ink}
          footer={t.footer}
          onScrubStart={() => {
            // Refresh geometry on each gesture start (resize-safe)
            const strip = stripRef.current;
            if (strip) maxTxRef.current = Math.max(0, strip.scrollWidth - window.innerWidth);
            scrubbingRef.current = true;
          }}
          onScrub={(p) => {
            // Instant strip update; scrollY is intentionally left alone during the drag.
            const maxTx = maxTxRef.current;
            tx.set(p * maxTx);
            updateActiveIdx(p * maxTx);
          }}
          onScrubEnd={(p) => {
            // Sync scrollY ONCE so wheel/keyboard scroll resumes from the new spot.
            const section = sectionRef.current;
            if (!section) {
              scrubbingRef.current = false;
              return;
            }
            const scrollableH = Math.max(1, section.offsetHeight - window.innerHeight);
            const sectionDocTop = section.getBoundingClientRect().top + window.scrollY;
            window.scrollTo(0, sectionDocTop + p * scrollableH);
            // Release the lock after the resulting scroll event has flushed.
            requestAnimationFrame(() => {
              scrubbingRef.current = false;
            });
          }}
        />
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   Scrubber — draggable mini scrollbar that controls window.scrollY.
   scrollY is the source of truth, so dragging the scrubber simply
   writes to it and the existing scroll handler updates tx.
   ────────────────────────────────────────────────────────────── */
function Scrubber({
  progressMv,
  activeIdx,
  totalCards,
  isDark,
  scrubbing,
  setScrubbing,
  dim,
  fade,
  ink,
  footer,
  onScrubStart,
  onScrub,
  onScrubEnd,
}: {
  progressMv: import("framer-motion").MotionValue<number>;
  activeIdx: number;
  totalCards: number;
  isDark: boolean;
  scrubbing: boolean;
  setScrubbing: (b: boolean) => void;
  dim: string;
  fade: string;
  ink: string;
  footer: string;
  onScrubStart: () => void;
  onScrub: (progress: number) => void;
  onScrubEnd: (progress: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const pad = (n: number) => String(n).padStart(2, "0");

  // Compact track, same footprint as the old dots row
  const trackW = 132;
  const thumbW = 22;
  // Thumb's pixel left — driven by tx motion value, zero React lag during drag
  const thumbX = useTransform(progressMv, (p) => (trackW - thumbW) * Math.max(0, Math.min(1, p)));
  // Filled-portion width, derived the same way
  const filledW = useTransform(progressMv, (p) => Math.max(0, Math.min(1, p)) * (trackW - thumbW) + thumbW / 2);

  useEffect(() => {
    const thumb = thumbRef.current;
    const track = trackRef.current;
    if (!thumb || !track) return;

    let pointerId: number | null = null;
    let downX = 0;
    let startProgress = 0;
    let lastProgress = 0;

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      pointerId = e.pointerId;
      try { thumb.setPointerCapture(e.pointerId); } catch {}

      const trackRect = track.getBoundingClientRect();
      const thumbRect = thumb.getBoundingClientRect();
      const range = Math.max(1, trackRect.width - thumbRect.width);
      downX = e.clientX;
      startProgress = Math.max(0, Math.min(1, (thumbRect.left - trackRect.left) / range));
      lastProgress = startProgress;

      onScrubStart();
      setScrubbing(true);
      document.body.style.userSelect = "none";
      e.preventDefault();
      e.stopPropagation();
    };

    const onMove = (e: PointerEvent) => {
      if (pointerId !== e.pointerId) return;
      const range = trackW - thumbW;
      const p = Math.max(0, Math.min(1, startProgress + (e.clientX - downX) / range));
      lastProgress = p;
      onScrub(p);
      e.preventDefault();
    };

    const onUp = (e: PointerEvent) => {
      if (pointerId !== e.pointerId) return;
      pointerId = null;
      try { thumb.releasePointerCapture(e.pointerId); } catch {}
      onScrubEnd(lastProgress);
      setScrubbing(false);
      document.body.style.userSelect = "";
    };

    thumb.addEventListener("pointerdown", onDown);
    thumb.addEventListener("pointermove", onMove);
    thumb.addEventListener("pointerup", onUp);
    thumb.addEventListener("pointercancel", onUp);
    return () => {
      thumb.removeEventListener("pointerdown", onDown);
      thumb.removeEventListener("pointermove", onMove);
      thumb.removeEventListener("pointerup", onUp);
      thumb.removeEventListener("pointercancel", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        padding: "0 clamp(48px, 7vw, 160px) clamp(28px, 4vh, 48px)",
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      {/* Counter */}
      <span
        className="font-mono"
        style={{ fontSize: 10, letterSpacing: "0.18em", color: ink }}
      >
        {pad(activeIdx + 1)} / {pad(totalCards)}
      </span>

      {/* Track — just horizontal blocks. Line + filled line + thumb block. */}
      <div
        ref={trackRef}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={totalCards - 1}
        aria-valuenow={activeIdx}
        style={{
          position: "relative",
          width: trackW,
          height: 12,
          display: "flex",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        {/* Base track line */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 1,
            background: fade,
          }}
        />
        {/* Filled portion */}
        <motion.div
          style={{
            position: "absolute",
            left: 0,
            width: filledW,
            height: 1,
            background: dim,
          }}
        />
        {/* Thumb — single horizontal block, no border, no inner markings */}
        <motion.div
          ref={thumbRef}
          animate={{ height: scrubbing ? 5 : 3 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={{
            position: "absolute",
            left: 0,
            x: thumbX,
            width: thumbW,
            background: ink,
            cursor: scrubbing ? "grabbing" : "ew-resize",
            pointerEvents: "auto",
            touchAction: "none",
            willChange: "transform, height",
          }}
        />
      </div>

      {/* Footer hint */}
      <span
        className="font-mono"
        style={{ fontSize: 9, letterSpacing: "0.18em", color: dim, whiteSpace: "nowrap" }}
      >
        {footer}
      </span>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Mobile — clean 2-col square grid, vertical scroll
   ────────────────────────────────────────────────────────────── */
function MobileGrid({ isDark, t }: { isDark: boolean; t: typeof T["en"] }) {
  const dim = isDark ? "rgba(255,255,255,0.42)" : "rgba(10,12,35,0.45)";
  const fade = isDark ? "rgba(255,255,255,0.20)" : "rgba(10,12,35,0.22)";
  const totalCards = CASE_STUDIES.length;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section
      style={{
        width: "100%",
        padding: "clamp(20px, 3.5vh, 32px) clamp(20px, 5vw, 32px) clamp(28px, 4vh, 40px)",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        className="font-mono"
        style={{
          fontSize: 10,
          letterSpacing: "0.18em",
          color: dim,
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>[ {pad(totalCards)} ]&nbsp;&nbsp;{t.label}</span>
        <span style={{ color: fade }}>↓ scroll</span>
      </div>

      {/* Single-column stack — one square per row */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          width: "100%",
        }}
      >
        {CASE_STUDIES.map((cs) => (
          <CaseCard key={cs.id} cs={cs} />
        ))}
      </div>
    </section>
  );
}

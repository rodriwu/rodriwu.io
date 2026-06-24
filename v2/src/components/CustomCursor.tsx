"use client";

import { useEffect, useRef, useState } from "react";

const TEXT_SELECTOR = 'input, textarea, [contenteditable="true"]';
const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], [data-hover], [data-cursor], select, label, summary';

type Mode = "arrow" | "hover" | "text";

/* Custom cursor — small angular modern pointer.
   Sharp vector silhouette with a long left edge and a prominent
   right-side wing/tail. Theme-adaptive fill, hairline contrast stroke,
   subtle drop shadow. Slight scale on interactive hover (1.05) and on
   press (0.9). I-beam over text inputs. Hidden on touch / coarse-
   pointer devices. */
export default function CustomCursor() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>("arrow");
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    let mx = -100;
    let my = -100;
    let raf = 0;
    let visible = false;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!visible) {
        visible = true;
        wrap.style.opacity = "1";
      }
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (!t || typeof t.closest !== "function") return setMode("arrow");
      if (t.closest(TEXT_SELECTOR)) setMode("text");
      else if (t.closest(INTERACTIVE_SELECTOR)) setMode("hover");
      else setMode("arrow");
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeaveDoc = () => {
      visible = false;
      wrap.style.opacity = "0";
    };
    const onEnterDoc = () => {
      visible = true;
      wrap.style.opacity = "1";
    };

    const tick = () => {
      wrap.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeaveDoc);
    document.addEventListener("mouseenter", onEnterDoc);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeaveDoc);
      document.removeEventListener("mouseenter", onEnterDoc);
    };
  }, [enabled]);

  if (!enabled) return null;

  const isText = mode === "text";
  const isHover = mode === "hover";
  const scale = pressed ? 0.9 : isHover ? 1.05 : 1;

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 99999,
        pointerEvents: "none",
        opacity: 0,
        transition: "opacity 0.2s ease",
        willChange: "transform",
      }}
    >
      {isText ? <IBeam /> : <AngularArrow scale={scale} />}
    </div>
  );
}

function AngularArrow({ scale }: { scale: number }) {
  return (
    <svg
      width="13"
      height="19"
      viewBox="0 0 13 19"
      style={{
        display: "block",
        transform: `scale(${scale})`,
        /* Pivot at the tip so scaling never shifts the click hotspot. */
        transformOrigin: "1px 1px",
        transition: "transform 0.14s cubic-bezier(0.16, 1, 0.3, 1)",
        filter: "drop-shadow(0 1.5px 2.5px rgba(0,0,0,0.32))",
      }}
    >
      <path
        /* Figma-style cursor — clean classic pointer, sharp angular tail.
           Tip hotspot at (1,1). Left edge vertical, body crosses right at
           y=11, then tail flares down-right with a sharp triangular tip.
           Miter joins keep every corner razor crisp. */
        d="M 1 1 L 1 15.5 L 5 12 L 7.5 17.5 L 9.5 16.5 L 6.5 11 L 11 11 Z"
        style={{
          fill: "var(--text-primary)",
          stroke: "var(--cursor-outline)",
        }}
        strokeWidth="1"
        strokeLinejoin="miter"
        strokeLinecap="square"
        strokeMiterlimit={4}
      />
    </svg>
  );
}

function IBeam() {
  return (
    <div
      style={{
        position: "absolute",
        top: -11,
        left: -1,
        width: 2,
        height: 22,
        background: "var(--text-primary)",
        boxShadow:
          "0 0 0 1px var(--cursor-outline)," +
          "0 1px 2px rgba(0,0,0,0.18)",
      }}
    >
      <span
        style={{
          position: "absolute",
          left: -3,
          top: -1,
          width: 8,
          height: 1.5,
          background: "var(--text-primary)",
          boxShadow: "0 0 0 1px var(--cursor-outline)",
        }}
      />
      <span
        style={{
          position: "absolute",
          left: -3,
          bottom: -1,
          width: 8,
          height: 1.5,
          background: "var(--text-primary)",
          boxShadow: "0 0 0 1px var(--cursor-outline)",
        }}
      />
    </div>
  );
}

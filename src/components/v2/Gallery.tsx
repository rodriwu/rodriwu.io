"use client";

import { useEffect, useRef, useState } from "react";
import { CASE_STUDIES } from "@/data/caseStudies";
import HeroPanel from "./panels/HeroPanel";
import CaseStudyPanel from "./panels/CaseStudyPanel";
import ContactPanel from "./panels/ContactPanel";

const PANEL_COUNT_BASE = 2; // hero + contact, case studies added between

export default function Gallery() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const totalPanels = PANEL_COUNT_BASE + CASE_STUDIES.length;

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 1024);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* Wheel-to-horizontal — listens at window level so scrolling ANYWHERE
     moves the gallery sideways. Skips elements that legitimately need
     vertical scroll (textareas, scrollable form columns, etc.). */
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || isMobile) return;

    const hasVerticalScrollAncestor = (start: Element | null): boolean => {
      let node: Element | null = start;
      while (node && node !== document.body && node !== el) {
        if (node.tagName === "TEXTAREA") return true;
        const cs = window.getComputedStyle(node);
        if ((cs.overflowY === "auto" || cs.overflowY === "scroll") && node.scrollHeight > node.clientHeight + 1) {
          return true;
        }
        node = node.parentElement;
      }
      return false;
    };

    const onWheel = (e: WheelEvent) => {
      if (hasVerticalScrollAncestor(e.target as Element)) return;
      const dy = e.deltaY;
      const dx = e.deltaX;

      // If user is using native horizontal trackpad scroll, let the browser handle it.
      if (Math.abs(dx) >= Math.abs(dy) && dx !== 0) return;

      if (dy !== 0) {
        // Direct scrollLeft assignment — bypasses snap-back so the wheel
        // accumulates naturally. Snap re-engages when the user pauses.
        el.scrollLeft += dy;
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [isMobile]);

  /* Keyboard ← / → */
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;

      const panelSize = isMobile ? el.clientHeight : el.clientWidth;
      if (isMobile) {
        if (e.key === "ArrowDown" || e.key === "PageDown") { el.scrollBy({ top: panelSize, behavior: "smooth" }); e.preventDefault(); }
        if (e.key === "ArrowUp"   || e.key === "PageUp")   { el.scrollBy({ top: -panelSize, behavior: "smooth" }); e.preventDefault(); }
      } else {
        if (e.key === "ArrowRight" || e.key === "PageDown") { el.scrollBy({ left: panelSize, behavior: "smooth" }); e.preventDefault(); }
        if (e.key === "ArrowLeft"  || e.key === "PageUp")   { el.scrollBy({ left: -panelSize, behavior: "smooth" }); e.preventDefault(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobile]);

  return (
    <div
      ref={scrollerRef}
      className="rw-scroller"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        overflowX: isMobile ? "hidden" : "auto",
        overflowY: isMobile ? "auto" : "hidden",
        scrollSnapType: isMobile ? "y proximity" : "x proximity",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <HeroPanel index={0} total={totalPanels} />
      {CASE_STUDIES.map((cs, i) => (
        <CaseStudyPanel key={cs.id} cs={cs} index={i + 1} total={totalPanels} />
      ))}
      <ContactPanel index={totalPanels - 1} total={totalPanels} />
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";

// How much each blob drifts toward (or away from) the cursor.
// [factorX, factorY] — negative = opposite direction
const BLOB_INFLUENCE = [
  [  0.038,  0.030 ],   // blob-1: follows cursor gently
  [ -0.028, -0.022 ],   // blob-2: drifts away
  [  0.022, -0.032 ],   // blob-3: diagonal counter
];

const LERP = 0.035; // smoothing — lower = lazier

export default function BlobLayer({ isDark }: { isDark: boolean }) {
  const wrapRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);

  useEffect(() => {
    const targets = BLOB_INFLUENCE.map(() => ({ x: 0, y: 0 }));
    const curr    = BLOB_INFLUENCE.map(() => ({ x: 0, y: 0 }));
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      const cx = e.clientX - window.innerWidth  / 2;
      const cy = e.clientY - window.innerHeight / 2;
      BLOB_INFLUENCE.forEach(([fx, fy], i) => {
        targets[i].x = cx * fx;
        targets[i].y = cy * fy;
      });
    };

    const tick = () => {
      for (let i = 0; i < 3; i++) {
        curr[i].x += (targets[i].x - curr[i].x) * LERP;
        curr[i].y += (targets[i].y - curr[i].y) * LERP;
        const el = wrapRefs.current[i];
        if (el) el.style.transform = `translate(${curr[i].x}px,${curr[i].y}px)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[1, 2, 3].map((n, i) => (
        <div
          key={n}
          ref={el => { wrapRefs.current[i] = el; }}
          style={{ position: "absolute", inset: 0 }}
        >
          <div className={`ether-blob ether-blob-${n}${isDark ? "" : " light"}`} />
        </div>
      ))}
    </div>
  );
}

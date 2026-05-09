"use client";

import { useRef, useEffect } from "react";

const SPACING        = 28;
const DOT_RADIUS     = 0.9;
const PUSH_RADIUS    = 140;
const PUSH_STRENGTH  = 32;
const STIFFNESS      = 0.13;
const DAMPING        = 0.70;

interface Dot {
  ox: number; oy: number;
  dx: number; dy: number;
  vx: number; vy: number;
}

interface State {
  dots:  Dot[];
  mouse: { x: number; y: number };
  w:     number;
  h:     number;
  raf:   number;
}

export default function DotGrid({ isDark }: { isDark: boolean }) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const isDarkRef  = useRef(isDark);
  const stateRef   = useRef<State>({
    dots: [], mouse: { x: -9999, y: -9999 }, w: 0, h: 0, raf: 0,
  });

  // Keep isDark ref in sync without restarting the loop
  useEffect(() => { isDarkRef.current = isDark; }, [isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const state = stateRef.current;

    const buildDots = (w: number, h: number) => {
      const dots: Dot[] = [];
      for (let y = SPACING / 2; y < h + SPACING; y += SPACING)
        for (let x = SPACING / 2; x < w + SPACING; x += SPACING)
          dots.push({ ox: x, oy: y, dx: 0, dy: 0, vx: 0, vy: 0 });
      return dots;
    };

    const setup = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width  = w;
      canvas.height = h;
      state.w = w;
      state.h = h;
      state.dots = buildDots(w, h);
    };

    setup();

    const onMouse = (e: MouseEvent) => {
      const rect   = canvas.getBoundingClientRect();
      const scaleX = state.w / (rect.width  || 1);
      const scaleY = state.h / (rect.height || 1);
      state.mouse = {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top)  * scaleY,
      };
    };

    document.addEventListener("mousemove", onMouse);

    const frame = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) { state.raf = requestAnimationFrame(frame); return; }

      ctx.clearRect(0, 0, state.w, state.h);

      const mx = state.mouse.x;
      const my = state.mouse.y;

      ctx.fillStyle = isDarkRef.current
        ? "rgba(255,255,255,0.10)"
        : "rgba(30,40,90,0.30)";

      for (const dot of state.dots) {
        // Current world position
        const wx = dot.ox + dot.dx;
        const wy = dot.oy + dot.dy;

        // Push vector from mouse
        const distX = wx - mx;
        const distY = wy - my;
        const dist  = Math.sqrt(distX * distX + distY * distY);

        let tdx = 0, tdy = 0;
        if (dist < PUSH_RADIUS && dist > 0.5) {
          const f = ((1 - dist / PUSH_RADIUS) ** 2) * PUSH_STRENGTH;
          tdx = (distX / dist) * f;
          tdy = (distY / dist) * f;
        }

        // Damped spring toward target displacement
        dot.vx += (tdx - dot.dx) * STIFFNESS;
        dot.vy += (tdy - dot.dy) * STIFFNESS;
        dot.vx *= DAMPING;
        dot.vy *= DAMPING;
        dot.dx += dot.vx;
        dot.dy += dot.vy;

        ctx.beginPath();
        ctx.arc(dot.ox + dot.dx, dot.oy + dot.dy, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }

      state.raf = requestAnimationFrame(frame);
    };

    state.raf = requestAnimationFrame(frame);

    const ro = new ResizeObserver(setup);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(state.raf);
      document.removeEventListener("mousemove", onMouse);
      ro.disconnect();
    };
  }, []); // run once — isDark is tracked via ref

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      "absolute",
        inset:         0,
        width:         "100%",
        height:        "100%",
        pointerEvents: "none",
        display:       "block",
      }}
    />
  );
}

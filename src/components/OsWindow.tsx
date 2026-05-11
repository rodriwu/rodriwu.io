"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useDragControls, useMotionValue } from "framer-motion";
import { X, Maximize2 } from "lucide-react";

interface OsWindowProps {
  id: string;
  title: string;
  onClose: () => void;
  onMinimize: () => void;
  isMinimized: boolean;
  children: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { w: number; h: number };
  canvasW?: number;
  canvasH?: number;
  maxSizeFraction?: number;
  maxPixelW?: number;
  maxPixelH?: number;
  snapLeft?: boolean;
  openMaximized?: boolean;
  autoHeight?: boolean;
  onMaximize?: (isMax: boolean) => void;
}

const MIN_W = 280;
const MIN_H = 180;
const EDGE = 5;    // px — edge hit-zone thickness
const CORNER = 14; // px — corner hit-zone size

type ResizeDir = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

const RESIZE_HANDLES: { dir: ResizeDir; style: React.CSSProperties }[] = [
  { dir: "n",  style: { top: 0,    left: CORNER, right: CORNER,  height: EDGE,   cursor: "ns-resize"   } },
  { dir: "s",  style: { bottom: 0, left: CORNER, right: CORNER,  height: EDGE,   cursor: "ns-resize"   } },
  { dir: "e",  style: { right: 0,  top: CORNER,  bottom: CORNER, width: EDGE,    cursor: "ew-resize"   } },
  { dir: "w",  style: { left: 0,   top: CORNER,  bottom: CORNER, width: EDGE,    cursor: "ew-resize"   } },
  { dir: "ne", style: { top: 0,    right: 0,  width: CORNER, height: CORNER, cursor: "nesw-resize" } },
  { dir: "nw", style: { top: 0,    left: 0,   width: CORNER, height: CORNER, cursor: "nwse-resize" } },
  { dir: "se", style: { bottom: 0, right: 0,  width: CORNER, height: CORNER, cursor: "nwse-resize" } },
  { dir: "sw", style: { bottom: 0, left: 0,   width: CORNER, height: CORNER, cursor: "nesw-resize" } },
];

export default function OsWindow({
  title,
  onClose,
  onMinimize,
  isMinimized,
  children,
  defaultPosition = { x: 120, y: 60 },
  defaultSize = { w: 640, h: 460 },
  canvasW = 1440,
  canvasH = 900,
  maxSizeFraction = 0.9,
  maxPixelW,
  maxPixelH,
  snapLeft = false,
  openMaximized = false,
  autoHeight = false,
  onMaximize,
}: OsWindowProps) {
  const isMobile = canvasW < 1024;
  const TASKBAR_W = 56;
  const inset = isMobile ? 0 : 10;
  const CONTENT_W = (canvasW - inset * 2) - TASKBAR_W;
  const CONTENT_H = canvasH - inset * 2;
  const MAX_W = isMobile
    ? Math.round(CONTENT_W * 0.95)
    : Math.min(Math.round(CONTENT_W * maxSizeFraction), maxPixelW ?? Infinity);
  const MAX_H = Math.min(Math.round(CONTENT_H * maxSizeFraction), maxPixelH ?? Infinity);
  const MAX_X = isMobile
    ? TASKBAR_W + Math.round((CONTENT_W - MAX_W) / 2)
    : (snapLeft ? TASKBAR_W + 8 : TASKBAR_W + Math.round((CONTENT_W - MAX_W) / 2));
  const MAX_Y = Math.round((CONTENT_H - MAX_H) / 2);

  const [isMaximized, setIsMaximized] = useState(openMaximized || isMobile);
  const [titlebarHovered, setTitlebarHovered] = useState(false);
  const [buttonsHovered, setButtonsHovered] = useState(false);
  const [size, setSize] = useState({ w: defaultSize.w, h: defaultSize.h });
  const [isResizing, setIsResizing] = useState(false);

  const dragControls = useDragControls();
  const constraintsRef = useRef<HTMLDivElement>(null);
  // When opening maximized, place at the expanded position immediately
  const initX = openMaximized ? MAX_X : defaultPosition.x;
  const initY = openMaximized ? 30 : defaultPosition.y;
  const x = useMotionValue(initX);
  const y = useMotionValue(initY);
  const savedPos = useRef({ x: defaultPosition.x, y: defaultPosition.y });
  const hasMounted = useRef(false);

  // Notify parent of initial maximized state
  useEffect(() => {
    if (openMaximized) onMaximize?.(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hasMounted.current) { hasMounted.current = true; return; }
    if (isMaximized) {
      if (!isMobile) savedPos.current = { x: x.get(), y: y.get() };
      animate(x, MAX_X, { type: "spring", stiffness: 380, damping: 32 });
      animate(y, MAX_Y, { type: "spring", stiffness: 380, damping: 32 });
    } else if (isMobile) {
      // Mobile restore: half height, full width, stays at top
      setSize({ w: MAX_W, h: Math.round(MAX_H * 0.5) });
      animate(x, MAX_X, { type: "spring", stiffness: 380, damping: 32 });
      animate(y, MAX_Y, { type: "spring", stiffness: 380, damping: 32 });
    } else {
      animate(x, savedPos.current.x, { type: "spring", stiffness: 380, damping: 32 });
      animate(y, savedPos.current.y, { type: "spring", stiffness: 380, damping: 32 });
    }
    onMaximize?.(isMaximized);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMaximized]);

  const startResize = (e: React.PointerEvent, dir: ResizeDir) => {
    if (isMaximized || isMobile) return;
    e.preventDefault();
    e.stopPropagation();

    const startClientX = e.clientX;
    const startClientY = e.clientY;
    const startW = size.w;
    const startH = size.h;
    const startX = x.get();
    const startY = y.get();

    setIsResizing(true);

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startClientX;
      const dy = ev.clientY - startClientY;

      let newW = startW;
      let newH = startH;
      let newX = startX;
      let newY = startY;

      const RIGHT_EDGE  = TASKBAR_W + CONTENT_W;
      const BOTTOM_EDGE = CONTENT_H;

      if (dir.includes("e")) {
        newW = Math.min(MAX_W, RIGHT_EDGE - startX, Math.max(MIN_W, startW + dx));
      }
      if (dir.includes("s")) {
        newH = Math.min(MAX_H, BOTTOM_EDGE - startY, Math.max(MIN_H, startH + dy));
      }
      if (dir.includes("w")) {
        newW = Math.min(MAX_W, startW + (startX - TASKBAR_W), Math.max(MIN_W, startW - dx));
        newX = startX + startW - newW;
      }
      if (dir.includes("n")) {
        newH = Math.min(MAX_H, startH + startY, Math.max(MIN_H, startH - dy));
        newY = startY + startH - newH;
      }

      setSize({ w: newW, h: newH });
      x.set(newX);
      y.set(newY);
    };

    const onUp = () => {
      setIsResizing(false);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const btnSize = isMobile ? 13 : 11;
  const iconSize = isMobile ? 7 : 6;

  return (
    <>
      <div ref={constraintsRef} className="absolute inset-0 pointer-events-none" />

      <motion.div
        drag={!isResizing}
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={constraintsRef}
        dragElastic={0}
        dragMomentum={false}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={isMinimized ? { scale: 0.08, opacity: 0 } : { scale: 1, opacity: 1 }}
        exit={{ opacity: 0, scale: 0.93, transition: { duration: 0.18 } }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
        role="dialog"
        aria-label={title}
        aria-modal="true"
        style={{
          x, y,
          pointerEvents: "auto",
          touchAction: "none",
          width: isMaximized ? MAX_W : size.w,
          height: autoHeight ? "auto" : (isMaximized ? MAX_H : size.h),
          maxHeight: autoHeight ? MAX_H : undefined,
          transition: isResizing ? "none" : "width 0.35s ease, height 0.35s ease",
          position: "absolute",
          borderRadius: 16,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          background: "var(--window-bg)",
          backdropFilter: "blur(40px) saturate(160%)",
          WebkitBackdropFilter: "blur(40px) saturate(160%)",
          border: "1px solid var(--window-border)",
          boxShadow: "var(--window-shadow)",
        }}
      >
        {/* Resize handles — all 8 directions */}
        {!isMaximized && !isMobile && RESIZE_HANDLES.map(({ dir, style }) => (
          <div
            key={dir}
            onPointerDown={(e) => startResize(e, dir)}
            style={{ position: "absolute", zIndex: 20, ...style }}
          />
        ))}

        {/* Top accent edge — thin violet→cyan gradient line */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: 1,
          background: "linear-gradient(90deg, rgba(120,60,255,0.55) 0%, rgba(40,180,220,0.45) 55%, transparent 100%)",
          zIndex: 10,
          pointerEvents: "none",
        }} />

        {/* Title bar */}
        <div
          onPointerDown={(e) => dragControls.start(e)}
          onMouseEnter={() => setTitlebarHovered(true)}
          onMouseLeave={() => setTitlebarHovered(false)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingInline: 14,
            paddingTop: isMobile ? 14 : 10,
            paddingBottom: isMobile ? 14 : 10,
            cursor: isMobile ? "default" : "grab",
            userSelect: "none",
            flexShrink: 0,
            background: "var(--window-title-bg)",
            borderBottom: "1px solid var(--separator)",
            position: "relative",
          }}
        >
          {/* Window control dots */}
          <div
            style={{
              display: "flex", alignItems: "center", gap: 7,
              filter: isMobile ? "none" : (buttonsHovered ? "saturate(1)" : "saturate(0.38) opacity(0.52)"),
              transition: "filter 0.22s ease",
            }}
            onMouseEnter={() => setButtonsHovered(true)}
            onMouseLeave={() => setButtonsHovered(false)}
          >
            {/* Close */}
            <button
              onClick={onClose}
              aria-label={`Close ${title}`}
              style={{
                width: btnSize, height: btnSize,
                borderRadius: "50%",
                background: "rgba(255,59,48,0.72)",
                border: "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                cursor: "pointer",
              }}
              className="group"
            >
              <X size={iconSize} className={isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity"} strokeWidth={2.5} style={{ color: "rgba(140,20,10,0.9)" }} aria-hidden="true" />
            </button>

            {/* Maximize — desktop only */}
            {!isMobile && (
              <button
                onClick={() => setIsMaximized((m) => !m)}
                aria-label={isMaximized ? `Restore ${title}` : `Maximize ${title}`}
                style={{
                  width: btnSize, height: btnSize,
                  borderRadius: "50%",
                  background: "rgba(40,205,65,0.72)",
                  border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                  cursor: "pointer",
                }}
                className="group"
              >
                <Maximize2 size={iconSize} className="opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2.5} style={{ color: "rgba(0,80,20,0.9)" }} aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Title — centered */}
          <span
            className="font-mono absolute left-1/2 -translate-x-1/2"
            style={{
              fontSize: 10,
              letterSpacing: "0.08em",
              color: "var(--text-tertiary)",
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </span>

          {/* Right decorative dots */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, opacity: titlebarHovered ? 0.4 : 0.18, transition: "opacity 0.2s ease" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                width: 3, height: 3, borderRadius: "50%",
                background: "var(--text-tertiary)",
              }} />
            ))}
          </div>
        </div>

        {/* Content */}
        <div
          className={autoHeight ? "" : "flex-1 overflow-auto"}
          style={{ color: "var(--text-primary)", ...(autoHeight ? { overflowY: "auto", maxHeight: "inherit" } : {}) }}
        >
          {children}
        </div>
      </motion.div>
    </>
  );
}

"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import { FileText, Mail, type LucideIcon } from "lucide-react";

export interface DesktopItem {
  id: string;
  icon: LucideIcon | null;
  label: string;
  desktopOnly?: boolean;
}

export const DESKTOP_ITEMS: DesktopItem[] = [
  { id: "resume",  icon: FileText, label: "Resume.pdf"  },
  { id: "contact", icon: Mail,     label: "Contact"     },
  { id: "gimp",    icon: null,     label: "GIMP 2.10",  desktopOnly: true },
];

// Starting column positions (x from desktop left, y from desktop top)
const INITIAL_POSITIONS: Record<string, { x: number; y: number }> = {
  resume:  { x: 72, y: 24  },
  contact: { x: 72, y: 120 },
  gimp:    { x: 72, y: 216 },
};


interface DesktopIconsProps {
  onOpen: (id: string) => void;
  canvasW?: number;
  canvasH?: number;
  dimmed?: boolean;
}

export default function DesktopIcons({ onOpen, canvasW = 1440, canvasH = 900, dimmed = false }: DesktopIconsProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const handleSelect = (id: string | null) => setSelected(id);
  const isMobile = canvasW < 1024;
  const visibleItems = DESKTOP_ITEMS.filter(item => !isMobile || !item.desktopOnly);
  void canvasH;

  // ── Mobile: horizontal dock row at the top of content area ──
  if (isMobile) {
    return (
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: (!isMobile && dimmed) ? 0.12 : 1, transition: "opacity 0.4s ease" }}
      >
        <div
          style={{
            position: "absolute",
            top: 18,
            left: 68,
            right: 12,
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 6,
            pointerEvents: "auto",
          }}
        >
          {visibleItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                onClick={() => onOpen(item.id)}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.08 + i * 0.06, duration: 0.25, ease: "easeOut" }}
                className="desktop-icon flex flex-col items-center gap-1 p-1.5 rounded-xl"
                style={{ width: 62, pointerEvents: "auto", cursor: "pointer" }}
              >
                <div className="icon-frame w-11 h-11 flex items-center justify-center overflow-hidden relative" style={{ borderRadius: 14 }}>
                  {item.id === "gimp" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src="/gimp-logo.webp" alt="GIMP" width={28} height={28} style={{ objectFit: "contain" }} />
                  ) : item.id === "flappy" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src="/flappy-bird.webp" alt="Flappy Bird" width={28} height={28} style={{ objectFit: "contain" }} />
                  ) : Icon ? (
                    <Icon size={20} strokeWidth={1.3} style={{ color: "var(--desktop-icon-text)" }} />
                  ) : null}
                </div>
                <span className="icon-label font-sans text-[10px] font-medium leading-tight text-center select-none" style={{ color: "var(--desktop-icon-text)" }}>
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Desktop: vertical draggable column ──
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: dimmed ? 0.12 : 1, transition: "opacity 0.4s ease" }}
    >
      {visibleItems.map((item, i) => (
        <DraggableIcon
          key={item.id}
          item={item}
          index={i}
          initX={INITIAL_POSITIONS[item.id]?.x ?? 72}
          initY={INITIAL_POSITIONS[item.id]?.y ?? 24 + i * 96}
          isSelected={selected === item.id}
          onSelect={handleSelect}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}

interface DraggableIconProps {
  item: DesktopItem;
  index: number;
  initX: number;
  initY: number;
  isSelected: boolean;
  onSelect: (id: string | null) => void;
  onOpen: (id: string) => void;
}

function WilberIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Wizard hat */}
      <polygon points="16,2 9,13 23,13" fill="#3a7d44" />
      <rect x="8" y="12" width="16" height="3" rx="1.5" fill="#4caf65" />
      {/* Hat star */}
      <polygon points="16,4 16.6,5.8 18.5,5.8 17,6.9 17.6,8.7 16,7.6 14.4,8.7 15,6.9 13.5,5.8 15.4,5.8" fill="#f9e04b" />
      {/* Head/face */}
      <ellipse cx="16" cy="21" rx="9" ry="8" fill="#f4a623" />
      {/* Left ear */}
      <ellipse cx="8" cy="17" rx="2.5" ry="3.5" fill="#e8891a" transform="rotate(-15 8 17)" />
      {/* Right ear */}
      <ellipse cx="24" cy="17" rx="2.5" ry="3.5" fill="#e8891a" transform="rotate(15 24 17)" />
      {/* Eyes whites */}
      <ellipse cx="12.5" cy="20" rx="2.8" ry="2.5" fill="white" />
      <ellipse cx="19.5" cy="20" rx="2.8" ry="2.5" fill="white" />
      {/* Pupils */}
      <circle cx="13" cy="20.5" r="1.5" fill="#1a1a3e" />
      <circle cx="20" cy="20.5" r="1.5" fill="#1a1a3e" />
      {/* Eye shines */}
      <circle cx="13.6" cy="19.8" r="0.5" fill="white" />
      <circle cx="20.6" cy="19.8" r="0.5" fill="white" />
      {/* Monocle on right eye */}
      <circle cx="19.5" cy="20" r="3" stroke="#c0851a" strokeWidth="0.8" fill="none" />
      {/* Nose */}
      <ellipse cx="16" cy="23.5" rx="2" ry="1.2" fill="#d4771a" />
      {/* Mouth */}
      <path d="M13.5 25.5 Q16 27.5 18.5 25.5" stroke="#c0601a" strokeWidth="0.9" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function FlappyBirdIcon({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {/* Sky bg */}
      <rect width="40" height="40" rx="4" fill="#70c5ce" />
      {/* Body */}
      <ellipse cx="21" cy="24" rx="10" ry="8" fill="#f9c93c" />
      {/* Wing */}
      <ellipse cx="15" cy="23" rx="5" ry="3.5" fill="#f4a800" transform="rotate(-10 15 23)" />
      {/* Head */}
      <circle cx="27" cy="16" r="7" fill="#f9c93c" />
      {/* Eye */}
      <circle cx="29" cy="14" r="2.8" fill="white" />
      <circle cx="29.8" cy="14" r="1.4" fill="#1a1a1a" />
      <circle cx="30.3" cy="13.4" r="0.5" fill="white" />
      {/* Beak */}
      <path d="M33 15 L38 13 L33 18 Z" fill="#f05a28" />
      <path d="M33 18 L38 16 L33 21 Z" fill="#d44010" />
      {/* Belly */}
      <ellipse cx="22" cy="27" rx="5" ry="3.5" fill="#f5e0a0" />
    </svg>
  );
}

function DraggableIcon({ item, index, initX, initY, isSelected, onSelect, onOpen }: DraggableIconProps) {
  const x = useMotionValue(initX);
  const y = useMotionValue(initY);
  const [isDragging, setIsDragging] = useState(false);
  const dragOccurred = useRef(false);
  const Icon = item.icon;

  const handleClick = () => {
    if (dragOccurred.current) {
      dragOccurred.current = false;
      return;
    }
    onSelect(item.id);
    onOpen(item.id);
    setTimeout(() => onSelect(null), 350);
  };

  return (
    <motion.button
      drag
      dragMomentum={false}
      dragElastic={0}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        x,
        y,
        touchAction: "none",
        pointerEvents: "auto",
        zIndex: isDragging ? 999 : 1,
        cursor: isDragging ? "grabbing" : "default",
      }}
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.08 + index * 0.06, duration: 0.25, ease: "easeOut" }}
      onDragStart={() => { setIsDragging(true); dragOccurred.current = false; }}
      onDrag={() => { dragOccurred.current = true; }}
      onDragEnd={() => { setIsDragging(false); }}
      onClick={handleClick}
      className={`desktop-icon flex flex-col items-center gap-1.5 p-2 w-[80px] rounded-xl ${
        isSelected ? "selected" : ""
      }`}
    >
      {/* Icon frame */}
      <div
        className="icon-frame w-12 h-12 flex items-center justify-center overflow-hidden relative"
        style={item.id === "about" ? {
          backgroundImage: "url('/profile.png')",
          backgroundSize: "170%",
          backgroundPosition: "center 15%",
        } : {}}
      >
        {item.id === "gimp" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/gimp-logo.webp" alt="GIMP" width={34} height={34} style={{ objectFit: "contain" }} />
        ) : item.id === "flappy" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/flappy-bird.webp" alt="Flappy Bird" width={34} height={34} style={{ objectFit: "contain" }} />
        ) : item.id !== "about" && Icon ? (
          <Icon size={22} strokeWidth={1.3} style={{ color: "var(--desktop-icon-text)" }} />
        ) : null}
      </div>

      {/* Label */}
      <span
        className="icon-label font-sans text-[11px] font-medium leading-tight text-center select-none"
        style={{ color: "var(--desktop-icon-text)" }}
      >
        {item.label}
      </span>
    </motion.button>
  );
}

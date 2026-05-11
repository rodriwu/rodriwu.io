"use client";

import React, { useState } from "react";
import { Paintbrush, Mail, Info, LayoutGrid, LayoutList, ChevronRight } from "lucide-react";

/* ── Apps ── */
interface DesktopApp {
  id: string;
  label: string;
  gradient: string;
  Icon: React.ElementType;
  img?: string;
}

const DESKTOP_APPS: DesktopApp[] = [
  { id: "about",   label: "About",   gradient: "linear-gradient(145deg,var(--desktop-icon-bg),var(--desktop-icon-hover-bg))", Icon: Info },
  { id: "contact", label: "Contact", gradient: "linear-gradient(145deg,var(--desktop-icon-bg),var(--desktop-icon-hover-bg))", Icon: Mail },
  { id: "gimp",    label: "GIMP",    gradient: "linear-gradient(145deg,var(--desktop-icon-bg),var(--desktop-icon-hover-bg))", Icon: Paintbrush, img: "/gimp-logo.webp" },
];

/* ── Case Studies ── */
interface CaseStudy {
  id: string;
  label: string;
  img: string;
  tag: string;
  year: string;
}

const CASE_STUDIES: CaseStudy[] = [
  { id: "moving-place", label: "Moving Place", img: "/mp-preview.webp", tag: "Brand Identity", year: "2024" },
];

/* ── Squircle icon ── */
const SQUIRCLE = "22%";

function SquircleIcon({ gradient, size = 72, children, appStyle = false }: {
  gradient: string; size?: number; children?: React.ReactNode; appStyle?: boolean;
}) {
  return (
    <div style={{
      width: size, height: size, borderRadius: SQUIRCLE,
      background: appStyle ? "rgba(255,255,255,0.12)" : gradient,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, position: "relative", overflow: "hidden",
      backdropFilter: appStyle ? "blur(16px) saturate(150%)" : undefined,
      WebkitBackdropFilter: appStyle ? "blur(16px) saturate(150%)" : undefined,
      border: appStyle ? "1px solid rgba(255,255,255,0.22)" : "none",
      boxShadow: appStyle
        ? "0 4px 16px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.35)"
        : "0 4px 14px rgba(0,0,0,0.22), 0 1px 4px rgba(0,0,0,0.14)",
    }}>
      {appStyle && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "50%",
          background: "linear-gradient(180deg,rgba(255,255,255,0.18) 0%,rgba(255,255,255,0) 100%)",
          borderRadius: `${SQUIRCLE} ${SQUIRCLE} 0 0`, pointerEvents: "none",
        }} />
      )}
      {children}
    </div>
  );
}

/* ── View toggle ── */
type ViewMode = "grid" | "list";

function ViewToggle({ mode, onChange }: { mode: ViewMode; onChange: (m: ViewMode) => void }) {
  return (
    <div style={{ display: "flex", gap: 2, padding: 2, background: "var(--desktop-icon-hover-bg)", borderRadius: 8, border: "1px solid var(--window-border)" }}>
      {(["grid", "list"] as ViewMode[]).map((m) => (
        <button key={m} onClick={() => onChange(m)}
          style={{
            width: 26, height: 22, borderRadius: 6,
            background: mode === m ? "var(--window-bg)" : "transparent",
            border: mode === m ? "1px solid var(--window-border)" : "1px solid transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: mode === m ? "var(--text-primary)" : "var(--text-tertiary)",
            transition: "all 0.15s ease",
          }}
          aria-label={m === "grid" ? "Grid view" : "List view"}
        >
          {m === "grid" ? <LayoutGrid size={12} strokeWidth={1.8} /> : <LayoutList size={12} strokeWidth={1.8} />}
        </button>
      ))}
    </div>
  );
}

/* ── Section header ── */
function SectionLabel({ label }: { label: string }) {
  return (
    <p className="font-mono text-[10px] tracking-[0.15em] uppercase" style={{ color: "var(--text-tertiary)" }}>
      {label}
    </p>
  );
}

/* ── Case study thumbnail card (grid) ── */
function CaseStudyCard({ study, hovered, onEnter, onLeave }: {
  study: CaseStudy;
  hovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        width: 140,
        borderRadius: 10,
        overflow: "hidden",
        background: hovered ? "var(--desktop-icon-hover-bg)" : "transparent",
        padding: 6,
        cursor: "pointer",
        transition: "background 0.15s ease",
      }}
    >
      {/* Thumbnail */}
      <div style={{
        width: "100%", height: 96,
        borderRadius: 7, overflow: "hidden",
        position: "relative",
        border: "1px solid var(--window-border)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={study.img}
          alt={study.label}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block" }}
        />
        {/* Overlay with tag */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: 5, left: 6,
          fontFamily: "monospace", fontSize: 7,
          color: "rgba(255,255,255,0.75)", letterSpacing: "0.10em",
          textTransform: "uppercase",
        }}>
          {study.tag}
        </div>
      </div>

      {/* Label row */}
      <div style={{ marginTop: 6, paddingLeft: 2 }}>
        <p className="font-sans text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
          {study.label}
        </p>
        <p className="font-mono text-[9px]" style={{ color: "var(--text-tertiary)", marginTop: 1 }}>
          {study.year}
        </p>
      </div>
    </div>
  );
}

/* ── Case study list row ── */
function CaseStudyRow({ study, hovered, onEnter, onLeave }: {
  study: CaseStudy;
  hovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "8px 12px", borderRadius: 12,
        background: hovered ? "var(--desktop-icon-hover-bg)" : "transparent",
        cursor: "pointer", transition: "background 0.15s ease",
      }}
    >
      {/* Thumbnail */}
      <div style={{
        width: 44, height: 33, borderRadius: 6, overflow: "hidden", flexShrink: 0,
        border: "1px solid var(--window-border)",
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={study.img} alt={study.label}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block" }} />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p className="font-sans text-[12px] font-medium" style={{ color: "var(--text-primary)" }}>
          {study.label}
        </p>
        <p className="font-mono text-[9px]" style={{ color: "var(--text-tertiary)", marginTop: 1, letterSpacing: "0.06em" }}>
          {study.tag} · {study.year}
        </p>
      </div>

      <ChevronRight size={12} strokeWidth={2} style={{ color: "var(--text-tertiary)", flexShrink: 0 }} />
    </div>
  );
}

/* ── Main component ── */
interface WorkWindowProps {
  onOpenApp?: (id: string) => void;
}

export default function WorkWindow({ onOpenApp }: WorkWindowProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const open = onOpenApp ?? (() => {});

  return (
    <div className="p-6 h-full overflow-auto">

      {/* ── Apps section ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <SectionLabel label="Apps" />
        <ViewToggle mode={viewMode} onChange={setViewMode} />
      </div>

      {viewMode === "grid" && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
          {DESKTOP_APPS.map((app) => (
            <button key={app.id} onClick={() => open(app.id)}
              onMouseEnter={() => setHovered(app.id)}
              onMouseLeave={() => setHovered(null)}
              className="flex flex-col items-center gap-2 p-2 rounded-2xl transition-all"
              style={{ background: hovered === app.id ? "var(--desktop-icon-hover-bg)" : "transparent", cursor: "pointer", width: 80 }}
            >
              <SquircleIcon gradient={app.gradient} size={56} appStyle>
                {app.img
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={app.img} alt={app.label} width={32} height={32} style={{ objectFit: "contain" }} />
                  : <app.Icon size={20} strokeWidth={1.4} style={{ color: "var(--text-secondary)" }} />
                }
              </SquircleIcon>
              <p className="font-sans text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>{app.label}</p>
            </button>
          ))}
        </div>
      )}

      {viewMode === "list" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 28 }}>
          {DESKTOP_APPS.map((app) => (
            <button key={app.id} onClick={() => open(app.id)}
              onMouseEnter={() => setHovered(app.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "flex", alignItems: "center", gap: 14, padding: "8px 12px", borderRadius: 12,
                background: hovered === app.id ? "var(--desktop-icon-hover-bg)" : "transparent",
                border: "none", cursor: "pointer", width: "100%", transition: "background 0.15s ease",
              }}
            >
              <SquircleIcon gradient={app.gradient} size={34} appStyle>
                {app.img
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={app.img} alt={app.label} width={20} height={20} style={{ objectFit: "contain" }} />
                  : <app.Icon size={16} strokeWidth={1.4} style={{ color: "var(--text-secondary)" }} />
                }
              </SquircleIcon>
              <p className="font-sans text-[12px] font-medium" style={{ color: "var(--text-primary)", flex: 1, textAlign: "left" }}>{app.label}</p>
              <ChevronRight size={12} strokeWidth={2} style={{ color: "var(--text-tertiary)" }} />
            </button>
          ))}
        </div>
      )}

      {/* ── Divider ── */}
      <div style={{ height: 1, background: "var(--separator)", marginBottom: 20 }} />

      {/* ── Case Studies section ── */}
      <div style={{ marginBottom: 16 }}>
        <SectionLabel label="Case Studies" />
      </div>

      {viewMode === "grid" && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 28 }}>
          {CASE_STUDIES.map((study) => (
            <CaseStudyCard
              key={study.id}
              study={study}
              hovered={hovered === study.id}
              onEnter={() => setHovered(study.id)}
              onLeave={() => setHovered(null)}
            />
          ))}
        </div>
      )}

      {viewMode === "list" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 28 }}>
          {CASE_STUDIES.map((study) => (
            <CaseStudyRow
              key={study.id}
              study={study}
              hovered={hovered === study.id}
              onEnter={() => setHovered(study.id)}
              onLeave={() => setHovered(null)}
            />
          ))}
        </div>
      )}

      <div className="mt-4">
        <p className="font-mono text-[10px]" style={{ color: "var(--text-tertiary)", opacity: 0.55, letterSpacing: "0.05em" }}>
          © Rodriwu. All rights reserved. · Eat fruits and vegetables.
        </p>
      </div>
    </div>
  );
}

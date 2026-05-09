"use client";

import React, { useState } from "react";
import { ArrowLeft, ExternalLink, Paintbrush, Mail, Info, FolderOpen, LayoutGrid, LayoutList, ChevronRight } from "lucide-react";

interface CaseStudy {
  id: string;
  name: string;
  year: string;
  role: string;
  tags: string[];
  description: string;
  url?: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: "cs1",
    name: "Design System — Core",
    year: "2024",
    role: "Lead Designer",
    tags: ["Design Systems", "Tokens", "Components"],
    description:
      "Built a scalable multi-brand design system from scratch. Defined token architecture, component specs, and documentation — enabling 3 product teams to ship consistently.",
    url: undefined,
  },
  {
    id: "cs2",
    name: "Onboarding Redesign",
    year: "2023",
    role: "UX · Interaction Design",
    tags: ["UX Research", "Interaction", "Prototyping"],
    description:
      "Redesigned the new-user onboarding flow for a SaaS product. Reduced drop-off by 38% through iterative usability testing and progressive disclosure patterns.",
    url: undefined,
  },
  {
    id: "cs3",
    name: "Mobile Dashboard",
    year: "2023",
    role: "UI · Motion Design",
    tags: ["Mobile", "UI", "Motion"],
    description:
      "End-to-end design of a data-heavy mobile dashboard. Focused on information hierarchy, micro-interactions, and accessibility across iOS and Android.",
    url: undefined,
  },
  {
    id: "cs4",
    name: "E-Commerce Checkout",
    year: "2022",
    role: "UX · UI Design",
    tags: ["E-Commerce", "Conversion", "UX"],
    description:
      "Streamlined a 7-step checkout into 2 steps. Identified friction points via session recordings and A/B testing — increased conversion rate by 22%.",
    url: undefined,
  },
  {
    id: "cs5",
    name: "Internal Tools Suite",
    year: "2022",
    role: "Product Design",
    tags: ["Internal Tools", "Efficiency", "Research"],
    description:
      "Redesigned a legacy internal CRM used by 120+ agents. Cut average task time by 40% through workflow analysis and contextual inquiry sessions.",
    url: undefined,
  },
];

// Gradient per case study for the squircle thumbnails
const CS_GRADIENTS = [
  "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
  "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
  "linear-gradient(135deg, #10b981 0%, #0891b2 100%)",
  "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
];

const CS_INITIALS = ["DS", "UX", "MB", "EC", "IT"];

interface DesktopApp {
  id: string;
  label: string;
  gradient: string;
  Icon: React.ElementType;
  img?: string;
}

const DESKTOP_APPS: DesktopApp[] = [
  { id: "about",   label: "About",        gradient: "linear-gradient(145deg,var(--desktop-icon-bg),var(--desktop-icon-hover-bg))", Icon: Info },
  { id: "contact", label: "Contact",      gradient: "linear-gradient(145deg,var(--desktop-icon-bg),var(--desktop-icon-hover-bg))", Icon: Mail },
  { id: "gimp",    label: "GIMP",         gradient: "linear-gradient(145deg,var(--desktop-icon-bg),var(--desktop-icon-hover-bg))", Icon: Paintbrush, img: "/gimp-logo.webp" },
  { id: "flappy",  label: "Flappy Bird",  gradient: "linear-gradient(145deg,var(--desktop-icon-bg),var(--desktop-icon-hover-bg))", Icon: ExternalLink, img: "/flappy-bird.webp" },
];

interface FolderGridProps {
  onOpen: (cs: CaseStudy) => void;
  onOpenApp: (id: string) => void;
}

// Squircle border-radius — matches Ubuntu launcher aesthetic
const SQUIRCLE = "22%";

function SquircleIcon({
  gradient, size = 72, children, appStyle = false,
}: {
  gradient: string; size?: number; children?: React.ReactNode; appStyle?: boolean;
}) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: SQUIRCLE,
      background: appStyle
        ? "rgba(255,255,255,0.12)"
        : gradient,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
      position: "relative",
      overflow: "hidden",
      backdropFilter: appStyle ? "blur(16px) saturate(150%)" : undefined,
      WebkitBackdropFilter: appStyle ? "blur(16px) saturate(150%)" : undefined,
      border: appStyle
        ? "1px solid rgba(255,255,255,0.22)"
        : "none",
      boxShadow: appStyle
        ? "0 4px 16px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.35)"
        : "0 4px 14px rgba(0,0,0,0.22), 0 1px 4px rgba(0,0,0,0.14)",
    }}>
      {/* Glass inner highlight */}
      {appStyle && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "50%",
          background: "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 100%)",
          borderRadius: `${SQUIRCLE} ${SQUIRCLE} 0 0`,
          pointerEvents: "none",
        }} />
      )}
      {children}
    </div>
  );
}

type ViewMode = "grid" | "list";

function ViewToggle({ mode, onChange }: { mode: ViewMode; onChange: (m: ViewMode) => void }) {
  return (
    <div style={{
      display: "flex", gap: 2, padding: 2,
      background: "var(--desktop-icon-hover-bg)",
      borderRadius: 8, border: "1px solid var(--window-border)",
    }}>
      {(["grid", "list"] as ViewMode[]).map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          style={{
            width: 26, height: 22, borderRadius: 6,
            background: mode === m ? "var(--window-bg)" : "transparent",
            border: mode === m ? "1px solid var(--window-border)" : "1px solid transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            color: mode === m ? "var(--text-primary)" : "var(--text-tertiary)",
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

function FolderGrid({ onOpen, onOpenApp }: FolderGridProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  return (
    <div className="p-6 h-full overflow-auto">

      {/* ── Case Studies header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <p className="font-mono text-[10px] tracking-[0.15em] uppercase" style={{ color: "var(--text-tertiary)" }}>
          Work / Case Studies
        </p>
        <ViewToggle mode={viewMode} onChange={setViewMode} />
      </div>

      {/* ── Grid view ── */}
      {viewMode === "grid" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(88px, 1fr))", gap: "20px 8px" }}>
          {CASE_STUDIES.map((cs, i) => (
            <button
              key={cs.id}
              onClick={() => onOpen(cs)}
              onMouseEnter={() => setHovered(cs.id)}
              onMouseLeave={() => setHovered(null)}
              className="flex flex-col items-center gap-2 p-2 rounded-2xl transition-all"
              style={{
                background: hovered === cs.id ? "var(--desktop-icon-hover-bg)" : "transparent",
                cursor: "pointer",
              }}
            >
              <SquircleIcon gradient={CS_GRADIENTS[i % CS_GRADIENTS.length]}>
                <span style={{ fontSize: 18, fontWeight: 600, color: "rgba(255,255,255,0.92)", letterSpacing: "-0.01em" }}>
                  {CS_INITIALS[i]}
                </span>
              </SquircleIcon>
              <div style={{ textAlign: "center" }}>
                <p className="font-sans text-[11px] font-medium leading-tight" style={{ color: "var(--text-primary)" }}>
                  {cs.name}
                </p>
                <p className="font-mono text-[9px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>{cs.year}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ── List view ── */}
      {viewMode === "list" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {CASE_STUDIES.map((cs, i) => (
            <button
              key={cs.id}
              onClick={() => onOpen(cs)}
              onMouseEnter={() => setHovered(cs.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "10px 12px",
                borderRadius: 12,
                background: hovered === cs.id ? "var(--desktop-icon-hover-bg)" : "transparent",
                border: "none", cursor: "pointer", width: "100%",
                transition: "background 0.15s ease",
              }}
            >
              <SquircleIcon gradient={CS_GRADIENTS[i % CS_GRADIENTS.length]} size={38}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.92)" }}>
                  {CS_INITIALS[i]}
                </span>
              </SquircleIcon>
              <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
                <p className="font-sans text-[12px] font-medium" style={{ color: "var(--text-primary)" }}>{cs.name}</p>
                <p className="font-mono text-[10px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>{cs.role}</p>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "flex-end", maxWidth: 180 }}>
                {cs.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="font-mono text-[9px] px-2 py-0.5 rounded-md"
                    style={{ background: "var(--desktop-icon-hover-bg)", border: "1px solid var(--window-border)", color: "var(--text-tertiary)", whiteSpace: "nowrap" }}>
                    {tag}
                  </span>
                ))}
              </div>
              <span className="font-mono text-[9px] flex-shrink-0" style={{ color: "var(--text-tertiary)" }}>{cs.year}</span>
              <ChevronRight size={12} strokeWidth={2} style={{ color: "var(--text-tertiary)", flexShrink: 0 }} />
            </button>
          ))}
        </div>
      )}

      {/* ── Apps ── */}
      <p className="font-mono text-[10px] tracking-[0.15em] uppercase mt-8 mb-4" style={{ color: "var(--text-tertiary)" }}>
        Apps
      </p>

      {viewMode === "grid" && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {DESKTOP_APPS.map((app) => (
            <button
              key={app.id}
              onClick={() => onOpenApp(app.id)}
              onMouseEnter={() => setHovered(app.id)}
              onMouseLeave={() => setHovered(null)}
              className="flex flex-col items-center gap-2 p-2 rounded-2xl transition-all"
              style={{
                background: hovered === app.id ? "var(--desktop-icon-hover-bg)" : "transparent",
                cursor: "pointer", width: 80,
              }}
            >
              <SquircleIcon gradient={app.gradient} size={56} appStyle>
                {app.img
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={app.img} alt={app.label} width={32} height={32} style={{ objectFit: "contain" }} />
                  : <app.Icon size={20} strokeWidth={1.4} style={{ color: "var(--text-secondary)" }} />
                }
              </SquircleIcon>
              <p className="font-sans text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
                {app.label}
              </p>
            </button>
          ))}
        </div>
      )}

      {viewMode === "list" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {DESKTOP_APPS.map((app) => (
            <button
              key={app.id}
              onClick={() => onOpenApp(app.id)}
              onMouseEnter={() => setHovered(app.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "8px 12px",
                borderRadius: 12,
                background: hovered === app.id ? "var(--desktop-icon-hover-bg)" : "transparent",
                border: "none", cursor: "pointer", width: "100%",
                transition: "background 0.15s ease",
              }}
            >
              <SquircleIcon gradient={app.gradient} size={34} appStyle>
                {app.img
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={app.img} alt={app.label} width={20} height={20} style={{ objectFit: "contain" }} />
                  : <app.Icon size={16} strokeWidth={1.4} style={{ color: "var(--text-secondary)" }} />
                }
              </SquircleIcon>
              <p className="font-sans text-[12px] font-medium" style={{ color: "var(--text-primary)", flex: 1, textAlign: "left" }}>
                {app.label}
              </p>
              <ChevronRight size={12} strokeWidth={2} style={{ color: "var(--text-tertiary)" }} />
            </button>
          ))}
        </div>
      )}

      <div className="mt-8">
        <p className="font-mono text-[10px]" style={{ color: "var(--text-tertiary)", opacity: 0.55, letterSpacing: "0.05em" }}>
          © Rodriwu. All rights reserved. · Eat fruits and vegetables.
        </p>
      </div>
    </div>
  );
}

function CaseStudyDetail({ cs, onBack }: { cs: CaseStudy; onBack: () => void }) {
  return (
    <div className="p-6 h-full overflow-auto">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 mb-6 font-mono text-[10px] transition-opacity hover:opacity-60"
        style={{ color: "var(--text-tertiary)", cursor: "pointer" }}
      >
        <ArrowLeft size={11} strokeWidth={2} />
        Work
      </button>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <FolderOpen size={20} strokeWidth={1.4} style={{ color: "var(--text-secondary)" }} />
          <span className="font-mono text-[10px]" style={{ color: "var(--text-tertiary)" }}>{cs.year}</span>
        </div>
        <h2 className="font-sans font-semibold mb-1" style={{ fontSize: 17, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
          {cs.name}
        </h2>
        <p className="font-mono text-[11px]" style={{ color: "var(--text-secondary)" }}>{cs.role}</p>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "var(--separator)", marginBottom: 20 }} />

      {/* Meta rows */}
      <div className="mb-5">
        {[
          { label: "Year",  value: cs.year },
          { label: "Role",  value: cs.role },
        ].map(({ label, value }) => (
          <div key={label} className="flex gap-4 py-[6px]" style={{ borderBottom: "1px solid var(--separator)" }}>
            <span className="font-mono text-[11px] flex-shrink-0 text-right" style={{ width: 60, color: "var(--text-tertiary)" }}>{label}</span>
            <span className="font-mono text-[11px]" style={{ color: "var(--text-primary)" }}>{value}</span>
          </div>
        ))}
        <div className="flex gap-4 py-[6px]" style={{ borderBottom: "1px solid var(--separator)" }}>
          <span className="font-mono text-[11px] flex-shrink-0 text-right" style={{ width: 60, color: "var(--text-tertiary)" }}>Tags</span>
          <div className="flex flex-wrap gap-1.5">
            {cs.tags.map((tag) => (
              <span key={tag} className="font-mono text-[9px] px-2 py-0.5 rounded-md"
                style={{ background: "var(--desktop-icon-hover-bg)", border: "1px solid var(--window-border)", color: "var(--text-secondary)" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="font-sans text-[12px] leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
        {cs.description}
      </p>

      {/* CTA */}
      {cs.url && (
        <a href={cs.url} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-mono text-[11px] px-4 py-2 rounded-lg transition-opacity hover:opacity-70"
          style={{ background: "var(--desktop-icon-hover-bg)", border: "1px solid var(--window-border)", color: "var(--text-primary)", textDecoration: "none" }}>
          <ExternalLink size={11} strokeWidth={2} />
          View case study
        </a>
      )}

      {!cs.url && (
        <p className="font-mono text-[10px]" style={{ color: "var(--text-tertiary)" }}>
          Full case study available on request.
        </p>
      )}

      <div className="mt-6 pt-4" style={{ borderTop: "1px solid var(--separator)" }}>
        <p className="font-mono text-[10px]" style={{ color: "var(--text-tertiary)", opacity: 0.55, letterSpacing: "0.05em" }}>
          © Rodriwu. All rights reserved. · Eat fruits and vegetables.
        </p>
      </div>
    </div>
  );
}

interface WorkWindowProps {
  onOpenApp?: (id: string) => void;
}

export default function WorkWindow({ onOpenApp }: WorkWindowProps) {
  const [open, setOpen] = useState<CaseStudy | null>(null);

  return open
    ? <CaseStudyDetail cs={open} onBack={() => setOpen(null)} />
    : <FolderGrid onOpen={setOpen} onOpenApp={onOpenApp ?? (() => {})} />;
}

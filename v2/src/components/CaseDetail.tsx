"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, X, Check, Dot } from "lucide-react";
import { useShell } from "./context/ShellContext";
import {
  CASE_STUDIES,
  type CaseBlock,
  type CaseSection,
  type CaseStudy,
} from "@/data/caseStudies";

export default function CaseDetail({ cs }: { cs: CaseStudy }) {
  const { isDark } = useShell();

  const accent = isDark ? "#CFF24A" : "#7B5CF6";
  const ink    = isDark ? "rgba(255,255,255,0.94)" : "rgba(10,12,35,0.92)";
  const body   = isDark ? "rgba(255,255,255,0.66)" : "rgba(10,12,35,0.62)";
  const dim    = isDark ? "rgba(255,255,255,0.40)" : "rgba(10,12,35,0.42)";
  const fade   = isDark ? "rgba(255,255,255,0.10)" : "rgba(10,12,35,0.12)";
  const cardBg = isDark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.022)";

  const idx  = CASE_STUDIES.findIndex((c) => c.id === cs.id);
  const next = (cs.nextCaseId ? CASE_STUDIES.find((c) => c.id === cs.nextCaseId) : null)
    ?? CASE_STUDIES[(idx + 1) % CASE_STUDIES.length];
  const pad  = (n: number) => String(n).padStart(2, "0");
  const sections = cs.body ?? [];

  return (
    <div style={{ width: "100%" }}>
      <article style={{ maxWidth: 1240, margin: "0 auto", padding: "28px var(--rw-body-pad) 64px" }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36 }}>
          <Link href="/" className="font-mono inline-flex items-center gap-2"
            style={{ fontSize: 11, letterSpacing: "0.14em", color: dim, textDecoration: "none" }}>
            <ArrowLeft size={13} strokeWidth={1.8} />
            BACK
          </Link>
          <span className="font-mono" style={{ fontSize: 10, letterSpacing: "0.16em", color: dim }}>
            CASE·{cs.id.toUpperCase()} · {pad(idx + 1)}/{pad(CASE_STUDIES.length)}
          </span>
        </div>

        <Hero cs={cs} accent={accent} ink={ink} body={body} dim={dim} fade={fade} cardBg={cardBg} isDark={isDark} />
      </article>

      {sections.length > 0 ? (
        <Body sections={sections} accent={accent} ink={ink} body={body} dim={dim} fade={fade} cardBg={cardBg} />
      ) : (
        <FallbackBody cs={cs} ink={ink} body={body} dim={dim} fade={fade} cardBg={cardBg} />
      )}

      <article style={{ maxWidth: 1240, margin: "0 auto", padding: "0 var(--rw-body-pad) 80px" }}>
        <NextCase next={next} accent={accent} ink={ink} dim={dim} fade={fade} cardBg={cardBg} />
        <ContactCTA accent={accent} ink={ink} body={body} dim={dim} fade={fade} />
      </article>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Hero
   ────────────────────────────────────────────────────────────── */
function Hero({
  cs, accent, ink, body, dim, fade, cardBg, isDark,
}: {
  cs: CaseStudy; accent: string; ink: string; body: string;
  dim: string; fade: string; cardBg: string; isDark: boolean;
}) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const metaFields = [
    { label: "Client",       value: cs.company },
    { label: "Engagement",   value: cs.year },
    { label: "Role",         value: cs.role },
    { label: "Deliverables", value: cs.deliverables },
  ];

  return (
    <header style={{ marginBottom: isMobile ? 40 : 80 }}>
      {/* Eyebrow */}
      <div className="font-mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: dim, marginBottom: isMobile ? 16 : 28, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
        <span>{cs.company.toUpperCase()}</span>
        <span style={{ color: fade }}>·</span>
        <span>{cs.year.toUpperCase()}</span>
        <span style={{ color: fade }}>·</span>
        <span style={{ color: accent }}>{cs.tagline.replace(/\.$/, "").toUpperCase()}</span>
      </div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="font-mono"
        style={{
          fontSize: "clamp(36px, 6vw, 84px)",
          fontWeight: 500,
          color: ink,
          lineHeight: 1.04,
          letterSpacing: "-0.04em",
          marginBottom: isMobile ? 28 : 56,
          maxWidth: 960,
        }}
      >
        {cs.title}
      </motion.h1>

      {/* Cover */}
      <div style={isMobile ? { width: "100%" } : {
        width: "calc(100vw - var(--rw-sidebar))",
        marginLeft: "calc((100vw - var(--rw-sidebar) - 100%) / -2)",
        marginRight: "calc((100vw - var(--rw-sidebar) - 100%) / -2)",
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: "relative", width: "100%", maxWidth: "calc(90vh * 16 / 9)", aspectRatio: "16 / 9", overflow: "hidden", background: cardBg, margin: "0 auto" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cs.cover} alt={cs.shortTitle} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
        </motion.div>

        {/* Metadata strip — 2×2 on mobile, 4-col on desktop */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
          borderTop: `1px solid ${fade}`,
          borderBottom: `1px solid ${fade}`,
        }}>
          {metaFields.map((field, i) => {
            const borderLeft = isMobile
              ? i % 2 !== 0 ? `1px solid ${fade}` : "none"
              : i > 0 ? `1px solid ${fade}` : "none";
            const borderTop = isMobile && i >= 2 ? `1px solid ${fade}` : "none";
            return (
              <div key={field.label} style={{ padding: isMobile ? "18px 16px" : "24px clamp(16px, 3vw, 40px)", borderLeft, borderTop }}>
                <div className="font-mono" style={{ fontSize: 9, letterSpacing: "0.20em", color: dim, marginBottom: 8, textTransform: "uppercase" }}>
                  {field.label}
                </div>
                <div style={{ fontSize: isMobile ? 13 : 15, lineHeight: 1.4, color: ink, letterSpacing: "-0.005em" }}>
                  {field.value}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}

/* ──────────────────────────────────────────────────────────────
   Body — sticky TOC on desktop, static TOC on mobile
   ────────────────────────────────────────────────────────────── */
function Body({
  sections, accent, ink, body, dim, fade, cardBg,
}: {
  sections: CaseSection[]; accent: string;
  ink: string; body: string; dim: string; fade: string; cardBg: string;
}) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");
  const [pastHero, setPastHero] = useState(false);
  const bodyRootRef = useRef<HTMLDivElement>(null);
  const [isWide, setIsWide] = useState(true);

  useEffect(() => {
    const update = () => setIsWide(window.innerWidth >= 1024);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const root = bodyRootRef.current;
      if (!root) return;
      setPastHero(root.getBoundingClientRect().top <= 80);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (sections.length === 0) return;
    const observers: IntersectionObserver[] = [];
    sections.forEach((s) => {
      const el = document.getElementById(`section-${s.id}`);
      if (!el) return;
      const o = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(s.id); },
        { rootMargin: "-25% 0px -65% 0px", threshold: 0 }
      );
      o.observe(el);
      observers.push(o);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [sections]);

  const handleTocClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(`section-${id}`);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 40, behavior: "smooth" });
  };

  return (
    <div ref={bodyRootRef} style={{ maxWidth: 1240, margin: "0 auto", padding: "0 var(--rw-body-pad)" }}>
      <div style={{ display: "grid", gridTemplateColumns: isWide ? "220px 1fr" : "1fr", gap: isWide ? 72 : 0, alignItems: "start" }}>

        {/* Desktop sticky TOC */}
        {isWide && (
          <aside
            aria-label="Table of contents"
            style={{
              position: "sticky", top: 40, alignSelf: "start",
              opacity: pastHero ? 1 : 0,
              transform: pastHero ? "translateY(0)" : "translateY(-6px)",
              transition: "opacity 0.35s ease, transform 0.35s ease",
              pointerEvents: pastHero ? "auto" : "none",
            }}
          >
            <div className="font-mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: dim, marginBottom: 16, textTransform: "uppercase" }}>
              · Contents
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 4 }}>
              {sections.map((s, i) => {
                const active = s.id === activeId;
                return (
                  <li key={s.id}>
                    <a
                      href={`#section-${s.id}`}
                      onClick={(e) => handleTocClick(e, s.id)}
                      className="font-mono"
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 8px", marginLeft: -8, borderRadius: 6, textDecoration: "none", fontSize: 11, letterSpacing: "0.04em", lineHeight: 1.35, color: active ? ink : dim, background: active ? `${accent}10` : "transparent", transition: "color 0.18s ease, background 0.18s ease" }}
                      onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = ink; }}
                      onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = dim; }}
                    >
                      <span style={{ fontSize: 9, letterSpacing: "0.16em", color: active ? accent : fade, flexShrink: 0, width: 18, fontVariantNumeric: "tabular-nums" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span style={{ flex: 1 }}>{s.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </aside>
        )}

        {/* Content */}
        <div>
          {/* Mobile TOC — static, placed before content */}
          {!isWide && sections.length > 1 && (
            <nav aria-label="Table of contents" style={{ marginBottom: 40, paddingBottom: 8 }}>
              <div className="font-mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: dim, marginBottom: 12, textTransform: "uppercase" }}>
                Contents
              </div>
              <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#section-${s.id}`}
                      onClick={(e) => handleTocClick(e, s.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: 14,
                        padding: "13px 0",
                        borderBottom: `1px solid ${fade}`,
                        textDecoration: "none",
                        color: ink,
                      }}
                    >
                      <span className="font-mono" style={{ fontSize: 10, letterSpacing: "0.16em", color: accent, flexShrink: 0, width: 22 }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span style={{ flex: 1, fontSize: 15, letterSpacing: "-0.01em" }}>{s.label}</span>
                      <ArrowRight size={14} strokeWidth={1.6} style={{ color: dim, flexShrink: 0 }} />
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Sections */}
          {sections.map((s, si) => {
            const num = String(si + 1).padStart(2, "0");
            const eyebrow = s.eyebrow ?? `${num} — ${s.label}`;
            const firstParagraphIdx = s.blocks.findIndex((b) => b.type === "p");
            return (
              <section key={s.id} id={`section-${s.id}`} style={{ paddingTop: 28, paddingBottom: 56, scrollMarginTop: 40 }}>
                <p className="font-mono" style={{ fontSize: 10, letterSpacing: "0.20em", color: dim, marginBottom: 14, textTransform: "uppercase" }}>
                  {eyebrow}
                </p>
                <h2
                  className="font-mono"
                  style={{ fontSize: "clamp(26px, 3.6vw, 46px)", fontWeight: 500, color: ink, lineHeight: 1.06, letterSpacing: "-0.035em", marginBottom: 32, maxWidth: 820 }}
                >
                  {s.heading}
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 820 }}>
                  {s.blocks.map((blk, i) => (
                    <Block
                      key={i}
                      blk={blk}
                      isLead={i === firstParagraphIdx}
                      isMobile={!isWide}
                      accent={accent}
                      ink={ink}
                      body={body}
                      dim={dim}
                      fade={fade}
                      cardBg={cardBg}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Block dispatcher
   ────────────────────────────────────────────────────────────── */
function Block({
  blk, isLead, isMobile, accent, ink, body, dim, fade, cardBg,
}: {
  blk: CaseBlock; isLead?: boolean; isMobile?: boolean;
  accent: string; ink: string; body: string; dim: string; fade: string; cardBg: string;
}) {
  switch (blk.type) {
    case "p":
      return (
        <p style={{ fontSize: isLead ? (isMobile ? 18 : 20) : (isMobile ? 16 : 17), lineHeight: isLead ? 1.55 : 1.66, color: isLead ? ink : body, letterSpacing: "-0.01em", marginBottom: isLead ? 4 : 0 }}>
          {blk.text}
        </p>
      );

    case "h3":
      return (
        <h3 className="font-mono" style={{ fontSize: isMobile ? 17 : 18, fontWeight: 500, color: ink, letterSpacing: "-0.01em", marginTop: 12, marginBottom: -4 }}>
          {blk.text}
        </h3>
      );

    case "image": {
      const aspect = blk.aspect ?? "16/9";
      const aspectCss = aspect.replace("/", " / ");
      const [aw, ah] = aspect.split("/").map((s) => parseFloat(s.trim()) || 1);
      const fullBleed = !!blk.fullBleed;

      const frame = (
        <div style={{ position: "relative", width: "100%", maxWidth: fullBleed ? `calc(90vh * ${aw} / ${ah})` : undefined, overflow: "hidden", aspectRatio: aspectCss, background: cardBg }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={blk.src} alt={blk.alt ?? ""} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      );

      const caption = blk.caption && (
        <figcaption className="font-mono" style={{ fontSize: 11, letterSpacing: "0.04em", color: dim, marginTop: 10, lineHeight: 1.5, textAlign: fullBleed ? "center" : undefined }}>
          {blk.caption}
        </figcaption>
      );

      if (fullBleed && !isMobile) {
        const bleedMarginLeft =
          "calc(-1 * max(0px, (100vw - var(--rw-sidebar) - var(--rw-body-max)) / 2) - var(--rw-body-pad) - var(--rw-toc-offset))";
        return (
          <figure style={{ margin: 0 }}>
            <div style={{ width: "calc(100vw - var(--rw-sidebar))", marginLeft: bleedMarginLeft, display: "flex", justifyContent: "center" }}>
              {frame}
            </div>
            {caption}
          </figure>
        );
      }

      return <figure style={{ margin: 0 }}>{frame}{caption}</figure>;
    }

    case "imagePair":
      return (
        <div style={{ display: "grid", gridTemplateColumns: (isMobile && blk.items.length > 1) ? "1fr" : `repeat(${Math.max(1, blk.items.length)}, 1fr)`, gap: isMobile ? 20 : 14 }}>
          {blk.items.map((it, i) => (
            <figure key={i} style={{ margin: 0 }}>
              <div style={{ position: "relative", overflow: "hidden", aspectRatio: isMobile ? "16 / 9" : "4 / 3", background: cardBg }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.src} alt={it.alt ?? it.label ?? ""} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
              </div>
              {(it.label || it.caption) && (
                <figcaption style={{ marginTop: 10 }}>
                  {it.label && (
                    <div className="font-mono" style={{ fontSize: 10, letterSpacing: "0.16em", color: accent, marginBottom: 4, textTransform: "uppercase" }}>
                      {it.label}
                    </div>
                  )}
                  {it.caption && <div style={{ fontSize: 13, color: dim, lineHeight: 1.5 }}>{it.caption}</div>}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      );

    case "objectives":
      return (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : `repeat(${blk.items.length}, 1fr)`, gap: isMobile ? 10 : 12 }}>
          {blk.items.map((o) => (
            <div key={o.label} style={{ padding: isMobile ? "16px 14px" : "18px 16px", borderRadius: 12, background: cardBg, border: `1px solid ${fade}` }}>
              <div style={{ fontSize: 20, marginBottom: 10 }}>{o.emoji}</div>
              <div className="font-mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: accent, marginBottom: 8, textTransform: "uppercase" }}>{o.label}</div>
              <div style={{ fontSize: isMobile ? 13 : 13.5, lineHeight: 1.55, color: body }}>{o.sub}</div>
            </div>
          ))}
        </div>
      );

    case "statPills":
      return (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {blk.items.map((s, i) => (
            <div key={i} className="font-mono" style={{ display: "inline-flex", alignItems: "baseline", gap: 8, padding: "8px 12px", borderRadius: 999, border: `1px solid ${accent}55`, background: `${accent}12` }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: accent, letterSpacing: "-0.01em" }}>{s.value}</span>
              {s.label && <span style={{ fontSize: 10, letterSpacing: "0.12em", color: dim, textTransform: "uppercase" }}>{s.label}</span>}
            </div>
          ))}
        </div>
      );

    case "list": {
      const Marker = ({ kind }: { kind: "x" | "check" | "dot" }) => {
        if (kind === "x")     return <X     size={13} strokeWidth={2.2} style={{ color: accent, flexShrink: 0, marginTop: 5 }} />;
        if (kind === "check") return <Check size={13} strokeWidth={2.2} style={{ color: accent, flexShrink: 0, marginTop: 5 }} />;
        return <Dot size={16} strokeWidth={3} style={{ color: accent, flexShrink: 0, marginTop: 2 }} />;
      };
      const kind = blk.marker ?? "dot";
      return (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
          {blk.items.map((item, i) => (
            <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Marker kind={kind} />
              <span style={{ fontSize: isMobile ? 15 : 16, lineHeight: 1.55, color: body }}>{item}</span>
            </li>
          ))}
        </ul>
      );
    }

    case "quote":
      return (
        <blockquote style={{ margin: 0, padding: isMobile ? "16px 18px" : "18px 22px", borderLeft: `2px solid ${accent}`, background: cardBg, borderRadius: 4 }}>
          <p style={{ fontSize: isMobile ? 16 : 18, lineHeight: 1.55, color: ink, letterSpacing: "-0.01em", margin: 0, fontStyle: "italic" }}>
            &ldquo;{blk.text}&rdquo;
          </p>
        </blockquote>
      );

    case "metricCards":
      return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: isMobile ? 12 : 20 }}>
          {blk.items.map((item, i) => (
            <div
              key={i}
              style={{
                padding: isMobile ? "22px 18px" : "36px 32px",
                borderRadius: 10,
                border: `1px solid ${fade}`,
                borderLeft: `3px solid ${accent}`,
              }}
            >
              <div style={{ fontSize: isMobile ? "clamp(26px, 6vw, 40px)" : "clamp(32px, 3.2vw, 48px)", fontWeight: 500, color: ink, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: isMobile ? 10 : 14 }}>
                {item.value}
              </div>
              <div className="font-mono" style={{ fontSize: 9, letterSpacing: "0.20em", color: accent, textTransform: "uppercase", marginBottom: item.sub ? 8 : 0 }}>
                {item.label}
              </div>
              {item.sub && (
                <div style={{ fontSize: isMobile ? 12 : 13, lineHeight: 1.5, color: dim }}>{item.sub}</div>
              )}
            </div>
          ))}
        </div>
      );
  }
}

/* ──────────────────────────────────────────────────────────────
   Fallback body
   ────────────────────────────────────────────────────────────── */
function FallbackBody({
  cs, ink, body, dim, fade, cardBg,
}: {
  cs: CaseStudy; ink: string; body: string; dim: string; fade: string; cardBg: string;
}) {
  return (
    <article style={{ maxWidth: 1080, margin: "0 auto", padding: "0 clamp(20px, 5vw, 64px) 48px" }}>
      <section style={{ marginBottom: 36 }}>
        <p className="font-mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: dim, marginBottom: 12 }}>OVERVIEW</p>
        <p style={{ fontSize: 17, lineHeight: 1.66, color: body, maxWidth: 760 }}>{cs.overview}</p>
      </section>
      <section style={{ marginBottom: 48 }}>
        <p className="font-mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: dim, marginBottom: 12 }}>CHALLENGE</p>
        <p style={{ fontSize: 17, lineHeight: 1.66, color: body, maxWidth: 760 }}>{cs.challenge}</p>
      </section>
      {cs.images.length > 0 && (
        <section style={{ marginBottom: 16 }}>
          <p className="font-mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: dim, marginBottom: 12 }}>GALLERY</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            {cs.images.map((src, i) => (
              <div key={i} style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${fade}`, aspectRatio: "4 / 3", background: cardBg }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`${cs.shortTitle} ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

/* ──────────────────────────────────────────────────────────────
   Contact CTA
   ────────────────────────────────────────────────────────────── */
function ContactCTA({
  accent, ink, body, dim, fade,
}: {
  accent: string; ink: string; body: string; dim: string; fade: string;
}) {
  return (
    <section style={{ marginTop: 24, padding: "56px 0", textAlign: "center" }}>
      <p className="font-mono" style={{ fontSize: 10, letterSpacing: "0.20em", color: dim, marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <span style={{ flex: 1, borderTop: `1px solid ${fade}`, maxWidth: 60 }} />
        <span>outro</span>
        <span style={{ flex: 1, borderTop: `1px solid ${fade}`, maxWidth: 60 }} />
      </p>
      <p style={{ fontSize: 18, color: dim, marginBottom: 14 }}>Do I have your attention?</p>
      <h2 className="font-mono" style={{ fontSize: "clamp(36px, 4.8vw, 64px)", fontWeight: 500, color: ink, letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: 22 }}>
        Hit me up.
      </h2>
      <Link
        href="/#contact"
        className="font-mono inline-flex items-center gap-2"
        style={{ padding: "11px 18px", fontSize: 12, letterSpacing: "0.08em", color: "#0c0e22", background: "var(--accent-highlight)", borderRadius: 6, textDecoration: "none", fontWeight: 500, boxShadow: "0 6px 18px rgba(207,242,74,0.28)" }}
      >
        Get in touch
        <ArrowUpRight size={14} strokeWidth={1.8} />
      </Link>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   Next case
   ────────────────────────────────────────────────────────────── */
function NextCase({
  next, accent, ink, dim, fade, cardBg,
}: {
  next: CaseStudy; accent: string; ink: string; dim: string; fade: string; cardBg: string;
}) {
  return (
    <div style={{ paddingTop: 28, marginTop: 36 }}>
      <p className="font-mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: dim, marginBottom: 14 }}>NEXT CASE</p>
      <Link
        href={`/case/${next.id}`}
        className="group"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 24px", borderRadius: 14, background: cardBg, border: `1px solid ${fade}`, textDecoration: "none", transition: "background 0.18s ease, border-color 0.18s ease" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = accent + "66"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = fade; }}
      >
        <div>
          <div className="font-mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: dim, marginBottom: 6 }}>
            {next.company.toUpperCase()} · {next.year.toUpperCase()}
          </div>
          <div style={{ fontSize: 20, fontWeight: 500, color: ink, letterSpacing: "-0.02em" }}>{next.title}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: accent, flexShrink: 0 }}>
          <span className="font-mono" style={{ fontSize: 11, letterSpacing: "0.12em" }}>NEXT</span>
          <ArrowRight size={16} strokeWidth={2} />
        </div>
      </Link>
    </div>
  );
}

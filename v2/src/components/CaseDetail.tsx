"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, X, Check, Dot } from "lucide-react";
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
        <Body sections={sections} accent={accent} ink={ink} body={body} dim={dim} fade={fade} cardBg={cardBg} isDark={isDark} />
      ) : (
        <FallbackBody cs={cs} ink={ink} body={body} dim={dim} fade={fade} cardBg={cardBg} />
      )}

      <article style={{ maxWidth: 1240, margin: "0 auto", padding: "0 var(--rw-body-pad) 80px" }}>
        {cs.conclusion && (
          <Conclusion conclusion={cs.conclusion} ink={ink} body={body} dim={dim} fade={fade} accent={accent} isDark={isDark} />
        )}
        <NextCase next={next} accent={accent} ink={ink} dim={dim} fade={fade} cardBg={cardBg} />
        <ContactCTA accent={accent} ink={ink} body={body} dim={dim} fade={fade} />
      </article>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Cover Carousel
   ────────────────────────────────────────────────────────────── */
function CoverCarousel({
  images, alt, cardBg, accent, fade,
}: {
  images: string[]; alt: string;
  cardBg: string; accent: string; dim: string; fade: string;
}) {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1); // 1 = forward, -1 = backward
  const dragStart = useRef(0);

  const go = (next: number, d: number) => { setDir(d); setIdx(next); };
  const prev = () => go((idx - 1 + images.length) % images.length, -1);
  const next = () => go((idx + 1) % images.length, 1);

  const onPointerDown = (e: React.PointerEvent) => { dragStart.current = e.clientX; };
  const onPointerUp   = (e: React.PointerEvent) => {
    const delta = e.clientX - dragStart.current;
    if (Math.abs(delta) > 44) delta < 0 ? next() : prev();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  /* Aspect ratio locked to first image: 1536 × 999 */
  const ASPECT = "1536 / 999";

  return (
    <div
      style={{ position: "relative", width: "100%", userSelect: "none" }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {/* Fixed-ratio frame */}
      <div style={{ position: "relative", width: "100%", aspectRatio: ASPECT, overflow: "hidden", background: cardBg }}>
        <AnimatePresence initial={false}>
          <motion.div
            key={idx}
            initial={{ x: `${dir * 100}%`, opacity: 0.72 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: `${dir * -100}%`, opacity: 0.72 }}
            transition={{ duration: 0.46, ease: [0.32, 0.72, 0, 1] }}
            style={{ position: "absolute", inset: 0 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[idx]}
              alt={`${alt} — ${idx + 1}`}
              draggable={false}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Subtle gradient at bottom so controls don't fight with bright images */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 96, background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 100%)", pointerEvents: "none", zIndex: 1 }} />

        {/* Prev / Next */}
        <button onClick={prev} aria-label="Previous" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.48)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "50%", width: 40, height: 40, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", backdropFilter: "blur(8px)", zIndex: 2, transition: "background 0.18s ease" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.72)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.48)")}
        >
          <ArrowLeft size={16} strokeWidth={2} />
        </button>
        <button onClick={next} aria-label="Next" style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.48)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "50%", width: 40, height: 40, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", backdropFilter: "blur(8px)", zIndex: 2, transition: "background 0.18s ease" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.72)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.48)")}
        >
          <ArrowRight size={16} strokeWidth={2} />
        </button>

        {/* Dots + counter */}
        <div style={{ position: "absolute", bottom: 16, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, zIndex: 2 }}>
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i, i > idx ? 1 : -1)}
                aria-label={`Image ${i + 1}`}
                style={{ width: i === idx ? 22 : 6, height: 6, borderRadius: 999, background: i === idx ? accent : "rgba(255,255,255,0.35)", border: "none", cursor: "pointer", padding: 0, transition: "width 0.22s ease, background 0.22s ease", flexShrink: 0 }}
              />
            ))}
          </div>
          <span className="font-mono" style={{ fontSize: 9, letterSpacing: "0.14em", color: "rgba(255,255,255,0.65)", background: "rgba(0,0,0,0.42)", padding: "3px 9px", borderRadius: 999, backdropFilter: "blur(6px)" }}>
            {idx + 1} / {images.length}
          </span>
        </div>
      </div>
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
        >
          {cs.coverCarousel && cs.coverCarousel.length > 1 ? (
            <CoverCarousel images={cs.coverCarousel} alt={cs.shortTitle} cardBg={cardBg} accent={accent} dim={dim} fade={fade} />
          ) : (
            <div style={{ position: "relative", width: "100%", maxWidth: "calc(90vh * 16 / 9)", aspectRatio: "16 / 9", overflow: "hidden", background: cardBg, margin: "0 auto" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cs.cover} alt={cs.shortTitle} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
          )}
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
  sections, accent, ink, body, dim, fade, cardBg, isDark,
}: {
  sections: CaseSection[]; accent: string;
  ink: string; body: string; dim: string; fade: string; cardBg: string; isDark: boolean;
}) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");
  const [pastHero, setPastHero] = useState(false);
  const bodyRootRef = useRef<HTMLDivElement>(null);
  const [isWide, setIsWide] = useState(true);
  const [tocCovered, setTocCovered] = useState(false);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const openLightbox = (src: string, alt?: string) => setLightbox({ src, alt: alt ?? "" });

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

  /* Fade the desktop TOC out when a full-width white card (PhoneFlow) crosses
     behind it. The TOC sticks at top: 40 and is roughly 360px tall — when the
     card's vertical band overlaps that range, hide the TOC; bring it back as
     soon as the card has scrolled out of that region. */
  useEffect(() => {
    if (!isWide) {
      setTocCovered(false);
      return;
    }
    const TOC_TOP = 40;
    const TOC_BOTTOM = 360;
    const checkOverlap = () => {
      const cards = document.querySelectorAll<HTMLElement>("[data-fullbleed-card]");
      let overlap = false;
      cards.forEach((card) => {
        const r = card.getBoundingClientRect();
        if (r.top < TOC_BOTTOM && r.bottom > TOC_TOP) overlap = true;
      });
      setTocCovered(overlap);
    };
    checkOverlap();
    window.addEventListener("scroll", checkOverlap, { passive: true });
    window.addEventListener("resize", checkOverlap, { passive: true });
    return () => {
      window.removeEventListener("scroll", checkOverlap);
      window.removeEventListener("resize", checkOverlap);
    };
  }, [isWide, sections]);

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
    <>
    {lightbox && <LightboxOverlay src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />}
    <div ref={bodyRootRef} style={{ maxWidth: 1240, margin: "0 auto", padding: "0 var(--rw-body-pad)" }}>
      <div style={{ display: "grid", gridTemplateColumns: isWide ? "220px 1fr" : "1fr", gap: isWide ? 72 : 0, alignItems: "start" }}>

        {/* Desktop sticky TOC */}
        {isWide && (
          <aside
            aria-label="Table of contents"
            style={{
              position: "sticky", top: 40, alignSelf: "start",
              opacity: pastHero && !tocCovered ? 1 : 0,
              transform: pastHero ? "translateY(0)" : "translateY(-6px)",
              transition: "opacity 0.35s ease, transform 0.35s ease",
              pointerEvents: pastHero && !tocCovered ? "auto" : "none",
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
            const isOutsourced = s.variant === "outsourced";
            const outsourcedBg = isDark ? "rgba(255,255,255,0.038)" : "rgba(0,0,0,0.032)";
            const outsourcedBorder = isDark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.09)";

            // Group blocks: "phoneFlow" renders at full section width; all others stay in the 820px column.
            type BG = { fullWidth: boolean; items: { blk: CaseBlock; idx: number }[] };
            const blockGroups: BG[] = [];
            s.blocks.forEach((blk, i) => {
              const fw = blk.type === "phoneFlow";
              const last = blockGroups[blockGroups.length - 1];
              if (!last || last.fullWidth !== fw) blockGroups.push({ fullWidth: fw, items: [{ blk, idx: i }] });
              else last.items.push({ blk, idx: i });
            });

            const renderBlockGroup = (bg: BG, gi: number) => {
              const els = bg.items.map(({ blk, idx }) => (
                <Block key={idx} blk={blk} isLead={idx === firstParagraphIdx} isMobile={!isWide}
                  accent={accent} ink={ink} body={body} dim={dim} fade={fade} cardBg={cardBg} onImageOpen={openLightbox} />
              ));
              if (bg.fullWidth) return <div key={`bg-${gi}`} style={{ marginTop: gi > 0 ? 32 : 0 }}>{els}</div>;
              return (
                <div key={`bg-${gi}`} style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 820, marginTop: gi > 0 ? 32 : 0 }}>
                  {els}
                </div>
              );
            };

            const blocksContent = <>{blockGroups.map((bg, gi) => renderBlockGroup(bg, gi))}</>;

            return (
              <section key={s.id} id={`section-${s.id}`} style={{ paddingTop: 28, paddingBottom: 56, scrollMarginTop: 40 }}>
                <p className="font-mono" style={{ fontSize: 10, letterSpacing: "0.20em", color: dim, marginBottom: 14, textTransform: "uppercase" }}>
                  {eyebrow}
                </p>

                {/* Heading — two-column when sideNote is present */}
                {s.sideNote ? (
                  <div style={{ display: "grid", gridTemplateColumns: isWide ? "1fr 1fr" : "1fr", gap: isWide ? 48 : 10, marginBottom: isOutsourced ? 20 : 36 }}>
                    <h2 className="font-mono" style={{ fontSize: "clamp(26px, 3.6vw, 46px)", fontWeight: 500, color: ink, lineHeight: 1.06, letterSpacing: "-0.035em", margin: 0 }}>
                      {s.heading}
                    </h2>
                    <p style={{ fontSize: isWide ? 15 : 14, lineHeight: 1.7, color: body, margin: 0, ...(isWide ? { alignSelf: "end", paddingBottom: 6 } : {}) }}>
                      {s.sideNote}
                    </p>
                  </div>
                ) : (
                  <h2 className="font-mono" style={{ fontSize: "clamp(26px, 3.6vw, 46px)", fontWeight: 500, color: ink, lineHeight: 1.06, letterSpacing: "-0.035em", marginBottom: isOutsourced ? 20 : 32, maxWidth: 820 }}>
                    {s.heading}
                  </h2>
                )}

                {isOutsourced ? (
                  <div style={{ borderRadius: 14, border: `1px solid ${outsourcedBorder}`, background: outsourcedBg, padding: isWide ? "28px 32px" : "20px 20px", maxWidth: 820 }}>
                    <div className="font-mono" style={{ fontSize: 9, letterSpacing: "0.22em", color: accent, marginBottom: 18, textTransform: "uppercase", opacity: 0.72 }}>
                      Agency work
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                      {s.blocks.map((blk, i) => (
                        <Block key={i} blk={blk} isLead={i === firstParagraphIdx} isMobile={!isWide}
                          accent={accent} ink={ink} body={body} dim={dim} fade={fade} cardBg={cardBg} onImageOpen={openLightbox} />
                      ))}
                    </div>
                    <p className="font-mono" style={{ fontSize: 10, letterSpacing: "0.06em", color: dim, marginTop: 20, opacity: 0.65 }}>
                      Credits: Veronika Zamecnikova.
                    </p>
                  </div>
                ) : blocksContent}
              </section>
            );
          })}
        </div>
      </div>
    </div>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────
   Block dispatcher
   ────────────────────────────────────────────────────────────── */
function Block({
  blk, isLead, isMobile, accent, ink, body, dim, fade, cardBg, onImageOpen,
}: {
  blk: CaseBlock; isLead?: boolean; isMobile?: boolean;
  accent: string; ink: string; body: string; dim: string; fade: string; cardBg: string;
  onImageOpen?: (src: string, alt?: string) => void;
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
      const [aw, ah] = aspect.split("/").map((s) => parseFloat(s.trim()) || 1);
      const isFullBleed = !!blk.fullBleed;
      const isWide = !!blk.wide;
      const fit = blk.fit ?? "natural";
      const isNatural = fit === "natural";

      const caption = blk.caption && (
        <figcaption className="font-mono" style={{ fontSize: 11, letterSpacing: "0.04em", color: dim, marginTop: 10, lineHeight: 1.5, textAlign: isFullBleed ? "center" : undefined }}>
          {blk.caption}
        </figcaption>
      );

      const imgEl = isNatural ? (
        /* Natural: no fixed height — image shows at its full aspect ratio */
        <div
          style={{ overflow: "hidden", background: cardBg, borderRadius: 6, cursor: onImageOpen ? "pointer" : "default" }}
          onClick={() => onImageOpen?.(blk.src, blk.alt)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={blk.src} alt={blk.alt ?? ""} style={{ width: "100%", height: "auto", display: "block" }} />
        </div>
      ) : (
        /* Fixed aspect ratio */
        <div
          style={{ position: "relative", width: "100%", maxWidth: isFullBleed ? `calc(90vh * ${aw} / ${ah})` : undefined, overflow: "hidden", aspectRatio: aspect.replace("/", " / "), background: cardBg, cursor: onImageOpen ? "pointer" : "default" }}
          onClick={() => onImageOpen?.(blk.src, blk.alt)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={blk.src} alt={blk.alt ?? ""} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: fit === "contain" ? "contain" : "cover", objectPosition: "top center" }} />
        </div>
      );

      if (isFullBleed && !isMobile) {
        const bleedMarginLeft =
          "calc(-1 * max(0px, (100vw - var(--rw-sidebar) - var(--rw-body-max)) / 2) - var(--rw-body-pad) - var(--rw-toc-offset))";
        return (
          <figure style={{ margin: 0 }}>
            <div style={{ width: "calc(100vw - var(--rw-sidebar))", marginLeft: bleedMarginLeft, display: "flex", justifyContent: "center" }}>
              {imgEl}
            </div>
            {caption}
          </figure>
        );
      }

      if (isWide && !isMobile) {
        return (
          <figure style={{ margin: "0 -72px" }}>
            {imgEl}
            {caption}
          </figure>
        );
      }

      return <figure style={{ margin: 0 }}>{imgEl}{caption}</figure>;
    }

    case "imagePair": {
      const blockFit = blk.fit ?? "natural";
      return (
        <div style={{ display: "grid", gridTemplateColumns: (isMobile && blk.items.length > 1) ? "1fr" : `repeat(${Math.max(1, blk.items.length)}, 1fr)`, gap: isMobile ? 20 : 14, alignItems: "start" }}>
          {blk.items.map((it, i) => {
            const fit = it.fit ?? blockFit;
            const isNatural = fit === "natural";
            const isContain = fit === "contain";
            return (
              <figure key={i} style={{ margin: 0 }}>
                {isNatural ? (
                  <div
                    style={{ overflow: "hidden", borderRadius: 8, background: cardBg, cursor: onImageOpen ? "pointer" : "default" }}
                    onClick={() => onImageOpen?.(it.src, it.alt ?? it.label)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.src} alt={it.alt ?? it.label ?? ""} style={{ width: "100%", height: "auto", display: "block" }} />
                  </div>
                ) : (
                  <div
                    style={{ position: "relative", overflow: "hidden", aspectRatio: isMobile ? "16 / 9" : "4 / 3", background: cardBg, cursor: onImageOpen ? "pointer" : "default", borderRadius: 8 }}
                    onClick={() => onImageOpen?.(it.src, it.alt ?? it.label)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.src} alt={it.alt ?? it.label ?? ""} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: isContain ? "contain" : "cover", objectPosition: "top center" }} />
                  </div>
                )}
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
            );
          })}
        </div>
      );
    }

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

    case "carousel":
      return (
        <Carousel
          items={blk.items}
          aspect={blk.aspect}
          isMobile={isMobile}
          cardBg={cardBg}
          accent={accent}
          dim={dim}
          fade={fade}
          onImageOpen={onImageOpen}
        />
      );

    case "conceptTabs":
      return (
        <ConceptTabs
          items={blk.items}
          isMobile={isMobile}
          cardBg={cardBg}
          accent={accent}
          ink={ink}
          body={body}
          dim={dim}
          fade={fade}
          onImageOpen={onImageOpen}
        />
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

    case "phoneFlow":
      return (
        <PhoneFlow
          heading={blk.heading}
          description={blk.description}
          mobileImage={blk.mobileImage}
          mobileAlt={blk.mobileAlt}
          items={blk.items}
          isMobile={isMobile}
          accent={accent}
          ink={ink}
          body={body}
          dim={dim}
          fade={fade}
          cardBg={cardBg}
          onImageOpen={onImageOpen}
        />
      );

    case "painPoints": {
      const hasShot = !!blk.screenshot;
      const hasMobile = !!blk.screenshotMobile;
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

          {/* ── Device mockup panel ── */}
          {hasShot && (
            <div style={{
              background: "#0d0d0d",
              borderRadius: 14,
              padding: isMobile ? "22px 16px 26px" : "32px 40px 36px",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              gap: isMobile ? 10 : 22,
              overflow: "hidden",
            }}>

              {/* Laptop */}
              <div style={{ flex: "0 0 auto", width: hasMobile && !isMobile ? "66%" : (isMobile ? "88%" : "76%") }}>
                {/* Lid */}
                <div style={{
                  background: "linear-gradient(180deg, #2c2c2c 0%, #222 100%)",
                  borderRadius: "10px 10px 2px 2px",
                  padding: "8px 8px 0",
                  boxShadow: "0 0 0 1px rgba(255,255,255,0.07), inset 0 1px 0 rgba(255,255,255,0.07)",
                }}>
                  {/* Camera */}
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 5 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#2a2a2a", boxShadow: "inset 0 0 0 1.5px #3a3a3a" }} />
                  </div>
                  {/* Screen */}
                  <div style={{ borderRadius: "2px 2px 0 0", overflow: "hidden", aspectRatio: "16/10", background: "#000" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={blk.screenshot} alt={blk.screenshotAlt ?? ""} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block" }} />
                  </div>
                </div>
                {/* Base */}
                <div style={{
                  height: 14,
                  background: "linear-gradient(180deg, #282828 0%, #1c1c1c 100%)",
                  borderRadius: "0 0 6px 6px",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)",
                }}>
                  <div style={{ width: "28%", height: 5, background: "#252525", borderRadius: 2, margin: "4px auto 0" }} />
                </div>
              </div>

              {/* Phone (optional, desktop only) */}
              {hasMobile && !isMobile && (
                <div style={{ flex: "0 0 auto", width: "20%", marginBottom: 14 }}>
                  <div style={{
                    background: "linear-gradient(180deg, #2c2c2c 0%, #222 100%)",
                    borderRadius: 28,
                    padding: "10px 6px",
                    boxShadow: "0 0 0 1px rgba(255,255,255,0.07), 0 8px 28px rgba(0,0,0,0.5)",
                  }}>
                    <div style={{ width: 52, height: 10, background: "#0a0a0a", borderRadius: 7, margin: "0 auto 7px" }} />
                    <div style={{ borderRadius: 18, overflow: "hidden", aspectRatio: "9/19.5", background: "#000" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={blk.screenshotMobile} alt={blk.screenshotAlt ?? ""} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Pain point rows ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {blk.items.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: isMobile ? "13px 16px" : "15px 20px",
                  background: "rgba(220, 38, 38, 0.09)",
                  border: "1px solid rgba(220, 38, 38, 0.2)",
                  borderRadius: 8,
                }}
              >
                <X size={14} strokeWidth={2.5} style={{ color: "rgb(239, 68, 68)", flexShrink: 0 }} />
                <span style={{ fontSize: isMobile ? 14 : 15, lineHeight: 1.5, color: ink }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
  }
}

/* ──────────────────────────────────────────────────────────────
   Phone Flow — horizontal scroll of booking steps
   ────────────────────────────────────────────────────────────── */
function PhoneFlow({
  heading, description, mobileImage, mobileAlt, items, isMobile, accent, ink, body: bodyColor, dim, fade, cardBg, onImageOpen,
}: {
  heading?: string;
  description?: string;
  mobileImage?: string;
  mobileAlt?: string;
  items: { label: string; description?: string; src: string; alt?: string }[];
  isMobile?: boolean;
  accent: string; ink: string; body: string; dim: string; fade: string; cardBg: string;
  onImageOpen?: (src: string, alt?: string) => void;
}) {
  /* Mobile: skip the full white card / carousel and show a single composed
     image that already includes the heading, description and every phone. */
  if (isMobile && mobileImage) {
    return (
      <div
        style={{
          marginTop: 16,
          marginBottom: 16,
          borderRadius: 12,
          overflow: "hidden",
          cursor: onImageOpen ? "zoom-in" : "default",
        }}
        onClick={() => onImageOpen?.(mobileImage, mobileAlt ?? heading ?? "")}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mobileImage}
          alt={mobileAlt ?? heading ?? ""}
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>
    );
  }

  const scrollRef = useRef<HTMLDivElement>(null);
  const GAP = isMobile ? 14 : 24;

  /* Each phone fills exactly 1/5 of the visible scroll area (with 4 gaps), so
     5 graphics are visible at once — bigger and easier to inspect. The
     remaining phones live to the right and scroll into view via the arrows. */
  const VISIBLE_COUNT = 5;
  const cardSlot = isMobile
    ? "172px"
    : `calc((100% - ${(VISIBLE_COUNT - 1) * GAP}px) / ${VISIBLE_COUNT})`;

  const scrollBy = (dir: 1 | -1) => {
    if (!scrollRef.current) return;
    const firstCard = scrollRef.current.querySelector<HTMLElement>("[data-phone-card]");
    const w = firstCard ? firstCard.offsetWidth + GAP : 240;
    scrollRef.current.scrollBy({ left: dir * w * 2, behavior: "smooth" });
  };

  /* Subtle border tone for the white card — kept independent of theme since
     the card itself is always white. */
  const cardFade = "rgba(10, 12, 35, 0.10)";

  /* Viewport-centered card sizing.
     - Capped at 1770px wide so it extends close to the viewport edges on big
       displays while still keeping 48px breathing room each side.
     - Phones inside auto-scale via the flex slot calc, so a wider card means
       proportionally bigger phones. */
  const VIEWPORT_MARGIN = 48;
  const MAX_W = 1770;
  const COLUMN_OFFSET = 292; // 220 TOC + 72 gap
  const cardWidth = `min(${MAX_W}px, calc(100vw - ${VIEWPORT_MARGIN * 2}px))`;
  const cardMarginLeft = `calc((100vw - ${cardWidth}) / 2 - max((100vw - 1240px) / 2, 0px) - var(--rw-body-pad) - ${COLUMN_OFFSET}px)`;

  return (
    <div
      data-fullbleed-card
      style={{
        position: "relative",
        marginTop: isMobile ? 16 : 32,
        marginBottom: isMobile ? 16 : 32,
        width: isMobile ? "100%" : cardWidth,
        marginLeft: isMobile ? 0 : cardMarginLeft,
        background: "#ffffff",
        border: `1px solid ${cardFade}`,
        borderRadius: 20,
        padding: isMobile ? "36px 24px 32px" : "96px 104px 88px",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.10)",
        overflow: "hidden",
        zIndex: 1,
      }}
    >
      {/* (Header is intentionally omitted on desktop — the "Booking Flow"
          heading and description live in the surrounding section copy, and
          the phone images themselves are self-describing.) */}

      {/* Scroll track — phone images only (labels/descriptions are baked into the images). */}
      <div
        ref={scrollRef}
        className="rw-scroller"
        style={{
          display: "flex",
          gap: GAP,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          paddingBottom: 4,
          alignItems: "flex-start",
        } as React.CSSProperties}
      >
        {items.map((item, i) => (
          <div
            key={i}
            data-phone-card
            style={{
              flex: `0 0 ${cardSlot}`,
              scrollSnapAlign: "start",
              cursor: onImageOpen ? "zoom-in" : "default",
              display: "flex",
              justifyContent: "center",
            }}
            onClick={() => onImageOpen?.(item.src, item.alt ?? item.label)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.src}
              alt={item.alt ?? item.label}
              draggable={false}
              style={{ maxWidth: "100%", height: "auto", display: "block" }}
            />
          </div>
        ))}
      </div>

      {/* Prev / Next buttons — vertically centered on the phone images */}
      {!isMobile && (
        <>
          <button
            onClick={() => scrollBy(-1)}
            aria-label="Scroll left"
            style={{ position: "absolute", left: 16, top: "62%", transform: "translateY(-50%)", background: "rgba(10,12,35,0.78)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "50%", width: 40, height: 40, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", zIndex: 3, boxShadow: "0 4px 18px rgba(0,0,0,0.18)", backdropFilter: "blur(6px)" }}
          >
            <ArrowLeft size={15} strokeWidth={2} />
          </button>
          <button
            onClick={() => scrollBy(1)}
            aria-label="Scroll right"
            style={{ position: "absolute", right: 16, top: "62%", transform: "translateY(-50%)", background: "rgba(10,12,35,0.78)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "50%", width: 40, height: 40, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", zIndex: 3, boxShadow: "0 4px 18px rgba(0,0,0,0.18)", backdropFilter: "blur(6px)" }}
          >
            <ArrowRight size={15} strokeWidth={2} />
          </button>
        </>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Lightbox
   ────────────────────────────────────────────────────────────── */
function LightboxOverlay({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.90)", display: "flex", alignItems: "center", justifyContent: "center", padding: "5vh 5vw", backdropFilter: "blur(10px)" }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh" }}>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{ position: "absolute", top: -14, right: -14, zIndex: 1, background: "rgba(30,30,30,0.9)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.85)" }}
        >
          <X size={14} strokeWidth={2.5} />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} style={{ display: "block", maxWidth: "90vw", maxHeight: "90vh", width: "auto", height: "auto", borderRadius: 10, objectFit: "contain" }} />
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Concept Tabs
   ────────────────────────────────────────────────────────────── */
function ConceptTabs({
  items, isMobile, cardBg, accent, ink, body: bodyColor, dim, fade, onImageOpen,
}: {
  items: { label: string; tabLabel?: string; description?: string; src: string; alt?: string }[];
  isMobile?: boolean;
  cardBg: string; accent: string; ink: string; body: string; dim: string; fade: string;
  onImageOpen?: (src: string, alt?: string) => void;
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = items[activeIdx];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Concept rows */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {items.map((item, i) => {
          const isActive = i === activeIdx;
          return (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 0", borderTop: `1px solid ${fade}`, borderBottom: "none", borderLeft: "none", borderRight: "none", background: "none", cursor: "pointer", textAlign: "left", width: "100%" }}
            >
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: isActive ? `${accent}20` : cardBg, border: `1.5px solid ${isActive ? accent : fade}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 3, transition: "all 0.18s ease" }}>
                <span className="font-mono" style={{ fontSize: 9, color: isActive ? accent : dim }}>{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: isMobile ? 14 : 15, fontWeight: 500, color: isActive ? ink : dim, marginBottom: item.description ? 4 : 0, lineHeight: 1.3, transition: "color 0.18s ease" }}>
                  {item.label}
                </div>
                {item.description && (
                  <div style={{ fontSize: 13, color: dim, lineHeight: 1.55 }}>{item.description}</div>
                )}
              </div>
            </button>
          );
        })}
        <div style={{ height: 1, background: fade }} />
      </div>

      {/* Image card */}
      <div style={{ background: cardBg, border: `1px solid ${fade}`, borderRadius: 12, overflow: "hidden" }}>
        {/* Tab bar */}
        <div style={{ display: "flex", padding: "10px 12px", gap: 4, borderBottom: `1px solid ${fade}` }}>
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className="font-mono"
              style={{ padding: "5px 12px", borderRadius: 6, border: "none", background: i === activeIdx ? `${accent}18` : "transparent", color: i === activeIdx ? accent : dim, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.18s ease" }}
            >
              {item.tabLabel ?? `Concept ${i + 1}`}
            </button>
          ))}
        </div>

        {/* Full image — no crop */}
        <div
          style={{ padding: isMobile ? "10px" : "14px", cursor: onImageOpen ? "pointer" : "default" }}
          onClick={() => onImageOpen?.(active.src, active.alt)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={active.src} alt={active.alt ?? ""} style={{ width: "100%", height: "auto", display: "block", borderRadius: 6 }} />
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Carousel
   ────────────────────────────────────────────────────────────── */
function Carousel({
  items, aspect, isMobile, cardBg, accent, dim, fade, onImageOpen,
}: {
  items: { src: string; alt?: string; caption?: string; label?: string }[];
  aspect?: string;
  isMobile?: boolean;
  cardBg: string; accent: string; dim: string; fade: string;
  onImageOpen?: (src: string, alt?: string) => void;
}) {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i - 1 + items.length) % items.length);
  const next = () => setIdx((i) => (i + 1) % items.length);
  const item = items[idx];
  const aspectCss = (aspect ?? "3/2").replace("/", " / ");

  return (
    <figure style={{ margin: 0 }}>
      <div style={{ position: "relative", overflow: "hidden", aspectRatio: aspectCss, background: cardBg, borderRadius: 8 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.src}
          alt={item.alt ?? ""}
          onClick={() => onImageOpen?.(item.src, item.alt)}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", cursor: onImageOpen ? "pointer" : "default" }}
        />

        {items.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous image"
              style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.52)", border: "none", borderRadius: "50%", width: 34, height: 34, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.9)", backdropFilter: "blur(6px)", zIndex: 1 }}
            >
              <ArrowLeft size={15} strokeWidth={2} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next image"
              style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.52)", border: "none", borderRadius: "50%", width: 34, height: 34, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.9)", backdropFilter: "blur(6px)", zIndex: 1 }}
            >
              <ArrowRight size={15} strokeWidth={2} />
            </button>

            {/* Counter badge */}
            <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(0,0,0,0.55)", borderRadius: 999, padding: "3px 9px", backdropFilter: "blur(6px)", zIndex: 1 }}>
              <span className="font-mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.75)", letterSpacing: "0.12em" }}>
                {idx + 1} / {items.length}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Dot nav */}
      {items.length > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 5, marginTop: 10 }}>
          {items.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setIdx(i); }}
              aria-label={`Go to image ${i + 1}`}
              style={{ width: i === idx ? 18 : 6, height: 6, borderRadius: 999, background: i === idx ? accent : fade, border: "none", cursor: "pointer", padding: 0, transition: "width 0.2s ease, background 0.2s ease" }}
            />
          ))}
        </div>
      )}

      {item.caption && (
        <figcaption className="font-mono" style={{ fontSize: 11, letterSpacing: "0.04em", color: dim, marginTop: 8, lineHeight: 1.5, textAlign: "center" }}>
          {item.caption}
        </figcaption>
      )}
    </figure>
  );
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
   Conclusion
   ────────────────────────────────────────────────────────────── */
function Conclusion({
  conclusion, ink, body, dim, fade, accent, isDark,
}: {
  conclusion: { quote: string; body?: string; signoff?: string };
  ink: string; body: string; dim: string; fade: string; accent: string; isDark: boolean;
}) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <section style={{
      paddingTop: isMobile ? 48 : 72,
      paddingBottom: isMobile ? 48 : 64,
      borderTop: `1px solid ${fade}`,
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "200px 1fr",
      gap: isMobile ? 32 : 56,
      alignItems: "start",
    }}>
      {/* Left: avatar + name + back to top */}
      <div style={{ display: "flex", flexDirection: isMobile ? "row" : "column", alignItems: isMobile ? "center" : "flex-start", gap: isMobile ? 14 : 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: isMobile ? 1 : undefined }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", overflow: "hidden", flexShrink: 0, background: fade }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={isDark ? "/profile.png" : "/profile-light.png"}
              alt="Rodrigo Martínez"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: ink, letterSpacing: "-0.01em" }}>Rodrigo Martínez</div>
            <div className="font-mono" style={{ fontSize: 11, color: dim, letterSpacing: "0.04em" }}>UX Designer</div>
          </div>
        </div>
        <button
          onClick={scrollTop}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: accent, fontSize: 13, padding: 0, letterSpacing: "-0.01em" }}
        >
          <ArrowUp size={13} strokeWidth={2} />
          Back to the top
        </button>
      </div>

      {/* Right: quote + body + signoff */}
      <div>
        <p style={{
          fontSize: isMobile ? "clamp(20px, 5vw, 28px)" : "clamp(22px, 2.6vw, 38px)",
          fontWeight: 700,
          color: ink,
          lineHeight: 1.18,
          letterSpacing: "-0.025em",
          marginBottom: 20,
        }}>
          {conclusion.quote}
        </p>
        {conclusion.body && (
          <p style={{ fontSize: isMobile ? 14 : 15, color: body, lineHeight: 1.65, marginBottom: 10 }}>
            {conclusion.body}
          </p>
        )}
        {conclusion.signoff && (
          <p style={{ fontSize: isMobile ? 14 : 15, color: dim }}>
            {conclusion.signoff}
          </p>
        )}
      </div>
    </section>
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

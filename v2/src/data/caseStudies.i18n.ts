/* ──────────────────────────────────────────────────────────────
   Case studies — Spanish overrides.

   Schema:
   - Strings stay as English literals only when no translation has
     been provided. Otherwise this file mirrors the English fields,
     so future translators can copy-edit in place.
   - For body blocks, overrides are keyed by case id → section id →
     block index. Block shape mirrors the English version exactly,
     with only the translatable fields filled in. Untranslated
     fields silently fall back to the English source.
   ────────────────────────────────────────────────────────────── */

import { CASE_STUDIES, type CaseBlock, type CaseSection, type CaseStudy } from "./caseStudies";
import { TALITHA_ES } from "./translations/talitha.es";
import { BODYBAR_ES } from "./translations/bodybar.es";
import { RAPID_GARDEN_ES } from "./translations/rapid-garden.es";
import { MP_ES } from "./translations/mp.es";
import { PP_ES } from "./translations/pp.es";
import { HDMN_ES } from "./translations/hdmn.es";
import { HAH_ES } from "./translations/hah.es";
import { SKINCARE_JUNKIE_ES } from "./translations/skincare-junkie.es";
import { RUTTIS_ES } from "./translations/ruttis.es";
import { SQUEEDR_ES } from "./translations/squeedr.es";

/* Block overrides skip the discriminated-union narrowing on `CaseBlock`.
   An override only carries the translatable string fields (and `items`
   for blocks whose item shapes vary), so the union arm can't be
   inferred — typing as a string-keyed dictionary lets translators
   write each field by name without TypeScript guessing a specific
   subtype. The merger preserves the original block shape at runtime. */
type BlockOverride = { [key: string]: unknown };

export type SectionOverride = {
  label?: string;
  heading?: string;
  eyebrow?: string;
  sideNote?: string;
  blocks?: Record<number, BlockOverride>;
};

export type CaseTextOverride = {
  title?: string;
  shortTitle?: string;
  company?: string;
  year?: string;
  role?: string;
  deliverables?: string;
  tagline?: string;
  overview?: string;
  challenge?: string;
  tags?: string[];
  kinds?: string[];
  metrics?: { label?: string; value?: string }[];
  conclusion?: { quote?: string; body?: string; signoff?: string };
  /* Block-level overrides: sections keyed by id, then blocks keyed
     by their 0-based index within that section. Only translatable
     text fields are honored; image src / structural fields are
     intentionally not overridable. */
  sections?: Record<string, SectionOverride>;
};

export const ES_OVERRIDES: Record<string, CaseTextOverride> = {
  "talitha": TALITHA_ES,
  "bodybar": BODYBAR_ES,
  "rapid-garden": RAPID_GARDEN_ES,
  "mp": MP_ES,
  "pp": PP_ES,
  "hdmn": HDMN_ES,
  "hah": HAH_ES,
  "skincare-junkie": SKINCARE_JUNKIE_ES,
  "ruttis": RUTTIS_ES,
  "squeedr": SQUEEDR_ES,
};

/* Deep-merge a CaseBlock with a partial override. Type-narrowing
   is loose by design — the override shape is validated by the
   author, not at runtime, since block discriminants stay constant. */
function mergeBlock(block: CaseBlock, override?: BlockOverride): CaseBlock {
  if (!override) return block;
  /* Merge top-level scalars; the block's structural type stays whatever
     it was in English (the override never sets `type`). */
  const merged = { ...block, ...override } as unknown as CaseBlock;

  /* For blocks with `items: object[]`, merge items by index. */
  const srcItems = (block as { items?: unknown[] }).items;
  const ovrItems = (override as { items?: unknown[] }).items;
  if (Array.isArray(srcItems) && Array.isArray(ovrItems)) {
    const mergedItems = srcItems.map((it, i) => ({
      ...(it as Record<string, unknown>),
      ...((ovrItems[i] as Record<string, unknown>) ?? {}),
    }));
    (merged as unknown as { items: unknown[] }).items = mergedItems;
  }
  return merged;
}

function mergeSection(sec: CaseSection, override?: SectionOverride): CaseSection {
  if (!override) return sec;
  return {
    ...sec,
    label: override.label ?? sec.label,
    heading: override.heading ?? sec.heading,
    eyebrow: override.eyebrow ?? sec.eyebrow,
    sideNote: override.sideNote ?? sec.sideNote,
    blocks: sec.blocks.map((b, i) => mergeBlock(b, override.blocks?.[i])),
  };
}

function mergeCase(cs: CaseStudy, ov?: CaseTextOverride): CaseStudy {
  if (!ov) return cs;
  return {
    ...cs,
    title: ov.title ?? cs.title,
    shortTitle: ov.shortTitle ?? cs.shortTitle,
    company: ov.company ?? cs.company,
    year: ov.year ?? cs.year,
    role: ov.role ?? cs.role,
    deliverables: ov.deliverables ?? cs.deliverables,
    tagline: ov.tagline ?? cs.tagline,
    overview: ov.overview ?? cs.overview,
    challenge: ov.challenge ?? cs.challenge,
    tags: ov.tags ?? cs.tags,
    kinds: ov.kinds ?? cs.kinds,
    metrics: cs.metrics.map((m, i) => ({
      label: ov.metrics?.[i]?.label ?? m.label,
      value: ov.metrics?.[i]?.value ?? m.value,
    })),
    conclusion: cs.conclusion ? {
      quote: ov.conclusion?.quote ?? cs.conclusion.quote,
      body: ov.conclusion?.body ?? cs.conclusion.body,
      signoff: ov.conclusion?.signoff ?? cs.conclusion.signoff,
    } : cs.conclusion,
    body: cs.body?.map((s) => mergeSection(s, ov.sections?.[s.id])),
  };
}

export const CASE_STUDIES_ES: CaseStudy[] = CASE_STUDIES.map((cs) => mergeCase(cs, ES_OVERRIDES[cs.id]));

export function getCaseStudies(locale: "en" | "es"): CaseStudy[] {
  return locale === "es" ? CASE_STUDIES_ES : CASE_STUDIES;
}

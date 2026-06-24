import { notFound } from "next/navigation";
import CaseDetail from "@/components/CaseDetail";
import { CASE_STUDIES } from "@/data/caseStudies";

/* External cases (e.g. Behance-hosted brand work) are linked directly
   from the gallery; we skip them here so /case/[id] returns 404. */
export function generateStaticParams() {
  return CASE_STUDIES.filter(cs => !cs.external).map(cs => ({ id: cs.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const cs = CASE_STUDIES.find(c => c.id === params.id);
  if (!cs || cs.external) return { title: "Case study not found" };
  return {
    title: `${cs.shortTitle} — rodriwu / v2`,
    description: cs.overview.slice(0, 160),
  };
}

export default function V2CasePage({ params }: { params: { id: string } }) {
  const cs = CASE_STUDIES.find(c => c.id === params.id);
  if (!cs || cs.external) notFound();
  return <CaseDetail cs={cs} />;
}

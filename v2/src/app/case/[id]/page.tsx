import { notFound } from "next/navigation";
import CaseDetail from "@/components/CaseDetail";
import { CASE_STUDIES } from "@/data/caseStudies";

export function generateStaticParams() {
  return CASE_STUDIES.map(cs => ({ id: cs.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const cs = CASE_STUDIES.find(c => c.id === params.id);
  if (!cs) return { title: "Case study not found" };
  return {
    title: `${cs.shortTitle} — rodriwu / v2`,
    description: cs.overview.slice(0, 160),
  };
}

export default function V2CasePage({ params }: { params: { id: string } }) {
  const cs = CASE_STUDIES.find(c => c.id === params.id);
  if (!cs) notFound();
  return <CaseDetail cs={cs} />;
}

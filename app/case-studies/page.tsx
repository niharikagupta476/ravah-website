import { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";
import { caseStudies } from "@/lib/case-studies";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "See how Ravah.ai improves incident response and pipeline health.",
  alternates: {
    canonical: "/case-studies",
  },
};

export default function CaseStudiesPage() {
  return (
    <Section>
      <div className="section-header">
        <p className="eyebrow">Case Studies</p>
        <h1>Real-world reliability wins</h1>
        <p>
          Customer stories that highlight measurable MTTR and alert reduction
          outcomes.
        </p>
      </div>
      <div className="grid-3">
        {caseStudies.map((study) => (
          <Link key={study.slug} href={`/case-studies/${study.slug}`} className="card">
            <p className="eyebrow">{study.company}</p>
            <h2>{study.title}</h2>
            <p>{study.summary}</p>
          </Link>
        ))}
      </div>
    </Section>
  );
}

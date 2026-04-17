import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/Section";
import { caseStudies } from "@/lib/case-studies";

interface CaseStudyProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export function generateMetadata({ params }: CaseStudyProps): Metadata {
  const study = caseStudies.find((item) => item.slug === params.slug);
  if (!study) {
    return {};
  }

  return {
    title: study.title,
    description: study.summary,
    alternates: { canonical: `/case-studies/${study.slug}` },
  };
}

export default function CaseStudyPage({ params }: CaseStudyProps) {
  const study = caseStudies.find((item) => item.slug === params.slug);

  if (!study) {
    notFound();
  }

  return (
    <Section>
      <div className="section-header">
        <p className="eyebrow">{study.company}</p>
        <h1>{study.title}</h1>
        <p>{study.summary}</p>
      </div>
      <div className="card">
        <h2>Results</h2>
        <ul>
          {study.results.map((result) => (
            <li key={result}>{result}</li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

import { Metadata } from "next";
import { Section } from "@/components/Section";
import { FeatureGrid } from "@/components/FeatureGrid";
import { CTA } from "@/components/CTA";

export const metadata: Metadata = {
  title: "Use Cases",
  description:
    "Solve on-call overload, CI/CD failures, alert noise, and postmortem delays with Ravah.ai.",
  alternates: {
    canonical: "/use-cases",
  },
};

const useCases = [
  {
    title: "On-call triage",
    description:
      "Provide responders with summarized evidence, likely impact, and next steps within minutes.",
  },
  {
    title: "CI/CD failures",
    description:
      "Identify flaky tests, dependency drift, and environment regressions before they hit production.",
  },
  {
    title: "Noisy alerts",
    description:
      "Cluster repetitive alerts, suppress duplicates, and highlight real service degradation.",
  },
  {
    title: "Postmortems",
    description:
      "Auto-generate timelines and action items so teams can focus on remediation and learnings.",
  },
];

export default function UseCasesPage() {
  return (
    <>
      <Section>
        <div className="section-header">
          <p className="eyebrow">Use Cases</p>
          <h1>Remove friction from the moments that matter</h1>
          <p>
            From pipeline regressions to incident response, Ravah.ai keeps teams
            aligned and moving fast.
          </p>
        </div>
        <FeatureGrid
          title="DevOps + SRE workflows"
          subtitle="Designed to meet SLOs, reduce alert fatigue, and drive faster recovery."
          features={useCases}
        />
      </Section>

      <Section className="alt">
        <CTA
          title="Map your workflows to Ravah"
          description="We will review your current tooling and recommend the right copilots."
          primary={{ href: "/contact", label: "Request Demo" }}
          secondary={{ href: "/integrations", label: "See integrations" }}
        />
      </Section>
    </>
  );
}

import { Metadata } from "next";
import { Section } from "@/components/Section";
import { FeatureGrid } from "@/components/FeatureGrid";
import { CTA } from "@/components/CTA";

export const metadata: Metadata = {
  title: "Product",
  description:
    "Explore Ravah.ai copilots for pipeline failures, root cause analysis, and alert triage.",
  alternates: {
    canonical: "/product",
  },
};

const copilotFeatures = [
  {
    title: "Pipeline Copilot",
    description:
      "Diagnose CI/CD failures with diff-aware summaries, dependency tracing, and safe rollback suggestions.",
  },
  {
    title: "RCA Copilot",
    description:
      "Automate incident timelines, evidence mapping, and postmortem-ready summaries in minutes.",
  },
  {
    title: "Alert Copilot",
    description:
      "Cluster noisy alerts, enrich with context, and surface the next-best actions for on-call teams.",
  },
];

const platformBenefits = [
  {
    title: "Evidence-first reasoning",
    description:
      "Every recommendation is backed by logs, metrics, traces, and change history.",
  },
  {
    title: "Human-in-the-loop",
    description:
      "Approvals and guardrails keep humans in control of remediation paths.",
  },
  {
    title: "Audit-ready",
    description:
      "Exportable decision trails and retention controls keep compliance teams aligned.",
  },
];

export default function ProductPage() {
  return (
    <>
      <Section>
        <div className="section-header">
          <p className="eyebrow">Product</p>
          <h1>Copilots purpose-built for DevOps and SRE teams</h1>
          <p>
            Ravah.ai focuses on the highest-leverage moments in incident response
            and delivery pipelines.
          </p>
        </div>
        <FeatureGrid
          title="Copilot suite"
          subtitle="Scale knowledge across pipelines, incidents, and alerts without adding noise."
          features={copilotFeatures}
        />
      </Section>

      <Section className="alt">
        <FeatureGrid
          title="Built for enterprise operations"
          subtitle="Designed to fit your production constraints and compliance needs."
          features={platformBenefits}
        />
      </Section>

      <Section>
        <CTA
          title="Schedule a product walkthrough"
          description="Bring your last incident and see a tailored analysis live."
          primary={{ href: "/contact", label: "Request Demo" }}
          secondary={{ href: "/score", label: "Try Ravah Score" }}
          secondaryEvent="score_cta_click"
        />
      </Section>
    </>
  );
}

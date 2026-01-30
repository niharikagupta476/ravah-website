import { Metadata } from "next";
import { Section } from "@/components/Section";
import { Hero } from "@/components/Hero";
import { LogoCloud } from "@/components/LogoCloud";
import { FeatureGrid } from "@/components/FeatureGrid";
import { CTA } from "@/components/CTA";
import { FAQ } from "@/components/FAQ";
import { StickyCTA } from "@/components/StickyCTA";
import { NewsletterForm } from "@/components/NewsletterForm";
import { TrackedLink } from "@/components/TrackedLink";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI DevOps Copilot for Faster MTTR",
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
};

const howItWorks = [
  {
    title: "Ingest signals",
    description:
      "Connect pipelines, on-call alerts, and runtime telemetry. Ravah normalizes evidence across toolchains.",
  },
  {
    title: "Reason + explain",
    description:
      "Deterministic rules and AI reasoning map failures to root causes with citations and confidence scores.",
  },
  {
    title: "Act with guardrails",
    description:
      "Suggested fixes, rollback guidance, and runbook updates stay human-approved and auditable.",
  },
];

const whatYouGet = [
  {
    title: "Pipeline Copilot",
    description:
      "Auto-triage build and deploy failures with diff-aware summaries and remediation suggestions.",
  },
  {
    title: "RCA Copilot",
    description:
      "Incident timelines, contributing factors, and evidence mapping delivered in minutes.",
  },
  {
    title: "Alert Copilot",
    description:
      "Deduplicate noisy alerts and surface top actions for on-call teams.",
  },
];

const demoFlow = [
  "Detect failure in CI/CD pipeline",
  "Generate RCA summary with evidence links",
  "Recommend safe rollback or patch",
];

const faqs = [
  {
    question: "How is Ravah different from generic AI assistants?",
    answer:
      "Ravah is trained on DevOps workflows and uses deterministic rules to constrain AI outputs. Every recommendation is explainable, linked to evidence, and requires human approval.",
  },
  {
    question: "Do you auto-fix production incidents?",
    answer:
      "No. Ravah suggests fixes and next steps with guardrails so your team stays in control.",
  },
  {
    question: "What data do you need?",
    answer:
      "We ingest logs, pipeline metadata, alert payloads, and change events needed for triage. Data retention and access are configurable.",
  },
];

export default function HomePage() {
  return (
    <>
      <Section>
        <Hero
          title="AI DevOps Copilot for CI/CD failures, on-call triage, and faster MTTR"
          subtitle="Deterministic rules + AI reasoning. Explainable insights. Safe suggested fixes."
          primaryCta={{ href: "/contact", label: "Request Demo" }}
          secondaryCta={{ href: "/docs", label: "View Docs" }}
          primaryEvent="cta_demo_click"
          secondaryEvent="cta_docs_click"
          note="SOC2-ready workflows. Human-in-the-loop by default."
        />
        <div style={{ marginTop: "48px" }}>
          <LogoCloud />
        </div>
      </Section>

      <Section className="alt">
        <FeatureGrid
          title="How it works"
          subtitle="Ravah connects to your existing toolchain and prioritizes the evidence that matters."
          features={howItWorks}
        />
      </Section>

      <Section>
        <FeatureGrid
          title="What you get"
          subtitle="Purpose-built copilots for CI/CD, incidents, and alert fatigue."
          features={whatYouGet}
        />
      </Section>

      <Section className="alt">
        <div className="stack">
          <div className="section-header">
            <h2>Demo flow</h2>
            <p>
              Walk through the exact steps Ravah takes from signal to suggested
              fix.
            </p>
          </div>
          <div className="grid-3">
            {demoFlow.map((step) => (
              <div className="card" key={step}>
                <p className="eyebrow">Step</p>
                <h3>{step}</h3>
                <div className="hero-card-placeholder">Screenshot placeholder</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="stack">
          <div className="section-header">
            <h2>Security & privacy by design</h2>
            <p>
              Built for enterprise teams that require auditability, retention
              controls, and secure data handling.
            </p>
          </div>
          <div className="grid-3">
            <div className="card">
              <h3>Data minimization</h3>
              <p>
                Collect only the telemetry you approve, with scoped access and
                configurable retention.
              </p>
            </div>
            <div className="card">
              <h3>Encryption everywhere</h3>
              <p>
                TLS in transit, encryption at rest, and key management aligned to
                your policies.
              </p>
            </div>
            <div className="card">
              <h3>Audit-ready workflows</h3>
              <p>
                Maintain human approvals, evidence trails, and compliance-ready
                exports.
              </p>
            </div>
          </div>
          <TrackedLink
            href="/security"
            className="button button-ghost"
            event="cta_docs_click"
          >
            View security details
          </TrackedLink>
        </div>
      </Section>

      <Section className="alt">
        <div className="stack">
          <div className="section-header">
            <h2>FAQs</h2>
            <p>Answers to the questions we hear from SRE and platform teams.</p>
          </div>
          <FAQ items={faqs} />
        </div>
      </Section>

      <Section>
        <div className="stack">
          <CTA
            title="See Ravah.ai in action"
            description="Book a tailored demo and leave with an actionable pipeline analysis."
            primary={{ href: "/contact", label: "Request Demo" }}
            secondary={{ href: "/docs", label: "View Docs" }}
            primaryEvent="cta_demo_click"
            secondaryEvent="cta_docs_click"
          />
          <div className="card">
            <h3>Join the waitlist</h3>
            <p>Get product updates and early access to new copilots.</p>
            <NewsletterForm />
          </div>
        </div>
      </Section>
      <StickyCTA />
    </>
  );
}

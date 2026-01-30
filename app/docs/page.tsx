import { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "Docs",
  description: "Quickstart guides and architecture docs for Ravah.ai.",
  alternates: {
    canonical: "/docs",
  },
};

export default function DocsPage() {
  return (
    <>
      <Section>
        <div className="section-header">
          <p className="eyebrow">Docs</p>
          <h1>Get started with Ravah.ai</h1>
          <p>
            Clear implementation steps for platform engineers and SRE teams.
          </p>
        </div>
        <div className="grid-3">
          <div className="card">
            <h3 id="quickstart">Quickstart</h3>
            <p>
              Connect your CI/CD provider, configure alert sources, and onboard
              your first service in under an hour.
            </p>
            <Link className="button button-ghost" href="/contact">
              Request onboarding
            </Link>
          </div>
          <div className="card">
            <h3 id="architecture">Architecture</h3>
            <p>
              Learn how Ravah normalizes telemetry, applies deterministic rules,
              and surfaces explainable AI insights.
            </p>
            <Link className="button button-ghost" href="/security">
              Security overview
            </Link>
          </div>
          <div className="card">
            <h3 id="security">Security</h3>
            <p>
              Review data handling, access controls, and retention options for
              compliance workflows.
            </p>
            <Link className="button button-ghost" href="/security">
              View security
            </Link>
          </div>
        </div>
      </Section>

      <Section className="alt" id="integrations">
        <div className="section-header">
          <h2>Integrations</h2>
          <p>
            Ravah connects to the tools your team already uses to ship and
            operate software.
          </p>
        </div>
        <div className="grid-3">
          <div className="card">GitHub, GitLab, Jenkins</div>
          <div className="card">ArgoCD, Kubernetes</div>
          <div className="card">Slack, PagerDuty</div>
        </div>
      </Section>
    </>
  );
}

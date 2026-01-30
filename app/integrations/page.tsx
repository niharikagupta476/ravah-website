import { Metadata } from "next";
import { Section } from "@/components/Section";
import { CTA } from "@/components/CTA";

export const metadata: Metadata = {
  title: "Integrations",
  description: "Connect Ravah.ai to the tools your teams already use.",
  alternates: {
    canonical: "/integrations",
  },
};

const integrations = [
  { name: "GitHub", status: "Available" },
  { name: "GitLab", status: "Available" },
  { name: "Jenkins", status: "Available" },
  { name: "ArgoCD", status: "Coming soon" },
  { name: "Kubernetes", status: "Coming soon" },
  { name: "Slack", status: "Available" },
  { name: "PagerDuty", status: "Available" },
];

export default function IntegrationsPage() {
  return (
    <>
      <Section>
        <div className="section-header">
          <p className="eyebrow">Integrations</p>
          <h1>Plug into your DevOps stack</h1>
          <p>
            Ravah connects across CI/CD, observability, and on-call tooling with
            minimal configuration.
          </p>
        </div>
        <div className="grid-3">
          {integrations.map((integration) => (
            <div className="card" key={integration.name}>
              <h3>{integration.name}</h3>
              <p className="eyebrow">{integration.status}</p>
              <p>
                Unified signals for faster triage and evidence-based
                recommendations.
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="alt">
        <CTA
          title="Need another integration?"
          description="Tell us what tools you rely on and we will prioritize the roadmap."
          primary={{ href: "/contact", label: "Request integration" }}
          secondary={{ href: "/docs", label: "View docs" }}
        />
      </Section>
    </>
  );
}

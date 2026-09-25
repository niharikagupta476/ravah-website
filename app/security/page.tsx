import { Metadata } from "next";
import { Section } from "@/components/Section";
import { CTA } from "@/components/CTA";

export const metadata: Metadata = {
  title: "Security",
  description:
    "SOC2-ready security posture with configurable data handling, encryption, and access controls.",
  alternates: {
    canonical: "/security",
  },
};

export default function SecurityPage() {
  return (
    <>
      <Section>
        <div className="section-header">
          <p className="eyebrow">Security</p>
          <h1>SOC2-ready by design</h1>
          <p>
            Ravah.ai is built to support enterprise compliance workflows and
            secure data handling without claiming certification prematurely.
          </p>
        </div>
        <div className="grid-3">
          <div className="card">
            <h3>Data handling</h3>
            <p>
              Configurable retention, scoped ingestion, and tenant isolation keep
              sensitive data protected.
            </p>
          </div>
          <div className="card">
            <h3>Encryption</h3>
            <p>
              TLS 1.2+ in transit, encryption at rest, and key rotation aligned
              to your policies.
            </p>
          </div>
          <div className="card">
            <h3>Access controls</h3>
            <p>
              Role-based access, SSO readiness, and audit logs for approvals and
              changes.
            </p>
          </div>
        </div>
      </Section>

      <Section className="alt">
        <div className="grid-3">
          <div className="card">
            <h3>Privacy controls</h3>
            <p>
              Redaction and minimization ensure only required telemetry is
              processed.
            </p>
          </div>
          <div className="card">
            <h3>Compliance workflows</h3>
            <p>
              Evidence trails and exports are designed to align with SOC2, ISO,
              and internal audits.
            </p>
          </div>
          <div className="card">
            <h3>Availability</h3>
            <p>
              Regional deployment options and redundancy planning are available
              on enterprise plans.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <CTA
          title="Review our security overview"
          description="We can share a detailed security brief and data handling checklist."
          primary={{ href: "/contact", label: "Request security brief" }}
          secondary={{ href: "/pricing", label: "View pricing" }}
        />
      </Section>
    </>
  );
}

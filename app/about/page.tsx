import { Metadata } from "next";
import { Section } from "@/components/Section";
import { CTA } from "@/components/CTA";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Ravah.ai mission, values, and credibility.",
  alternates: {
    canonical: "/about",
  },
};

const values = [
  {
    title: "Reliability first",
    description:
      "We build software that respects SLOs, downtime budgets, and real-world constraints.",
  },
  {
    title: "Explainable by default",
    description:
      "Every output maps back to observable evidence so teams can trust and verify.",
  },
  {
    title: "Human-in-the-loop",
    description:
      "Guardrails and approvals ensure people stay accountable for production changes.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Section>
        <div className="section-header">
          <p className="eyebrow">About</p>
          <h1>Built by operators who ship and support software</h1>
          <p>
            Ravah.ai was created to give DevOps and SRE teams the clarity they
            need to move fast without breaking production.
          </p>
        </div>
        <div className="grid-3">
          {values.map((value) => (
            <div className="card" key={value.title}>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="alt">
        <div className="section-header">
          <h2>Our story</h2>
          <p>
            Ravah.ai emerged from years of running incident response and
            deployment automation for high-scale teams. The result is a platform
            that accelerates diagnosis without compromising safety.
          </p>
        </div>
        <div className="grid-3">
          <div className="card">
            <h3>Credibility</h3>
            <p>
              Built with advisors from SRE, platform, and security backgrounds.
            </p>
          </div>
          <div className="card">
            <h3>Customer focus</h3>
            <p>
              Product decisions are driven by real-world reliability workflows.
            </p>
          </div>
          <div className="card">
            <h3>Enterprise readiness</h3>
            <p>
              Security, compliance, and scalability are core to every release.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <CTA
          title="Partner with Ravah.ai"
          description="Talk to our team about pilot programs and roadmap priorities."
          primary={{ href: "/contact", label: "Contact us" }}
          secondary={{ href: "/product", label: "See product" }}
        />
      </Section>
    </>
  );
}

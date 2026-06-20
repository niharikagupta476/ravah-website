import { Metadata } from "next";
import { Section } from "@/components/Section";
import { CTA } from "@/components/CTA";
import { useCaseItems } from "@/lib/use-cases";

export const metadata: Metadata = {
  title: "Use Cases",
  description:
    "Solve on-call overload, CI/CD failures, alert noise, and postmortem delays with Ravah.ai.",
  alternates: {
    canonical: "/use-cases",
  },
};

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

        <div className="grid-3">
          {useCaseItems.map((useCase) => (
            <article className="card" key={useCase.title}>
              <h3>{useCase.title}</h3>
              <p>
                <strong>Problem:</strong> {useCase.problem}
              </p>
              <p>
                <strong>Ravah Solution:</strong> {useCase.solution}
              </p>
              <p>
                <strong>Output:</strong> {useCase.output}
              </p>
              <p>
                <strong>Impact:</strong> {useCase.impact}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section className="alt">
        <CTA
          title="Map your workflows to Ravah"
          description="We will review your current tooling and recommend the right copilots."
          primary={{ href: "/contact?source=request_demo", label: "Request Demo" }}
          secondary={{ href: "/integrations", label: "See integrations" }}
        />
      </Section>
    </>
  );
}

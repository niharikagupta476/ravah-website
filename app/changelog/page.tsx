import { Metadata } from "next";
import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Product updates and release notes for Ravah.ai.",
  alternates: {
    canonical: "/changelog",
  },
};

const updates = [
  {
    date: "2024-07-12",
    title: "Alert Copilot beta",
    description:
      "Introduced alert clustering and prioritization workflows with Slack and PagerDuty.",
  },
  {
    date: "2024-06-20",
    title: "Pipeline Copilot upgrades",
    description:
      "Added diff-aware root cause summaries and rollback guidance for CI/CD failures.",
  },
];

export default function ChangelogPage() {
  return (
    <Section>
      <div className="section-header">
        <p className="eyebrow">Changelog</p>
        <h1>Product updates</h1>
        <p>Track what is new and improved across the Ravah.ai platform.</p>
      </div>
      <div className="stack">
        {updates.map((update) => (
          <div className="card" key={update.title}>
            <p className="eyebrow">{new Date(update.date).toDateString()}</p>
            <h2>{update.title}</h2>
            <p>{update.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

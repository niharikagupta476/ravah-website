import { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";
import { getAllDocs } from "@/lib/docs";

export const metadata: Metadata = {
  title: "Docs",
  description: "Quickstart guides and architecture docs for Ravah.ai.",
  alternates: {
    canonical: "/docs",
  },
};

export default function DocsPage() {
  const docs = getAllDocs();

  return (
    <Section>
      <div className="section-header">
        <p className="eyebrow">Docs</p>
        <h1>Get started with Ravah.ai</h1>
        <p>Clear implementation steps for platform engineers and SRE teams.</p>
      </div>
      <div className="grid-3" style={{ alignItems: "start" }}>
        <aside className="card">
          <h3>Documentation</h3>
          <ul className="stack">
            {docs.map((doc) => (
              <li key={doc.slug}>
                <Link className="button button-ghost" href={`/docs/${doc.slug}`}>
                  {doc.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <div className="card" style={{ gridColumn: "span 2" }}>
          <h2>Choose a guide</h2>
          <p>
            Select a topic from the sidebar to read documentation powered by MDX.
          </p>
        </div>
      </div>
    </Section>
  );
}

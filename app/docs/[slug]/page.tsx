import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { Section } from "@/components/Section";
import { getAllDocs, getDocBySlug } from "@/lib/docs";
import { siteConfig } from "@/lib/site";

interface DocPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllDocs().map((doc) => ({ slug: doc.slug }));
}

export function generateMetadata({ params }: DocPageProps): Metadata {
  try {
    const { meta } = getDocBySlug(params.slug);
    return {
      title: `${meta.title} Docs`,
      description: meta.description,
      alternates: {
        canonical: `/docs/${meta.slug}`,
      },
      openGraph: {
        title: `${meta.title} | Ravah Docs`,
        description: meta.description,
        url: `${siteConfig.url}/docs/${meta.slug}`,
      },
    };
  } catch {
    return {};
  }
}

export default async function DocPage({ params }: DocPageProps) {
  const docs = getAllDocs();

  let doc;
  try {
    doc = getDocBySlug(params.slug);
  } catch {
    notFound();
  }

  const { content, meta } = doc;
  const { content: mdxContent } = await compileMDX({ source: content });

  return (
    <Section>
      <div className="grid-3" style={{ alignItems: "start" }}>
        <aside className="card">
          <h3>Documentation</h3>
          <ul className="stack">
            {docs.map((entry) => (
              <li key={entry.slug}>
                <Link className="button button-ghost" href={`/docs/${entry.slug}`}>
                  {entry.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <article className="card" style={{ gridColumn: "span 2" }}>
          <div className="section-header">
            <p className="eyebrow">Docs</p>
            <h1>{meta.title}</h1>
            <p>{meta.description}</p>
          </div>
          <div className="stack">{mdxContent}</div>
        </article>
      </div>
    </Section>
  );
}

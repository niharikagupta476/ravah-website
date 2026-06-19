import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/Section";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { compileMDX } from "next-mdx-remote/rsc";
import { siteConfig } from "@/lib/site";

interface BlogPostProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: BlogPostProps): Metadata {
  try {
    const { meta } = getPostBySlug(params.slug);
    return {
      title: meta.title,
      description: meta.description,
      alternates: {
        canonical: `/blog/${meta.slug}`,
      },
      openGraph: {
        title: meta.title,
        description: meta.description,
        url: `${siteConfig.url}/blog/${meta.slug}`,
      },
    };
  } catch {
    return {};
  }
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  let post;

  try {
    post = getPostBySlug(params.slug);
  } catch {
    notFound();
  }

  const { content, meta } = post;
  const { content: mdxContent } = await compileMDX({ source: content });

  return (
    <Section>
      <article className="stack">
        <div className="section-header">
          <p className="eyebrow">{new Date(meta.date).toDateString()}</p>
          <h1>{meta.title}</h1>
          <p>{meta.description}</p>
          <p className="hero-note">Tags: {meta.tags.join(", ")}</p>
        </div>
        <div className="card">{mdxContent}</div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: meta.title,
              description: meta.description,
              datePublished: meta.date,
              url: `${siteConfig.url}/blog/${meta.slug}`,
              author: {
                "@type": "Organization",
                name: "Ravah.ai",
              },
            }),
          }}
        />
      </article>
    </Section>
  );
}

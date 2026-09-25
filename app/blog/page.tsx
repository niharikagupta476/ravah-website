import { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "DevOps, SRE, and incident response insights from Ravah.ai.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <Section>
      <div className="section-header">
        <p className="eyebrow">Blog</p>
        <h1>Operator notes from Ravah.ai</h1>
        <p>
          Practical guidance on pipeline reliability, incident response, and
          DevOps automation.
        </p>
      </div>
      <div className="stack">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="card">
            <p className="eyebrow">{new Date(post.date).toDateString()}</p>
            <h2>{post.title}</h2>
            <p>{post.description}</p>
            <div className="hero-note">Tags: {post.tags.join(", ")}</div>
          </Link>
        ))}
      </div>
    </Section>
  );
}

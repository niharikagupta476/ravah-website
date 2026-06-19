import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
}

const contentDir = path.join(process.cwd(), "content", "blog");

export function getAllPosts(): BlogPostMeta[] {
  const files = fs.readdirSync(contentDir);
  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(contentDir, file), "utf8");
      const { data } = matter(raw);
      return {
        slug,
        title: data.title,
        description: data.description,
        date: data.date,
        tags: data.tags ?? [],
      } as BlogPostMeta;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string) {
  const filePath = path.join(contentDir, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { content, data } = matter(raw);
  return {
    content,
    meta: {
      slug,
      title: data.title,
      description: data.description,
      date: data.date,
      tags: data.tags ?? [],
    } as BlogPostMeta,
  };
}

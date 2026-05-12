import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface DocMeta {
  slug: string;
  title: string;
  description: string;
  order: number;
}

const docsDir = path.join(process.cwd(), "content", "docs");

export function getAllDocs(): DocMeta[] {
  const files = fs.readdirSync(docsDir);

  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(docsDir, file), "utf8");
      const { data } = matter(raw);

      return {
        slug,
        title: data.title,
        description: data.description,
        order: data.order ?? 999,
      } as DocMeta;
    })
    .sort((a, b) => a.order - b.order);
}

export function getDocBySlug(slug: string) {
  const filePath = path.join(docsDir, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  return {
    meta: {
      slug,
      title: data.title,
      description: data.description,
      order: data.order ?? 999,
    } as DocMeta,
    content,
  };
}

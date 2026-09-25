import { getAllPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/site";

export async function GET() {
  const posts = getAllPosts();

  const items = posts
    .map(
      (post) => `
      <item>
        <title>${post.title}</title>
        <link>${siteConfig.url}/blog/${post.slug}</link>
        <description>${post.description}</description>
        <pubDate>${new Date(post.date).toUTCString()}</pubDate>
        <guid>${siteConfig.url}/blog/${post.slug}</guid>
      </item>`
    )
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <title>Ravah.ai Blog</title>
        <link>${siteConfig.url}/blog</link>
        <description>DevOps Copilot insights from Ravah.ai</description>
        ${items}
      </channel>
    </rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml",
    },
  });
}

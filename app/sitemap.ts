import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { getAllPosts } from "@/lib/blog";
import { caseStudies } from "@/lib/case-studies";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/product",
    "/use-cases",
    "/pricing",
    "/ravah-score",
    "/docs",
    "/security",
    "/integrations",
    "/blog",
    "/about",
    "/contact",
    "/case-studies",
    "/changelog",
  ];

  const base = siteConfig.url;
  const posts = getAllPosts().map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: post.date,
  }));
  const studies = caseStudies.map((study) => ({
    url: `${base}/case-studies/${study.slug}`,
    lastModified: new Date().toISOString(),
  }));

  return [
    ...routes.map((route) => ({
      url: `${base}${route}`,
      lastModified: new Date().toISOString(),
    })),
    ...posts,
    ...studies,
  ];
}

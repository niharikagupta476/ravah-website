export const siteConfig = {
  name: "Ravah.ai",
  description:
    "AI DevOps Copilot for CI/CD failures, on-call triage, and faster MTTR.",
  url: "https://ravah.ai",
  ogImage: "https://ravah.ai/og.png",
  links: {
    docs: "/docs",
    demo: "/contact",
  },
  keywords: [
    "DevOps Copilot",
    "Pipeline failure analysis",
    "CI/CD troubleshooting",
    "SRE incident triage",
    "DORA metrics automation",
  ],
};

export const navLinks = [
  { href: "/product", label: "Product" },
  { href: "/use-cases", label: "Use Cases" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
  { href: "/blog", label: "Blog" },
  { href: "/security", label: "Security" },
  { href: "/contact", label: "Contact" },
];

export const footerLinks = {
  Product: [
    { href: "/product", label: "Overview" },
    { href: "/ravah-score", label: "Ravah Score" },
    { href: "/use-cases", label: "Use Cases" },
    { href: "/integrations", label: "Integrations" },
    { href: "/pricing", label: "Pricing" },
  ],
  Resources: [
    { href: "/docs", label: "Docs" },
    { href: "/blog", label: "Blog" },
    { href: "/case-studies", label: "Case Studies" },
    { href: "/changelog", label: "Changelog" },
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "/security", label: "Security" },
    { href: "/contact", label: "Contact" },
  ],
};

export const structuredData = {
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ravah.ai",
    url: "https://ravah.ai",
    logo: "https://ravah.ai/logo.png",
    sameAs: ["https://www.linkedin.com/company/ravah-ai"],
  },
  website: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Ravah.ai",
    url: "https://ravah.ai",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://ravah.ai/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  },
};

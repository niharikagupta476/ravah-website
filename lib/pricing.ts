export interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

export interface PricingComparisonRow {
  feature: string;
  values: boolean[];
}

export const pricingTiers: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    description: "For personal labs and trials.",
    features: [
      "1 workspace",
      "Basic pipeline summaries",
      "Community integrations",
      "Email support",
    ],
  },
  {
    name: "Pro",
    price: "$49",
    description: "For fast-moving platform teams.",
    features: [
      "Up to 20 engineers",
      "Pipeline + RCA copilots",
      "Slack + PagerDuty alerts",
      "Role-based access",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For regulated and global orgs.",
    features: [
      "Unlimited workspaces",
      "Alert copilot + automation guardrails",
      "Audit logs + SSO/SAML",
      "Dedicated success + SLAs",
    ],
  },
];

export const pricingComparison: PricingComparisonRow[] = [
  {
    feature: "Pipeline failure analysis",
    values: [true, true, true],
  },
  {
    feature: "Incident timeline + RCA",
    values: [false, true, true],
  },
  {
    feature: "Integrations (GitHub, GitLab, Slack)",
    values: [true, true, true],
  },
  {
    feature: "Audit logs + retention controls",
    values: [false, false, true],
  },
];

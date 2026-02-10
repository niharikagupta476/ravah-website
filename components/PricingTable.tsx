const tiers = [
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
    name: "Team",
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

const comparison = [
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

export function PricingTable() {
  return (
    <div className="stack">
      <div className="pricing-grid">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`card pricing-card ${tier.highlighted ? "highlight" : ""}`}
          >
            <h3>{tier.name}</h3>
            <p className="price">
              {tier.price}
              {tier.name === "Team" && <span>/seat/month</span>}
            </p>
            <p>{tier.description}</p>
            <ul>
              {tier.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <a className="button button-primary" href="/contact">
              Request Demo
            </a>
          </div>
        ))}
      </div>
      <div className="comparison">
        <h3>Feature comparison</h3>
        <div className="comparison-table">
          {comparison.map((row) => (
            <div key={row.feature} className="comparison-row">
              <span>{row.feature}</span>
              <div className="comparison-values">
                {row.values.map((value, index) => (
                  <span key={`${row.feature}-${index}`}>
                    {value ? "✓" : "—"}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

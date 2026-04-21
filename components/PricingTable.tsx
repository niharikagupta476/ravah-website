import { pricingComparison, pricingTiers } from "@/lib/pricing";

const tierCTAs: Record<string, { href: string; label: string; style: string }> = {
  Free: {
    href: "/contact?source=free",
    label: "Get Started Free",
    style: "button button-ghost",
  },
  Pro: {
    href: "/contact?source=pro",
    label: "Start Free Trial",
    style: "button button-primary",
  },
  Enterprise: {
    href: "/contact?source=enterprise",
    label: "Talk to Sales",
    style: "button button-ghost",
  },
};

export function PricingTable() {
  return (
    <div className="stack">
      <div className="pricing-grid">
        {pricingTiers.map((tier) => {
          const cta = tierCTAs[tier.name] ?? tierCTAs["Free"];
          return (
            <div
              key={tier.name}
              className={`card pricing-card ${tier.highlighted ? "highlight" : ""}`}
            >
              {tier.highlighted && (
                <span
                  style={{
                    display: "inline-block",
                    marginBottom: "8px",
                    padding: "2px 10px",
                    borderRadius: "999px",
                    background: "var(--accent)",
                    color: "#fff",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  Most Popular
                </span>
              )}
              <h3>{tier.name}</h3>
              <p className="price">
                {tier.price}
                {tier.name === "Pro" && <span>/seat/mo</span>}
              </p>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>{tier.description}</p>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  marginTop: "16px",
                  marginBottom: "20px",
                  display: "grid",
                  gap: "8px",
                }}
              >
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "8px",
                      fontSize: "0.9rem",
                      color: "var(--muted)",
                    }}
                  >
                    <span style={{ color: "var(--success)", fontWeight: 700, flexShrink: 0 }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <a className={cta.style} href={cta.href}>
                {cta.label}
              </a>
            </div>
          );
        })}
      </div>

      <div className="comparison">
        <h3>Feature comparison</h3>
        <div
          className="comparison-table"
          style={{ marginTop: "16px" }}
        >
          {/* Header row */}
          <div
            className="comparison-row"
            style={{ fontWeight: 700, fontSize: "0.8rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}
          >
            <span>Feature</span>
            <div className="comparison-values">
              {pricingTiers.map((t) => (
                <span key={t.name} style={{ minWidth: "64px", textAlign: "center" }}>
                  {t.name}
                </span>
              ))}
            </div>
          </div>
          {pricingComparison.map((row) => (
            <div key={row.feature} className="comparison-row">
              <span>{row.feature}</span>
              <div className="comparison-values">
                {row.values.map((value, index) => (
                  <span
                    key={`${row.feature}-${index}`}
                    style={{
                      minWidth: "64px",
                      textAlign: "center",
                      color: value ? "var(--success)" : "var(--muted)",
                      fontWeight: value ? 700 : 400,
                    }}
                  >
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

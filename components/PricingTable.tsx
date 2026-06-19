import { pricingComparison, pricingTiers } from "@/lib/pricing";

export function PricingTable() {
  return (
    <div className="stack">
      <div className="pricing-grid">
        {pricingTiers.map((tier) => (
          <div
            key={tier.name}
            className={`card pricing-card ${tier.highlighted ? "highlight" : ""}`}
          >
            <h3>{tier.name}</h3>
            <p className="price">
              {tier.price}
              {tier.name === "Pro" && <span>/seat/month</span>}
            </p>
            <p>{tier.description}</p>
            <ul>
              {tier.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <a className="button button-primary" href="/contact?source=request_demo">
              Request Demo
            </a>
          </div>
        ))}
      </div>
      <div className="comparison">
        <h3>Feature comparison</h3>
        <div className="comparison-table">
          {pricingComparison.map((row) => (
            <div key={row.feature} className="comparison-row">
              <span>{row.feature}</span>
              <div className="comparison-values">
                {row.values.map((value, index) => (
                  <span key={`${row.feature}-${index}`}>{value ? "✓" : "—"}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

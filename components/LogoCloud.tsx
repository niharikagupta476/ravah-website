const logos = [
  "Aurora Labs",
  "SignalOps",
  "Helix Infra",
  "Northwind Systems",
  "EdgeStack",
  "CloudHarbor",
];

export function LogoCloud() {
  return (
    <div className="logo-cloud" aria-label="Trusted by SRE teams">
      <p className="eyebrow">Trusted by SREs</p>
      <div className="logo-grid">
        {logos.map((logo) => (
          <div className="logo-card" key={logo}>
            {logo}
          </div>
        ))}
      </div>
    </div>
  );
}

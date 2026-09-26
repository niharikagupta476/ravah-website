const logos = ["Northwind", "LaunchLayer", "CloudForge", "MetricOps", "CircuitScale"];

export function TrustStrip() {
  return (
    <section className="border-y border-white/10 bg-slate-900/50 py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">
          Built for modern DevOps teams
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {logos.map((logo) => (
            <div
              key={logo}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-center text-sm font-medium text-slate-300"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

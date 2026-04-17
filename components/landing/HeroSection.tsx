import { TrackedLink } from "@/components/TrackedLink";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 py-20 sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_45%)]" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-200">
            AI DevOps Copilot for Reliability Teams
          </div>
          <div className="space-y-5">
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Prevent DevOps Failures Before They Happen
            </h1>
            <p className="max-w-2xl text-lg text-slate-300 sm:text-xl">
              Ravah analyzes your pipelines, detects risks early, and reduces MTTR with AI-driven insights.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <TrackedLink
              href="/contact?source=get_started"
              event="cta_demo_click"
              className="inline-flex items-center rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Get Started
            </TrackedLink>
            <TrackedLink
              href="/score"
              event="cta_docs_click"
              className="inline-flex items-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
            >
              Try Ravah Score
            </TrackedLink>
            <TrackedLink
              href="/score"
              event="score_cta_click"
              className="inline-flex items-center rounded-xl border border-cyan-300/40 bg-cyan-500/10 px-6 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
            >
              Measure your DevOps maturity
            </TrackedLink>
          </div>
        </div>

        <div className="rounded-2xl border border-white/15 bg-slate-900/80 p-5 shadow-2xl shadow-cyan-950/30">
          <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-semibold text-slate-100">Ravah Dashboard Mock</h3>
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300">Live Analysis</span>
          </div>
          <div className="space-y-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-slate-400">Pipeline Risk</p>
              <p className="mt-1 text-2xl font-semibold text-white">High (87)</p>
              <div className="mt-3 h-2 rounded-full bg-white/10">
                <div className="h-2 w-4/5 rounded-full bg-rose-400" />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-slate-400">Likely Root Cause</p>
                <p className="mt-1 text-sm font-medium text-slate-100">Env drift in staging deploy job</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-slate-400">Suggested Action</p>
                <p className="mt-1 text-sm font-medium text-slate-100">Revert config + rerun test matrix</p>
              </div>
            </div>
            <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.03] p-4 text-xs text-slate-400">
              Dashboard visualization placeholder (pipeline + incidents + AI insights)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { TrackedLink } from "@/components/TrackedLink";
import { LandingSection } from "./LandingSection";

const problems = ["Too many tools", "No clear root cause", "Slow incident resolution"];

const solutions = [
  {
    title: "Pipeline Intelligence",
    description:
      "Continuously analyzes CI/CD history, deploy patterns, and test reliability to surface failure hotspots.",
  },
  {
    title: "RCA Copilot",
    description:
      "Correlates logs, infra changes, and release events to explain incidents with evidence-backed root causes.",
  },
  {
    title: "Predictive Risk Engine",
    description:
      "Flags high-risk deployments before impact with confidence scoring and proactive guardrail recommendations.",
  },
];

const steps = [
  "Connect your tools",
  "Ravah analyzes your system",
  "Get insights + recommendations",
];

const testimonials = [
  {
    quote:
      "Ravah helped us identify recurring deploy regressions in days, not quarters.",
    author: "VP Engineering, B2B SaaS",
  },
  {
    quote: "Our on-call team now gets context before paging the entire org.",
    author: "Platform Lead, Fintech",
  },
];

export function ProblemAndSolution() {
  return (
    <>
      <LandingSection id="problem" title="DevOps is reactive today">
        <div className="grid gap-4 sm:grid-cols-3">
          {problems.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-lg font-medium text-slate-100"
            >
              {item}
            </div>
          ))}
        </div>
      </LandingSection>

      <LandingSection
        id="solution"
        title="One system that understands your DevOps"
        subtitle="From pipeline drift to incident response, Ravah unifies context and gives teams a clear next action."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {solutions.map((item) => (
            <article key={item.title} className="rounded-2xl border border-cyan-400/20 bg-cyan-500/5 p-6">
              <h3 className="text-xl font-semibold text-slate-100">{item.title}</h3>
              <p className="mt-3 text-slate-300">{item.description}</p>
            </article>
          ))}
        </div>
      </LandingSection>

      <LandingSection id="how-it-works" title="How it works">
        <div className="grid gap-4 sm:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs uppercase tracking-widest text-cyan-300">Step {index + 1}</p>
              <p className="mt-3 text-lg font-medium text-slate-100">{step}</p>
            </div>
          ))}
        </div>
      </LandingSection>
    </>
  );
}

export function ScoreSection() {
  return (
    <LandingSection
      id="ravah-score"
      title="Measure your DevOps maturity instantly"
      subtitle="Get a Ravah Score based on delivery, reliability, cost, and architecture."
    >
      <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-cyan-300/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-8 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-slate-300">Quick readiness assessment • 3 minutes • no integration needed</p>
        </div>
        <TrackedLink
          href="/score"
          event="cta_docs_click"
          className="inline-flex rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          Try Ravah Score
        </TrackedLink>
      </div>
    </LandingSection>
  );
}

export function ProductPreview() {
  const tabs = ["Pipeline", "Incidents", "Insights"];
  const skeletons = ["w-3/4", "w-1/2", "w-5/6", "w-2/3"];

  return (
    <LandingSection id="preview" title="Product Preview">
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6">
        <div className="mb-6 flex flex-wrap gap-2">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              type="button"
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                index === 0
                  ? "bg-cyan-400 text-slate-950"
                  : "border border-white/10 bg-white/[0.03] text-slate-200"
              }`}
              aria-label={`${tab} tab preview`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <p className="mb-4 text-sm text-slate-300">Pipeline health overview</p>
            <div className="space-y-3">
              {skeletons.map((width) => (
                <div key={width} className="h-3 rounded-full bg-white/10">
                  <div className={`h-3 ${width} animate-pulse rounded-full bg-cyan-400/60`} />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-slate-300">Insight feed</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-200">
              <li>• Risk spike detected in checkout deploy train</li>
              <li>• 2 related incidents linked to rollout window</li>
              <li>• Recommended: canary + dependency pinning</li>
            </ul>
          </div>
        </div>
      </div>
    </LandingSection>
  );
}

export function SocialAndFinalCta() {
  return (
    <>
      <LandingSection id="social-proof" title="Teams shipping with confidence">
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          {testimonials.map((item) => (
            <blockquote key={item.author} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-slate-100">“{item.quote}”</p>
              <footer className="mt-4 text-sm text-slate-400">{item.author}</footer>
            </blockquote>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-emerald-300/30 bg-emerald-500/10 p-6 text-center">
            <p className="text-3xl font-semibold text-emerald-200">40% faster MTTR</p>
          </div>
          <div className="rounded-2xl border border-cyan-300/30 bg-cyan-500/10 p-6 text-center">
            <p className="text-3xl font-semibold text-cyan-200">30% fewer incidents</p>
          </div>
        </div>
      </LandingSection>

      <LandingSection>
        <div className="rounded-3xl border border-white/15 bg-white/[0.04] p-10 text-center">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Stop reacting. Start preventing.</h2>
          <TrackedLink
            href="/contact"
            event="cta_demo_click"
            className="mt-6 inline-flex rounded-xl bg-cyan-400 px-7 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Start with Ravah
          </TrackedLink>
        </div>
      </LandingSection>
    </>
  );
}

"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { ScoreGauge } from "@/components/score/ScoreGauge";
import { ScoreRadarChart } from "@/components/score/ScoreRadarChart";

type ScoreMetricKey =
  | "delivery"
  | "cost"
  | "architecture"
  | "reliability"
  | "ai"
  | "devEx";

interface MetricBreakdown {
  raw: number;
  normalized: number;
  weight: number;
  weightedContribution: number;
}

interface ScoreInsight {
  metric: ScoreMetricKey;
  severity: "high" | "medium";
  title: string;
  detail: string;
}

interface ScoreRecommendation {
  metric: ScoreMetricKey;
  priority: "p0" | "p1" | "p2";
  action: string;
  expectedOutcome: string;
}

interface ScoreResult {
  score: number;
  breakdown: Record<ScoreMetricKey, MetricBreakdown>;
  insights: ScoreInsight[];
  recommendations: ScoreRecommendation[];
  shareText: string;
  resultId: string;
  shareUrl: string;
}

interface FormValues {
  deploymentsPerDay: string;
  leadTimeMinutes: string;
  changeFailureRate: string;
  mttrMinutes: string;
  monthlyCloudCost: string;
  idleResourcesPercent: string;
  costPerDeployment: string;
  autoscalingCoverage: string;
  multiAzCoverage: string;
  observabilityCoverage: string;
  iacCoverage: string;
  incidentsPerMonth: string;
  slaUptime: string;
  autoRemediation: string;
  aiUsagePercent: string;
  aiAlertReduction: string;
  aiUsageFrequency: string;
  buildTimeMinutes: string;
  setupTimeMinutes: string;
  deploymentFriction: string;
}

const initialValues: FormValues = {
  deploymentsPerDay: "3",
  leadTimeMinutes: "120",
  changeFailureRate: "10",
  mttrMinutes: "45",
  monthlyCloudCost: "5000",
  idleResourcesPercent: "20",
  costPerDeployment: "50",
  autoscalingCoverage: "70",
  multiAzCoverage: "80",
  observabilityCoverage: "75",
  iacCoverage: "85",
  incidentsPerMonth: "4",
  slaUptime: "99.5",
  autoRemediation: "35",
  aiUsagePercent: "25",
  aiAlertReduction: "15",
  aiUsageFrequency: "4",
  buildTimeMinutes: "18",
  setupTimeMinutes: "30",
  deploymentFriction: "4",
};

const metricLabels: Record<ScoreMetricKey, string> = {
  delivery: "Delivery",
  cost: "Cost",
  architecture: "Architecture",
  reliability: "Reliability",
  ai: "AI",
  devEx: "DevEx",
};

// Expected score improvement per recommendation action
const improvementEstimates: Record<ScoreMetricKey, number> = {
  delivery: 65,
  cost: 40,
  architecture: 45,
  reliability: 55,
  ai: 30,
  devEx: 35,
};

const priorityLabel: Record<"p0" | "p1" | "p2", { label: string; class: string }> = {
  p0: { label: "Critical", class: "bg-rose-900/60 text-rose-300 border border-rose-700" },
  p1: { label: "High",     class: "bg-amber-900/60 text-amber-300 border border-amber-700" },
  p2: { label: "Medium",   class: "bg-slate-700 text-slate-300 border border-slate-600" },
};

const controlClassName =
  "rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 placeholder:text-slate-400 caret-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500";

const submitButtonClassName =
  "mt-6 inline-flex h-11 w-full items-center justify-center whitespace-nowrap rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-70 sm:w-auto";

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getFieldError(name: keyof FormValues, value: string) {
  if (value.trim() === "") {
    return "Required";
  }

  const num = Number(value);
  if (!Number.isFinite(num)) {
    return "Enter a valid number";
  }

  const percentFields: Array<keyof FormValues> = [
    "changeFailureRate",
    "idleResourcesPercent",
    "autoscalingCoverage",
    "multiAzCoverage",
    "observabilityCoverage",
    "iacCoverage",
    "slaUptime",
    "autoRemediation",
    "aiUsagePercent",
    "aiAlertReduction",
  ];

  if (percentFields.includes(name)) {
    if (num < 0 || num > 100) {
      return "Must be between 0 and 100";
    }
    return "";
  }

  if (name === "deploymentFriction") {
    if (num < 0 || num > 10) {
      return "Must be between 0 and 10";
    }
    return "";
  }

  if (num < 0) {
    return "Must be 0 or greater";
  }

  return "";
}

function fieldToNumber(values: FormValues, key: keyof FormValues) {
  return Number(values[key]);
}

function aggregatePayload(values: FormValues) {
  const deploymentsPerDay = fieldToNumber(values, "deploymentsPerDay");
  const leadTimeMinutes = fieldToNumber(values, "leadTimeMinutes");
  const changeFailureRate = fieldToNumber(values, "changeFailureRate");
  const mttrMinutes = fieldToNumber(values, "mttrMinutes");

  const monthlyCloudCost = fieldToNumber(values, "monthlyCloudCost");
  const idleResourcesPercent = fieldToNumber(values, "idleResourcesPercent");
  const costPerDeployment = fieldToNumber(values, "costPerDeployment");

  const autoscalingCoverage = fieldToNumber(values, "autoscalingCoverage");
  const multiAzCoverage = fieldToNumber(values, "multiAzCoverage");
  const observabilityCoverage = fieldToNumber(values, "observabilityCoverage");
  const iacCoverage = fieldToNumber(values, "iacCoverage");

  const incidentsPerMonth = fieldToNumber(values, "incidentsPerMonth");
  const slaUptime = fieldToNumber(values, "slaUptime");
  const autoRemediation = fieldToNumber(values, "autoRemediation");

  const aiUsagePercent = fieldToNumber(values, "aiUsagePercent");
  const aiAlertReduction = fieldToNumber(values, "aiAlertReduction");
  const aiUsageFrequency = fieldToNumber(values, "aiUsageFrequency");

  const buildTimeMinutes = fieldToNumber(values, "buildTimeMinutes");
  const setupTimeMinutes = fieldToNumber(values, "setupTimeMinutes");
  const deploymentFriction = fieldToNumber(values, "deploymentFriction");

  const delivery =
    (clamp((deploymentsPerDay / 20) * 100, 0, 100) +
      clamp(100 - (leadTimeMinutes / 720) * 100, 0, 100) +
      clamp(100 - changeFailureRate, 0, 100) +
      clamp(100 - (mttrMinutes / 240) * 100, 0, 100)) /
    4;

  const cost =
    (clamp(100 - (monthlyCloudCost / 50000) * 100, 0, 100) +
      clamp(100 - idleResourcesPercent, 0, 100) +
      clamp(100 - (costPerDeployment / 500) * 100, 0, 100)) /
    3;

  const architecture =
    (clamp(autoscalingCoverage, 0, 100) +
      clamp(multiAzCoverage, 0, 100) +
      clamp(observabilityCoverage, 0, 100) +
      clamp(iacCoverage, 0, 100)) /
    4;

  const reliability =
    (clamp(100 - (incidentsPerMonth / 30) * 100, 0, 100) +
      clamp(slaUptime, 0, 100) +
      clamp(autoRemediation, 0, 100)) /
    3;

  const ai =
    (clamp(aiUsagePercent, 0, 100) +
      clamp(aiAlertReduction, 0, 100) +
      clamp((aiUsageFrequency / 20) * 100, 0, 100)) /
    3;

  const devEx =
    (clamp(100 - (buildTimeMinutes / 120) * 100, 0, 100) +
      clamp(100 - (setupTimeMinutes / 240) * 100, 0, 100) +
      clamp(100 - deploymentFriction * 10, 0, 100)) /
    3;

  return {
    delivery: Number(delivery.toFixed(2)),
    cost: Number(cost.toFixed(2)),
    architecture: Number(architecture.toFixed(2)),
    reliability: Number(reliability.toFixed(2)),
    ai: Number(ai.toFixed(2)),
    devEx: Number(devEx.toFixed(2)),
  };
}

function MetricInput({
  id,
  label,
  helper,
  unit,
  placeholder,
  value,
  error,
  onChange,
}: {
  id: keyof FormValues;
  label: string;
  helper: string;
  unit: string;
  placeholder: string;
  value: string;
  error?: string;
  onChange: (key: keyof FormValues, value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-white" htmlFor={id}>
        {label}
      </label>
      <p className="text-xs text-slate-400">{helper}</p>
      <div className="grid grid-cols-[1fr_auto] items-center gap-3">
        <input
          className={controlClassName}
          id={id}
          name={id}
          type="number"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(id, event.target.value)}
          required
        />
        <span className="min-w-[52px] text-right text-xs font-medium text-slate-400">{unit}</span>
      </div>
      {error && <p className="text-xs text-rose-300">{error}</p>}
    </div>
  );
}

function PillarScoreBar({ label, score }: { label: string; score: number }) {
  const pct = Math.round((score / 1000) * 100);
  const barColor =
    score >= 700
      ? "bg-emerald-500"
      : score >= 400
        ? "bg-amber-500"
        : "bg-rose-500";

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-300">{label}</span>
        <span className="tabular-nums text-slate-400">{score}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function CopyButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    onClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      className="rounded-lg border border-slate-600 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
      type="button"
      onClick={handleClick}
    >
      {copied ? "✓ Copied" : children}
    </button>
  );
}

export function ScoreAssessmentForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [leadStatus, setLeadStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [leadMessage, setLeadMessage] = useState("");
  const [result, setResult] = useState<ScoreResult | null>(null);

  const absoluteShareUrl = useMemo(() => {
    if (!result || typeof window === "undefined") {
      return "";
    }
    return new URL(result.shareUrl, window.location.origin).toString();
  }, [result]);

  const radarData = useMemo(() => {
    if (!result) {
      return [];
    }
    return Object.entries(result.breakdown).map(([metric, value]) => ({
      metric: metricLabels[metric as ScoreMetricKey],
      value: value.normalized,
    }));
  }, [result]);

  const handleChange = (key: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: getFieldError(key, value) }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Partial<Record<keyof FormValues, string>> = {};
    (Object.keys(values) as Array<keyof FormValues>).forEach((key) => {
      const error = getFieldError(key, values[key]);
      if (error) {
        nextErrors[key] = error;
      }
    });

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("error");
      setErrorMessage("Please fix the highlighted fields before calculating.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");
    setLeadStatus("idle");
    setLeadMessage("");
    trackEvent("score_started");

    const payload = aggregatePayload(values);

    try {
      const response = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as ScoreResult & { error?: string };

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Unable to calculate score right now.");
        return;
      }

      setResult(data);
      setStatus("success");
      trackEvent("score_completed", { score: String(data.score), result_id: data.resultId });
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  };

  const handleCaptureLead = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!result) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "");

    setLeadStatus("loading");
    setLeadMessage("");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, resultId: result.resultId }),
      });

      const data = (await response.json()) as { success: boolean; error?: string };

      if (!response.ok || !data.success) {
        setLeadStatus("error");
        setLeadMessage(data.error || "Unable to send report.");
        return;
      }

      setLeadStatus("success");
      setLeadMessage("Full report sent. Check your inbox.");
      trackEvent("score_cta_click", { cta: "lead_capture", result_id: result.resultId });
    } catch {
      setLeadStatus("error");
      setLeadMessage("Network error. Please try again.");
    }
  };

  const linkedInUrl = absoluteShareUrl
    ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(absoluteShareUrl)}`
    : "#";

  return (
    <div className="mt-8 grid gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:grid-cols-2">
      {/* ── LEFT PANEL: inputs ── */}
      <form className="form max-h-[80vh] space-y-5 overflow-y-auto pr-2" onSubmit={handleSubmit}>
        <h3 className="text-lg font-semibold text-white">Assessment Inputs</h3>

        <section className="space-y-4">
          <h4 className="border-b border-slate-700 pb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Delivery
          </h4>
          <div className="grid gap-4">
            <MetricInput
              id="deploymentsPerDay"
              label="Deployments per Day"
              helper="How many times do you deploy to production daily?"
              unit="/day"
              placeholder="e.g. 3"
              value={values.deploymentsPerDay}
              error={fieldErrors.deploymentsPerDay}
              onChange={handleChange}
            />
            <MetricInput
              id="leadTimeMinutes"
              label="Lead Time"
              helper="Average time from commit to production"
              unit="min"
              placeholder="e.g. 120"
              value={values.leadTimeMinutes}
              error={fieldErrors.leadTimeMinutes}
              onChange={handleChange}
            />
            <MetricInput
              id="changeFailureRate"
              label="Failure Rate"
              helper="Percentage of deployments that fail"
              unit="%"
              placeholder="e.g. 10"
              value={values.changeFailureRate}
              error={fieldErrors.changeFailureRate}
              onChange={handleChange}
            />
            <MetricInput
              id="mttrMinutes"
              label="Mean Time to Recovery"
              helper="Average time to recover from incidents"
              unit="min"
              placeholder="e.g. 45"
              value={values.mttrMinutes}
              error={fieldErrors.mttrMinutes}
              onChange={handleChange}
            />
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="border-b border-slate-700 pb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Cost
          </h4>
          <div className="grid gap-4">
            <MetricInput
              id="monthlyCloudCost"
              label="Monthly Cloud Cost"
              helper="Total monthly cloud spend"
              unit="$/mo"
              placeholder="e.g. 5000"
              value={values.monthlyCloudCost}
              error={fieldErrors.monthlyCloudCost}
              onChange={handleChange}
            />
            <MetricInput
              id="idleResourcesPercent"
              label="Idle Resources"
              helper="Percentage of idle or unused resources"
              unit="%"
              placeholder="e.g. 20"
              value={values.idleResourcesPercent}
              error={fieldErrors.idleResourcesPercent}
              onChange={handleChange}
            />
            <MetricInput
              id="costPerDeployment"
              label="Cost per Deployment"
              helper="Average cost to execute one deployment"
              unit="$"
              placeholder="e.g. 50"
              value={values.costPerDeployment}
              error={fieldErrors.costPerDeployment}
              onChange={handleChange}
            />
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="border-b border-slate-700 pb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Architecture
          </h4>
          <div className="grid gap-4">
            <MetricInput id="autoscalingCoverage" label="Autoscaling Coverage" helper="Services protected by autoscaling" unit="%" placeholder="70" value={values.autoscalingCoverage} error={fieldErrors.autoscalingCoverage} onChange={handleChange} />
            <MetricInput id="multiAzCoverage" label="Multi-AZ Coverage" helper="Workloads deployed across multiple AZs" unit="%" placeholder="80" value={values.multiAzCoverage} error={fieldErrors.multiAzCoverage} onChange={handleChange} />
            <MetricInput id="observabilityCoverage" label="Observability Coverage" helper="Services with logs, metrics, and traces" unit="%" placeholder="75" value={values.observabilityCoverage} error={fieldErrors.observabilityCoverage} onChange={handleChange} />
            <MetricInput id="iacCoverage" label="IaC Coverage" helper="Infrastructure managed as code" unit="%" placeholder="85" value={values.iacCoverage} error={fieldErrors.iacCoverage} onChange={handleChange} />
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="border-b border-slate-700 pb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Reliability
          </h4>
          <div className="grid gap-4">
            <MetricInput id="incidentsPerMonth" label="Incidents per Month" helper="Production incidents occurring monthly" unit="count" placeholder="4" value={values.incidentsPerMonth} error={fieldErrors.incidentsPerMonth} onChange={handleChange} />
            <MetricInput id="slaUptime" label="SLA Uptime" helper="Observed uptime against SLA target" unit="%" placeholder="99.5" value={values.slaUptime} error={fieldErrors.slaUptime} onChange={handleChange} />
            <MetricInput id="autoRemediation" label="Auto-remediation" helper="Incidents resolved automatically" unit="%" placeholder="35" value={values.autoRemediation} error={fieldErrors.autoRemediation} onChange={handleChange} />
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="border-b border-slate-700 pb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
            AI
          </h4>
          <div className="grid gap-4">
            <MetricInput id="aiUsagePercent" label="AI Usage in DevOps" helper="Workflows using AI support" unit="%" placeholder="25" value={values.aiUsagePercent} error={fieldErrors.aiUsagePercent} onChange={handleChange} />
            <MetricInput id="aiAlertReduction" label="AI Alert Reduction" helper="Alert noise reduced by AI" unit="%" placeholder="15" value={values.aiAlertReduction} error={fieldErrors.aiAlertReduction} onChange={handleChange} />
            <MetricInput id="aiUsageFrequency" label="AI Usage Frequency" helper="How often teams use AI tools per week" unit="×/wk" placeholder="4" value={values.aiUsageFrequency} error={fieldErrors.aiUsageFrequency} onChange={handleChange} />
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="border-b border-slate-700 pb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
            DevEx
          </h4>
          <div className="grid gap-4">
            <MetricInput id="buildTimeMinutes" label="Average Build Time" helper="Average CI build duration" unit="min" placeholder="18" value={values.buildTimeMinutes} error={fieldErrors.buildTimeMinutes} onChange={handleChange} />
            <MetricInput id="setupTimeMinutes" label="Dev Setup Time" helper="Time to set up local dev environment" unit="min" placeholder="30" value={values.setupTimeMinutes} error={fieldErrors.setupTimeMinutes} onChange={handleChange} />
            <MetricInput id="deploymentFriction" label="Deployment Friction" helper="Subjective release friction score (0 = easy, 10 = painful)" unit="/10" placeholder="4" value={values.deploymentFriction} error={fieldErrors.deploymentFriction} onChange={handleChange} />
          </div>
        </section>

        <button className={submitButtonClassName} type="submit" disabled={status === "loading"}>
          {status === "loading" ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Calculating…
            </span>
          ) : (
            "Calculate Score →"
          )}
        </button>
        {status === "error" && (
          <p className="hero-note text-rose-300" role="alert">
            {errorMessage}
          </p>
        )}
      </form>

      {/* ── RIGHT PANEL: results ── */}
      <div className="space-y-6 overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6 text-white lg:max-h-[80vh]">
        {!result && (
          <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800 text-3xl">
              📊
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Your Ravah Score</h3>
              <p className="mt-1 max-w-xs text-sm text-slate-400">
                Fill in your DevOps metrics on the left and click <strong className="text-slate-300">Calculate Score</strong> to benchmark your maturity.
              </p>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-3 text-xs text-slate-500">
              <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-2 text-center">
                <div className="text-base">🚀</div>
                <div className="mt-1 font-medium">Delivery</div>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-2 text-center">
                <div className="text-base">🛡️</div>
                <div className="mt-1 font-medium">Reliability</div>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-2 text-center">
                <div className="text-base">💡</div>
                <div className="mt-1 font-medium">AI & DevEx</div>
              </div>
            </div>
          </div>
        )}

        {result && (
          <>
            {/* 1. Score gauge */}
            <ScoreGauge score={result.score} />

            {/* Divider */}
            <div className="border-t border-slate-700" />

            {/* 2. Pillar breakdown (bar chart) */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                Pillar Breakdown
              </h4>
              <div className="space-y-3">
                {Object.entries(result.breakdown).map(([metric, value]) => (
                  <PillarScoreBar
                    key={metric}
                    label={metricLabels[metric as ScoreMetricKey]}
                    score={value.normalized}
                  />
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-700" />

            {/* 3. Radar chart */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                Maturity Profile
              </h4>
              <ScoreRadarChart data={radarData} />
            </div>

            {/* Divider */}
            <div className="border-t border-slate-700" />

            {/* 4. Insights */}
            {result.insights.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                  Key Findings
                </h4>
                <div className="space-y-2">
                  {result.insights.map((insight) => (
                    <div
                      key={`${insight.metric}-${insight.title}`}
                      className={`rounded-xl border p-3 ${
                        insight.severity === "high"
                          ? "border-rose-800 bg-rose-950/40"
                          : "border-amber-800 bg-amber-950/30"
                      }`}
                    >
                      <p className="text-sm font-semibold text-white">{insight.title}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{insight.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Recommendations */}
            {result.recommendations.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                  Recommendations
                </h4>
                <div className="space-y-2">
                  {result.recommendations.map((rec) => {
                    const p = priorityLabel[rec.priority];
                    const gain = improvementEstimates[rec.metric] ?? 30;
                    return (
                      <div
                        key={`${rec.metric}-${rec.priority}`}
                        className="rounded-xl border border-slate-700 bg-slate-800/60 p-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm text-slate-200">{rec.action}</p>
                          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${p.class}`}>
                            {p.label}
                          </span>
                        </div>
                        <div className="mt-1.5 flex items-center justify-between">
                          <p className="text-xs text-slate-500">{rec.expectedOutcome}</p>
                          <span className="text-xs font-semibold text-emerald-400">+{gain} pts</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-slate-700" />

            {/* 6. CTA */}
            <div className="rounded-xl border border-blue-800 bg-blue-950/40 p-4">
              <h4 className="text-sm font-semibold text-white">
                Want Ravah to fix this automatically?
              </h4>
              <p className="mt-1 text-xs text-slate-400">
                Ravah automates the top recommendations above — from pipeline optimization to AI-powered incident triage.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href="/product"
                  className="inline-flex h-9 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
                  onClick={() => trackEvent("score_cta_click", { cta: "start_using_ravah" })}
                >
                  Start Using Ravah
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-600 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                  onClick={() => trackEvent("score_cta_click", { cta: "book_demo" })}
                >
                  Book a Demo
                </Link>
              </div>
            </div>

            {/* 7. Email report */}
            <form className="space-y-2" onSubmit={handleCaptureLead}>
              <label className="text-sm font-semibold text-white" htmlFor="lead-email">
                Get the full report in your inbox
              </label>
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="lead-email"
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  required
                />
                <button
                  className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                  type="submit"
                  disabled={leadStatus === "loading" || leadStatus === "success"}
                >
                  {leadStatus === "loading" ? "Sending…" : leadStatus === "success" ? "✓ Sent" : "Send"}
                </button>
              </div>
              {leadStatus !== "idle" && (
                <p className={`text-xs ${leadStatus === "success" ? "text-emerald-400" : "text-rose-400"}`}>
                  {leadMessage}
                </p>
              )}
            </form>

            {/* 8. Share */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Share result</p>
              <div className="flex flex-wrap gap-2">
                <CopyButton onClick={async () => { if (result && navigator?.clipboard?.writeText) { await navigator.clipboard.writeText(result.shareText); trackEvent("score_cta_click", { cta: "copy_share_text" }); } }}>
                  Copy text
                </CopyButton>
                <CopyButton onClick={async () => { if (absoluteShareUrl && navigator?.clipboard?.writeText) { await navigator.clipboard.writeText(absoluteShareUrl); trackEvent("score_cta_click", { cta: "copy_share_link" }); } }}>
                  Copy link
                </CopyButton>
                <a
                  className="rounded-lg border border-slate-600 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
                  href={linkedInUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackEvent("score_cta_click", { cta: "share_linkedin" })}
                >
                  LinkedIn
                </a>
                <Link
                  className="rounded-lg border border-slate-600 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
                  href={result.shareUrl}
                >
                  View saved result
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

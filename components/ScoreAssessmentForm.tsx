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

const metricLabels: Record<ScoreMetricKey, string> = {
  delivery: "Delivery",
  cost: "Cost",
  architecture: "Architecture",
  reliability: "Reliability",
  ai: "AI",
  devEx: "DevEx",
};

const controlClassName =
  "rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 placeholder:text-slate-400 caret-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

const submitButtonClassName =
  "mt-6 inline-flex h-11 w-full sm:w-auto items-center justify-center whitespace-nowrap rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-70";

export function ScoreAssessmentForm() {
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    setLeadStatus("idle");
    setLeadMessage("");
    trackEvent("score_started");

    const formData = new FormData(event.currentTarget);

    const payload = {
      delivery: Number(formData.get("delivery") || 0),
      cost: Number(formData.get("cost") || 0),
      architecture: Number(formData.get("architecture") || 0),
      reliability: Number(formData.get("reliability") || 0),
      ai: Number(formData.get("ai") || 0),
      devEx: Number(formData.get("devEx") || 0),
    };

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

  const handleCopyShareLink = async () => {
    if (!absoluteShareUrl || !navigator?.clipboard?.writeText) {
      return;
    }

    await navigator.clipboard.writeText(absoluteShareUrl);
    trackEvent("score_cta_click", { cta: "copy_share_link" });
  };

  const handleCopyShareText = async () => {
    if (!result || !navigator?.clipboard?.writeText) {
      return;
    }

    await navigator.clipboard.writeText(result.shareText);
    trackEvent("score_cta_click", { cta: "copy_share_text" });
  };

  const linkedInUrl = absoluteShareUrl
    ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(absoluteShareUrl)}`
    : "#";

  return (
    <div className="mt-8 grid gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:grid-cols-2">
      <form className="form space-y-4" onSubmit={handleSubmit}>
        <h3 className="text-lg font-semibold text-white">Assessment Inputs</h3>
        <div className="form-row gap-4">
          <div>
            <label className="text-white" htmlFor="delivery">Delivery</label>
            <input className={controlClassName} id="delivery" name="delivery" type="number" min={0} max={100} defaultValue={60} required />
          </div>
          <div>
            <label className="text-white" htmlFor="cost">Cost</label>
            <input className={controlClassName} id="cost" name="cost" type="number" min={0} max={100} defaultValue={60} required />
          </div>
        </div>

        <div className="form-row gap-4">
          <div>
            <label className="text-white" htmlFor="architecture">Architecture</label>
            <input className={controlClassName} id="architecture" name="architecture" type="number" min={0} max={100} defaultValue={60} required />
          </div>
          <div>
            <label className="text-white" htmlFor="reliability">Reliability</label>
            <input className={controlClassName} id="reliability" name="reliability" type="number" min={0} max={100} defaultValue={60} required />
          </div>
        </div>

        <div className="form-row gap-4">
          <div>
            <label className="text-white" htmlFor="ai">AI</label>
            <input className={controlClassName} id="ai" name="ai" type="number" min={0} max={100} defaultValue={60} required />
          </div>
          <div>
            <label className="text-white" htmlFor="devEx">DevEx</label>
            <input className={controlClassName} id="devEx" name="devEx" type="number" min={0} max={100} defaultValue={60} required />
          </div>
        </div>

        <button className={submitButtonClassName} type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Calculating..." : "Calculate Score"}
        </button>
        {status === "error" && (
          <p className="hero-note text-rose-300" role="alert">
            {errorMessage}
          </p>
        )}
      </form>

      <div className="space-y-6 rounded-2xl border border-slate-700 bg-slate-900 p-8 text-white">
        {!result && (
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-white">Your Ravah Score</h3>
            <p className="text-slate-300">Submit the left panel to generate a full score report.</p>
          </div>
        )}

        {result && (
          <>
            <div className="space-y-6">
              <ScoreGauge score={result.score} />
            </div>

            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-white">Breakdown</h4>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(result.breakdown).map(([metric, value]) => (
                  <div key={metric} className="rounded-xl border border-slate-700 bg-slate-800 p-4">
                    <p className="text-sm text-slate-300">{metricLabels[metric as ScoreMetricKey]}</p>
                    <p className="text-lg font-semibold text-white">{value.normalized}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-white">Metric Shape</h4>
              <ScoreRadarChart data={radarData} />
            </div>

            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-white">Insights</h4>
              {result.insights.length === 0 ? (
                <p className="text-slate-300">No critical issues detected.</p>
              ) : (
                <div className="space-y-2">
                  {result.insights.map((insight) => (
                    <p key={`${insight.metric}-${insight.title}`} className="text-slate-200">
                      ⚠️ <span className="font-medium text-white">{insight.title}:</span> {insight.detail}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-white">Want Ravah to fix this automatically?</h4>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/product"
                  className="inline-flex h-11 w-full sm:w-auto items-center justify-center whitespace-nowrap rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-70"
                  onClick={() => trackEvent("score_cta_click", { cta: "start_using_ravah" })}
                >
                  Start Using Ravah
                </Link>
                <Link
                  href="/contact"
                  className="rounded-lg border border-slate-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  onClick={() => trackEvent("score_cta_click", { cta: "book_demo" })}
                >
                  Book Demo
                </Link>
              </div>
            </div>

            <form className="form space-y-3" onSubmit={handleCaptureLead}>
              <label className="text-white" htmlFor="lead-email">Get full report in your inbox</label>
              <input className={controlClassName} id="lead-email" name="email" type="email" required />
              <button
                className="inline-flex h-11 w-full sm:w-auto items-center justify-center whitespace-nowrap rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-70"
                type="submit"
                disabled={leadStatus === "loading"}
              >
                {leadStatus === "loading" ? "Sending..." : "Send report"}
              </button>
              {leadStatus !== "idle" && <p className="text-sm text-slate-300">{leadMessage}</p>}
            </form>

            <div className="flex flex-wrap gap-3">
              <button
                className="rounded-lg border border-slate-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                type="button"
                onClick={handleCopyShareText}
              >
                Copy share text
              </button>
              <button
                className="rounded-lg border border-slate-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                type="button"
                onClick={handleCopyShareLink}
              >
                Copy share link
              </button>
              <a
                className="rounded-lg border border-slate-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                href={linkedInUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent("score_cta_click", { cta: "share_linkedin" })}
              >
                Share on LinkedIn
              </a>
              <Link
                className="rounded-lg border border-slate-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                href={result.shareUrl}
              >
                Open saved result
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

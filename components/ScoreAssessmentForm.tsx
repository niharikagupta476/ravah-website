"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics";

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
    if (!absoluteShareUrl) {
      return;
    }

    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(absoluteShareUrl);
      trackEvent("score_cta_click", { cta: "copy_share_link" });
    }
  };

  const handleCopyShareText = async () => {
    if (!result) {
      return;
    }

    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(result.shareText);
      trackEvent("score_cta_click", { cta: "copy_share_text" });
    }
  };

  const linkedInUrl = absoluteShareUrl
    ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(absoluteShareUrl)}`
    : "#";

  return (
    <div className="mt-8 grid gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:grid-cols-2">
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div>
            <label htmlFor="delivery">Delivery</label>
            <input id="delivery" name="delivery" type="number" min={0} max={100} defaultValue={60} required />
          </div>
          <div>
            <label htmlFor="cost">Cost</label>
            <input id="cost" name="cost" type="number" min={0} max={100} defaultValue={60} required />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label htmlFor="architecture">Architecture</label>
            <input id="architecture" name="architecture" type="number" min={0} max={100} defaultValue={60} required />
          </div>
          <div>
            <label htmlFor="reliability">Reliability</label>
            <input id="reliability" name="reliability" type="number" min={0} max={100} defaultValue={60} required />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label htmlFor="ai">AI</label>
            <input id="ai" name="ai" type="number" min={0} max={100} defaultValue={60} required />
          </div>
          <div>
            <label htmlFor="devEx">DevEx</label>
            <input id="devEx" name="devEx" type="number" min={0} max={100} defaultValue={60} required />
          </div>
        </div>

        <button className="button button-primary" type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Calculating..." : "Calculate Score"}
        </button>
        {status === "error" && (
          <p className="hero-note" role="alert">
            {errorMessage}
          </p>
        )}
      </form>

      <div className="card">
        <h3>Your Ravah Score</h3>
        {!result && <p className="hero-note">Submit the wizard to see your score breakdown and actions.</p>}
        {result && (
          <div className="stack">
            <p className="price">{result.score}</p>
            <p className="hero-note">{result.shareText}</p>

            <div className="stack">
              {Object.entries(result.breakdown).map(([metric, value]) => (
                <p key={metric}>
                  <strong>{metricLabels[metric as ScoreMetricKey]}:</strong> {value.normalized}/1000
                </p>
              ))}
            </div>

            <div className="stack">
              <h4>Insights</h4>
              {result.insights.length === 0 ? (
                <p className="hero-note">No critical issues detected.</p>
              ) : (
                result.insights.map((insight) => (
                  <p key={`${insight.metric}-${insight.title}`}>
                    <strong>{insight.title}:</strong> {insight.detail}
                  </p>
                ))
              )}
            </div>

            <div className="stack">
              <h4>Recommendations</h4>
              {result.recommendations.map((recommendation) => (
                <p key={`${recommendation.metric}-${recommendation.priority}`}>
                  <strong>{recommendation.priority.toUpperCase()}:</strong> {recommendation.action}
                </p>
              ))}
            </div>

            <div className="stack">
              <h4>Want Ravah to fix this automatically?</h4>
              <div className="cta-actions">
                <Link
                  href="/product"
                  className="button button-primary"
                  onClick={() => trackEvent("score_cta_click", { cta: "start_using_ravah" })}
                >
                  Start Using Ravah
                </Link>
                <Link
                  href="/contact"
                  className="button button-ghost"
                  onClick={() => trackEvent("score_cta_click", { cta: "book_demo" })}
                >
                  Book Demo
                </Link>
              </div>
            </div>

            <form className="form" onSubmit={handleCaptureLead}>
              <label htmlFor="lead-email">Get full report in your inbox</label>
              <input id="lead-email" name="email" type="email" required />
              <button className="button button-primary" type="submit" disabled={leadStatus === "loading"}>
                {leadStatus === "loading" ? "Sending..." : "Send report"}
              </button>
              {leadStatus !== "idle" && <p className="hero-note">{leadMessage}</p>}
            </form>

            <div className="cta-actions">
              <button className="button button-ghost" type="button" onClick={handleCopyShareText}>
                Copy share text
              </button>
              <button className="button button-ghost" type="button" onClick={handleCopyShareLink}>
                Copy share link
              </button>
              <a
                className="button button-ghost"
                href={linkedInUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent("score_cta_click", { cta: "share_linkedin" })}
              >
                Share on LinkedIn
              </a>
            </div>
            <Link className="button button-ghost" href={result.shareUrl}>
              Open saved result
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

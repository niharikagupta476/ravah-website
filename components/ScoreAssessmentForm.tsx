"use client";

import { FormEvent, useState } from "react";

interface ScoreResult {
  score: number;
  band: string;
  recommendation: string;
}

export function ScoreAssessmentForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState<ScoreResult | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);

    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      delivery: Number(formData.get("delivery") || 0),
      reliability: Number(formData.get("reliability") || 0),
      cost: Number(formData.get("cost") || 0),
      architecture: Number(formData.get("architecture") || 0),
    };

    try {
      const response = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as {
        success: boolean;
        error?: string;
        result?: ScoreResult;
      };

      if (!response.ok || !data.success || !data.result) {
        setStatus("error");
        setErrorMessage(data.error || "Unable to calculate score right now.");
        return;
      }

      setResult(data.result);
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  };

  return (
    <div className="mt-8 grid gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:grid-cols-2">
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div>
            <label htmlFor="score-name">Name</label>
            <input id="score-name" name="name" type="text" required />
          </div>
          <div>
            <label htmlFor="score-email">Work email</label>
            <input id="score-email" name="email" type="email" required />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label htmlFor="delivery">Delivery</label>
            <input id="delivery" name="delivery" type="number" min={1} max={5} defaultValue={3} required />
          </div>
          <div>
            <label htmlFor="reliability">Reliability</label>
            <input
              id="reliability"
              name="reliability"
              type="number"
              min={1}
              max={5}
              defaultValue={3}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label htmlFor="cost">Cost</label>
            <input id="cost" name="cost" type="number" min={1} max={5} defaultValue={3} required />
          </div>
          <div>
            <label htmlFor="architecture">Architecture</label>
            <input
              id="architecture"
              name="architecture"
              type="number"
              min={1}
              max={5}
              defaultValue={3}
              required
            />
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
        {!result && <p className="hero-note">Submit the form to benchmark your current maturity.</p>}
        {result && (
          <div className="stack">
            <p className="price">{result.score}</p>
            <p className="eyebrow">{result.band}</p>
            <p>{result.recommendation}</p>
          </div>
        )}
      </div>
    </div>
  );
}

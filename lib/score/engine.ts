import {
  type ScoreInput,
  type ScoreMetricKey,
  type ScoreResult,
  type WeightedMetric,
  type ScoreInsight,
  type ScoreRecommendation,
} from "@/lib/score/types";

const METRIC_CONFIG: WeightedMetric[] = [
  { key: "delivery", label: "Delivery", weight: 0.25 },
  { key: "cost", label: "Cost", weight: 0.2 },
  { key: "architecture", label: "Architecture", weight: 0.2 },
  { key: "reliability", label: "Reliability", weight: 0.15 },
  { key: "ai", label: "AI", weight: 0.1 },
  { key: "devEx", label: "DevEx", weight: 0.1 },
];

function normalizeMetric(rawValue: number): number {
  if (!Number.isFinite(rawValue)) {
    return 0;
  }

  if (rawValue <= 100) {
    return Math.max(0, Math.min(1000, Math.round(rawValue * 10)));
  }

  return Math.max(0, Math.min(1000, Math.round(rawValue)));
}

function getInsight(metric: ScoreMetricKey, normalized: number): ScoreInsight | null {
  if (normalized >= 650) {
    return null;
  }

  if (metric === "delivery") {
    return {
      metric,
      severity: normalized < 450 ? "high" : "medium",
      title: "Delivery bottleneck",
      detail: "Lead time and release flow indicate friction in the delivery pipeline.",
    };
  }

  if (metric === "cost") {
    return {
      metric,
      severity: normalized < 450 ? "high" : "medium",
      title: "Cost inefficiency",
      detail: "Resource usage and idle capacity suggest opportunities to reduce infrastructure spend.",
    };
  }

  if (metric === "architecture") {
    return {
      metric,
      severity: normalized < 450 ? "high" : "medium",
      title: "Architecture risk",
      detail: "Service boundaries and dependency patterns indicate elevated reliability and scaling risk.",
    };
  }

  if (metric === "reliability") {
    return {
      metric,
      severity: normalized < 450 ? "high" : "medium",
      title: "Reliability gap",
      detail: "Incident frequency and recovery depth indicate opportunities to improve operational resilience.",
    };
  }

  if (metric === "ai") {
    return {
      metric,
      severity: normalized < 450 ? "high" : "medium",
      title: "AI adoption lag",
      detail: "Engineering workflows are underusing AI-assisted analysis and automation.",
    };
  }

  return {
    metric,
    severity: normalized < 450 ? "high" : "medium",
    title: "Developer experience drag",
    detail: "Toolchain and feedback loops are slowing engineering throughput.",
  };
}

function getRecommendation(metric: ScoreMetricKey): ScoreRecommendation {
  if (metric === "delivery") {
    return {
      metric,
      priority: "p0",
      action: "Optimize CI pipelines with parallelized test stages and flaky test detection.",
      expectedOutcome: "Reduce lead time and improve release predictability.",
    };
  }

  if (metric === "cost") {
    return {
      metric,
      priority: "p1",
      action: "Introduce autoscaling, right-sizing, and schedule-based shutdown for non-prod environments.",
      expectedOutcome: "Lower cloud spend while keeping performance targets stable.",
    };
  }

  if (metric === "architecture") {
    return {
      metric,
      priority: "p1",
      action: "Refactor high-blast-radius services and enforce dependency ownership boundaries.",
      expectedOutcome: "Improve system resilience and reduce failure propagation.",
    };
  }

  if (metric === "reliability") {
    return {
      metric,
      priority: "p0",
      action: "Implement SLO-driven alerting and runbook coverage for critical services.",
      expectedOutcome: "Reduce MTTR and incident recurrence.",
    };
  }

  if (metric === "ai") {
    return {
      metric,
      priority: "p2",
      action: "Roll out AI-assisted RCA and deploy risk checks in engineering workflows.",
      expectedOutcome: "Increase decision speed and reduce manual triage effort.",
    };
  }

  return {
    metric,
    priority: "p2",
    action: "Improve local dev feedback loops and standardize developer onboarding playbooks.",
    expectedOutcome: "Increase developer throughput and satisfaction.",
  };
}

export function calculateRavahScore(input: ScoreInput): ScoreResult {
  const breakdown = {
    delivery: { raw: 0, normalized: 0, weight: 0.25, weightedContribution: 0 },
    cost: { raw: 0, normalized: 0, weight: 0.2, weightedContribution: 0 },
    architecture: { raw: 0, normalized: 0, weight: 0.2, weightedContribution: 0 },
    reliability: { raw: 0, normalized: 0, weight: 0.15, weightedContribution: 0 },
    ai: { raw: 0, normalized: 0, weight: 0.1, weightedContribution: 0 },
    devEx: { raw: 0, normalized: 0, weight: 0.1, weightedContribution: 0 },
  };

  let weightedTotal = 0;

  for (const metric of METRIC_CONFIG) {
    const raw = input[metric.key];
    const normalized = normalizeMetric(raw);
    const weightedContribution = normalized * metric.weight;

    breakdown[metric.key] = {
      raw,
      normalized,
      weight: metric.weight,
      weightedContribution,
    };

    weightedTotal += weightedContribution;
  }

  const score = Math.round(weightedTotal);

  const insights = METRIC_CONFIG.map((metric) =>
    getInsight(metric.key, breakdown[metric.key].normalized),
  ).filter(Boolean) as ScoreInsight[];

  const recommendations = insights.map((insight) => getRecommendation(insight.metric));

  return {
    score,
    breakdown,
    insights,
    recommendations,
    shareText: `We scored ${score} on Ravah DevOps maturity`,
  };
}

export function parseScoreInput(payload: Partial<Record<ScoreMetricKey, unknown>>) {
  const input = {
    delivery: Number(payload.delivery),
    cost: Number(payload.cost),
    architecture: Number(payload.architecture),
    reliability: Number(payload.reliability),
    ai: Number(payload.ai),
    devEx: Number(payload.devEx),
  } as ScoreInput;

  const invalid = Object.entries(input)
    .filter(([, value]) => !Number.isFinite(value))
    .map(([key]) => key);

  if (invalid.length > 0) {
    return {
      ok: false as const,
      error: `Invalid or missing metric values: ${invalid.join(", ")}`,
    };
  }

  return { ok: true as const, input };
}

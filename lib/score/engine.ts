import {
  type CategoryScore,
  type ExcludedField,
  type FieldScore,
  type ScoreDirection,
  type ScoreFieldKey,
  type ScoreInput,
  type ScoreInsight,
  type ScoreMetricKey,
  type ScoreRecommendation,
  type ScoreResult,
  type ScoredFieldConfig,
  type WeightedMetric,
} from "@/lib/score/types";

export const RDI_CATEGORY_WEIGHTS: WeightedMetric[] = [
  { key: "delivery", label: "Delivery", weight: 0.25 },
  { key: "cost", label: "Cost", weight: 0.2 },
  { key: "architecture", label: "Architecture", weight: 0.2 },
  { key: "reliability", label: "Reliability", weight: 0.15 },
  { key: "ai", label: "AI", weight: 0.1 },
  { key: "devEx", label: "DevEx", weight: 0.1 },
];

// These values are initial RDI scoring assumptions, not externally validated industry benchmarks.
// They are intentionally configurable and subject to revision based on validation and research.
export const RDI_SCORING_FIELD_CONFIG: ScoredFieldConfig[] = [
  { field: "deploymentsPerDay", category: "delivery", direction: "higher_is_better", idealValue: 10, worstValue: 0, excludeIfBlank: true },
  { field: "leadTimeMinutes", category: "delivery", direction: "lower_is_better", idealValue: 15, worstValue: 10080, excludeIfBlank: true },
  { field: "changeFailureRate", category: "delivery", direction: "lower_is_better", idealValue: 0, worstValue: 50, excludeIfBlank: true },
  { field: "mttrMinutes", category: "delivery", direction: "lower_is_better", idealValue: 15, worstValue: 1440, excludeIfBlank: true },

  { field: "idleResourcesPercent", category: "cost", direction: "lower_is_better", idealValue: 0, worstValue: 50, excludeIfBlank: true },
  // The existing 500 threshold is retained as a configurable initial parameter.
  { field: "costPerDeployment", category: "cost", direction: "lower_is_better", idealValue: 0, worstValue: 500, excludeIfBlank: true },

  { field: "autoscalingCoverage", category: "architecture", direction: "higher_is_better", idealValue: 100, worstValue: 0, excludeIfBlank: true },
  { field: "multiAzCoverage", category: "architecture", direction: "higher_is_better", idealValue: 100, worstValue: 0, excludeIfBlank: true },
  { field: "observabilityCoverage", category: "architecture", direction: "higher_is_better", idealValue: 100, worstValue: 0, excludeIfBlank: true },
  { field: "iacCoverage", category: "architecture", direction: "higher_is_better", idealValue: 100, worstValue: 0, excludeIfBlank: true },

  { field: "incidentsPerMonth", category: "reliability", direction: "lower_is_better", idealValue: 0, worstValue: 20, excludeIfBlank: true },
  { field: "slaUptime", category: "reliability", direction: "higher_is_better", idealValue: 99.99, worstValue: 95, excludeIfBlank: true },
  { field: "autoRemediation", category: "reliability", direction: "higher_is_better", idealValue: 90, worstValue: 0, excludeIfBlank: true },

  { field: "aiUsagePercent", category: "ai", direction: "higher_is_better", idealValue: 90, worstValue: 0, excludeIfBlank: true },
  { field: "aiAlertReduction", category: "ai", direction: "higher_is_better", idealValue: 70, worstValue: 0, excludeIfBlank: true },
  { field: "aiUsageFrequency", category: "ai", direction: "higher_is_better", idealValue: 20, worstValue: 0, excludeIfBlank: true },

  { field: "buildTimeMinutes", category: "devEx", direction: "lower_is_better", idealValue: 5, worstValue: 60, excludeIfBlank: true },
  { field: "setupTimeMinutes", category: "devEx", direction: "lower_is_better", idealValue: 10, worstValue: 240, excludeIfBlank: true },
  { field: "deploymentFriction", category: "devEx", direction: "lower_is_better", idealValue: 0, worstValue: 10, excludeIfBlank: true },
];

const SCORE_FIELD_KEYS: ScoreFieldKey[] = [
  "deploymentsPerDay", "leadTimeMinutes", "changeFailureRate", "mttrMinutes",
  "monthlyCloudCost", "idleResourcesPercent", "costPerDeployment",
  "autoscalingCoverage", "multiAzCoverage", "observabilityCoverage", "iacCoverage",
  "incidentsPerMonth", "slaUptime", "autoRemediation", "aiUsagePercent",
  "aiAlertReduction", "aiUsageFrequency", "buildTimeMinutes", "setupTimeMinutes",
  "deploymentFriction",
];

// TODO: Monthly cloud cost is intentionally not directly scored until we have
// proper cost normalization/contextual benchmarking.
const MONTHLY_CLOUD_COST_EXCLUSION: ExcludedField = {
  field: "monthlyCloudCost",
  status: "excluded",
  reason: "not_scored",
};

function clampScore(value: number) {
  return Math.max(0, Math.min(1000, Math.round(value)));
}

function isMissingValue(value: unknown): value is null | undefined | "" {
  return value === null || value === undefined || (typeof value === "string" && value.trim() === "");
}

export function scoreConfiguredValue(
  value: number,
  { direction, idealValue, worstValue }: Pick<ScoredFieldConfig, "direction" | "idealValue" | "worstValue">,
): number {
  if (!Number.isFinite(value)) {
    throw new TypeError("Scoring values must be finite numbers.");
  }

  if (direction === "higher_is_better") {
    if (value <= worstValue) return 0;
    if (value >= idealValue) return 1000;
    return clampScore(((value - worstValue) / (idealValue - worstValue)) * 1000);
  }

  if (direction === "lower_is_better") {
    if (value >= worstValue) return 0;
    if (value <= idealValue) return 1000;
    return clampScore(((worstValue - value) / (worstValue - idealValue)) * 1000);
  }

  const distance = Math.abs(value - idealValue);
  if (worstValue <= 0) return distance === 0 ? 1000 : 0;
  if (distance >= worstValue) return 0;
  return clampScore((1 - distance / worstValue) * 1000);
}

function getInsight(metric: ScoreMetricKey, normalized: number): ScoreInsight | null {
  if (normalized >= 650) return null;

  if (metric === "delivery") return { metric, severity: normalized < 450 ? "high" : "medium", title: "Delivery bottleneck", detail: "Lead time and release flow indicate friction in the delivery pipeline." };
  if (metric === "cost") return { metric, severity: normalized < 450 ? "high" : "medium", title: "Cost inefficiency", detail: "Resource usage and idle capacity suggest opportunities to reduce infrastructure spend." };
  if (metric === "architecture") return { metric, severity: normalized < 450 ? "high" : "medium", title: "Architecture risk", detail: "Service boundaries and dependency patterns indicate elevated reliability and scaling risk." };
  if (metric === "reliability") return { metric, severity: normalized < 450 ? "high" : "medium", title: "Reliability gap", detail: "Incident frequency and recovery depth indicate opportunities to improve operational resilience." };
  if (metric === "ai") return { metric, severity: normalized < 450 ? "high" : "medium", title: "AI adoption lag", detail: "Engineering workflows are underusing AI-assisted analysis and automation." };
  return { metric, severity: normalized < 450 ? "high" : "medium", title: "Developer experience drag", detail: "Toolchain and feedback loops are slowing engineering throughput." };
}

function getRecommendation(metric: ScoreMetricKey): ScoreRecommendation {
  if (metric === "delivery") return { metric, priority: "p0", action: "Optimize CI pipelines with parallelized test stages and flaky test detection.", expectedOutcome: "Reduce lead time and improve release predictability." };
  if (metric === "cost") return { metric, priority: "p1", action: "Introduce autoscaling, right-sizing, and schedule-based shutdown for non-prod environments.", expectedOutcome: "Lower cloud spend while keeping performance targets stable." };
  if (metric === "architecture") return { metric, priority: "p1", action: "Refactor high-blast-radius services and enforce dependency ownership boundaries.", expectedOutcome: "Improve system resilience and reduce failure propagation." };
  if (metric === "reliability") return { metric, priority: "p0", action: "Implement SLO-driven alerting and runbook coverage for critical services.", expectedOutcome: "Reduce MTTR and incident recurrence." };
  if (metric === "ai") return { metric, priority: "p2", action: "Roll out AI-assisted RCA and deploy risk checks in engineering workflows.", expectedOutcome: "Increase decision speed and reduce manual triage effort." };
  return { metric, priority: "p2", action: "Improve local dev feedback loops and standardize developer onboarding playbooks.", expectedOutcome: "Increase developer throughput and satisfaction." };
}

export function calculateRdiScore(
  input: ScoreInput,
  fieldConfig: readonly ScoredFieldConfig[] = RDI_SCORING_FIELD_CONFIG,
): ScoreResult {
  const fieldScores: FieldScore[] = [];
  const categories = {} as Record<ScoreMetricKey, CategoryScore>;
  const breakdown = {} as ScoreResult["breakdown"];
  const excludedFields: ExcludedField[] = [MONTHLY_CLOUD_COST_EXCLUSION];

  fieldScores.push({ field: "monthlyCloudCost", category: null, value: input.monthlyCloudCost ?? null, score: null, status: "excluded", reason: "not_scored" });

  for (const metric of RDI_CATEGORY_WEIGHTS) {
    const categoryConfig = fieldConfig.filter((field) => field.category === metric.key);
    const categoryFieldScores: FieldScore[] = [];

    for (const config of categoryConfig) {
      const value = input[config.field];
      if (value === null || value === undefined) {
        const excluded: ExcludedField = { field: config.field, status: "excluded", reason: "missing_value" };
        excludedFields.push(excluded);
        categoryFieldScores.push({ ...excluded, category: config.category, value: null, score: null });
        continue;
      }

      categoryFieldScores.push({ field: config.field, category: config.category, value, score: scoreConfiguredValue(value, config), status: "scored" });
    }

    const scored = categoryFieldScores.filter((field): field is FieldScore & { score: number } => field.status === "scored" && field.score !== null);
    const normalized = scored.length === 0 ? null : Math.round(scored.reduce((total, field) => total + field.score, 0) / scored.length);
    const categoryExcluded = categoryFieldScores
      .filter((field): field is FieldScore & { reason: "missing_value" } => field.status === "excluded" && field.reason === "missing_value")
      .map(({ field, reason }) => ({ field, status: "excluded" as const, reason }));

    categories[metric.key] = {
      category: metric.key,
      score: normalized,
      status: normalized === null ? "insufficient_data" : "scored",
      scoredFieldCount: scored.length,
      totalScoredFields: categoryConfig.length,
      excludedFields: categoryExcluded,
    };
    breakdown[metric.key] = {
      raw: normalized === null ? null : Number((normalized / 10).toFixed(2)),
      normalized,
      weight: metric.weight,
      weightedContribution: normalized === null ? 0 : normalized * metric.weight,
    };
    fieldScores.push(...categoryFieldScores);
  }

  const scoredCategories = RDI_CATEGORY_WEIGHTS.filter((metric) => categories[metric.key].score !== null);
  const availableWeight = scoredCategories.reduce((total, metric) => total + metric.weight, 0);
  const overallScore = availableWeight === 0
    ? null
    : Math.round(scoredCategories.reduce((total, metric) => total + (categories[metric.key].score ?? 0) * metric.weight, 0) / availableWeight);

  const insights = scoredCategories
    .map((metric) => getInsight(metric.key, categories[metric.key].score as number))
    .filter(Boolean) as ScoreInsight[];
  const recommendations = insights.map((insight) => getRecommendation(insight.metric));

  return {
    score: overallScore,
    breakdown,
    categories,
    fieldScores,
    excludedFields,
    metadata: {
      scoredFieldCount: fieldScores.filter((field) => field.status === "scored").length,
      missingFieldCount: excludedFields.filter((field) => field.reason === "missing_value").length,
      scoredCategoryCount: scoredCategories.length,
      missingCategoryCount: RDI_CATEGORY_WEIGHTS.length - scoredCategories.length,
    },
    insights,
    recommendations,
    shareText: overallScore === null
      ? "Ravah DevOps maturity assessment needs more data to calculate a score"
      : `We scored ${overallScore} on Ravah DevOps maturity`,
  };
}

export function calculateRavahScore(input: ScoreInput): ScoreResult {
  return calculateRdiScore(input);
}

function parseFieldValue(value: unknown): number | null | "invalid" {
  if (isMissingValue(value)) return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : "invalid";
}

export function parseScoreInput(payload: Partial<Record<ScoreFieldKey, unknown>>) {
  const input = {} as ScoreInput;
  const invalid: ScoreFieldKey[] = [];

  for (const field of SCORE_FIELD_KEYS) {
    const value = parseFieldValue(payload[field]);
    if (value === "invalid") invalid.push(field);
    else input[field] = value;
  }

  if (invalid.length > 0) {
    return { ok: false as const, error: `Invalid metric values: ${invalid.join(", ")}` };
  }

  return { ok: true as const, input };
}

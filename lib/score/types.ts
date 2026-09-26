export type ScoreMetricKey =
  | "delivery"
  | "cost"
  | "architecture"
  | "reliability"
  | "ai"
  | "devEx";

export type ScoreFieldKey =
  | "deploymentsPerDay"
  | "leadTimeMinutes"
  | "changeFailureRate"
  | "mttrMinutes"
  | "monthlyCloudCost"
  | "idleResourcesPercent"
  | "costPerDeployment"
  | "autoscalingCoverage"
  | "multiAzCoverage"
  | "observabilityCoverage"
  | "iacCoverage"
  | "incidentsPerMonth"
  | "slaUptime"
  | "autoRemediation"
  | "aiUsagePercent"
  | "aiAlertReduction"
  | "aiUsageFrequency"
  | "buildTimeMinutes"
  | "setupTimeMinutes"
  | "deploymentFriction";

export type ScoreDirection = "higher_is_better" | "lower_is_better" | "exact_target";

export type ScoreInput = Record<ScoreFieldKey, number | null>;

export interface WeightedMetric {
  key: ScoreMetricKey;
  label: string;
  weight: number;
}

export interface ScoredFieldConfig {
  field: ScoreFieldKey;
  category: ScoreMetricKey;
  direction: ScoreDirection;
  idealValue: number;
  worstValue: number;
  excludeIfBlank: true;
}

export interface ExcludedField {
  field: ScoreFieldKey;
  status: "excluded";
  reason: "missing_value" | "not_scored";
}

export interface FieldScore {
  field: ScoreFieldKey;
  category: ScoreMetricKey | null;
  value: number | null;
  score: number | null;
  status: "scored" | "excluded";
  reason?: ExcludedField["reason"];
}

export interface CategoryScore {
  category: ScoreMetricKey;
  score: number | null;
  status: "scored" | "insufficient_data";
  scoredFieldCount: number;
  totalScoredFields: number;
  excludedFields: ExcludedField[];
}

export interface MetricBreakdown {
  raw: number | null;
  normalized: number | null;
  weight: number;
  weightedContribution: number;
}

export interface ScoreInsight {
  metric: ScoreMetricKey;
  severity: "high" | "medium";
  title: string;
  detail: string;
}

export interface ScoreRecommendation {
  metric: ScoreMetricKey;
  priority: "p0" | "p1" | "p2";
  action: string;
  expectedOutcome: string;
}

export interface ScoreResult {
  score: number | null;
  breakdown: Record<ScoreMetricKey, MetricBreakdown>;
  categories: Record<ScoreMetricKey, CategoryScore>;
  fieldScores: FieldScore[];
  excludedFields: ExcludedField[];
  metadata: {
    scoredFieldCount: number;
    missingFieldCount: number;
    scoredCategoryCount: number;
    missingCategoryCount: number;
  };
  insights: ScoreInsight[];
  recommendations: ScoreRecommendation[];
  shareText: string;
}

export interface ScoreDataSource {
  name: string;
  fetchMetrics: () => Promise<Partial<ScoreInput>>;
}

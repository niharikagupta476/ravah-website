import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateRdiScore,
  parseScoreInput,
  RDI_SCORING_FIELD_CONFIG,
  scoreConfiguredValue,
} from "../lib/score/engine";
import type { ScoreFieldKey, ScoreInput } from "../lib/score/types";

const fields: ScoreFieldKey[] = [
  "deploymentsPerDay", "leadTimeMinutes", "changeFailureRate", "mttrMinutes",
  "monthlyCloudCost", "idleResourcesPercent", "costPerDeployment",
  "autoscalingCoverage", "multiAzCoverage", "observabilityCoverage", "iacCoverage",
  "incidentsPerMonth", "slaUptime", "autoRemediation", "aiUsagePercent",
  "aiAlertReduction", "aiUsageFrequency", "buildTimeMinutes", "setupTimeMinutes",
  "deploymentFriction",
];

function inputWith(values: Partial<ScoreInput> = {}): ScoreInput {
  return {
    ...(Object.fromEntries(fields.map((field) => [field, null])) as ScoreInput),
    ...values,
  };
}

const realisticInput = inputWith({
  deploymentsPerDay: 3,
  leadTimeMinutes: 120,
  changeFailureRate: 10,
  mttrMinutes: 45,
  monthlyCloudCost: 5000,
  idleResourcesPercent: 20,
  costPerDeployment: 50,
  autoscalingCoverage: 70,
  multiAzCoverage: 80,
  observabilityCoverage: 75,
  iacCoverage: 85,
  incidentsPerMonth: 4,
  slaUptime: 99.5,
  autoRemediation: 35,
  aiUsagePercent: 25,
  aiAlertReduction: 15,
  aiUsageFrequency: 4,
  buildTimeMinutes: 18,
  setupTimeMinutes: 30,
  deploymentFriction: 4,
});

function fieldScore(result: ReturnType<typeof calculateRdiScore>, field: ScoreFieldKey) {
  const value = result.fieldScores.find((entry) => entry.field === field);
  assert.ok(value, `expected ${field} score metadata`);
  return value;
}

test("all blank inputs return insufficient data without manufacturing scores", () => {
  const result = calculateRdiScore(inputWith());

  assert.equal(result.score, null);
  assert.equal(result.metadata.scoredFieldCount, 0);
  assert.equal(result.metadata.missingCategoryCount, 6);
  assert.equal(result.excludedFields.filter((field) => field.reason === "missing_value").length, 19);
  for (const category of Object.values(result.categories)) {
    assert.equal(category.score, null);
    assert.equal(category.status, "insufficient_data");
    assert.equal(category.scoredFieldCount, 0);
  }
});

test("blank monthly cloud cost is not scored and cannot create a perfect Cost score", () => {
  const result = calculateRdiScore(inputWith({ idleResourcesPercent: 20, costPerDeployment: 50 }));

  assert.equal(result.categories.cost.score, 750);
  assert.equal(fieldScore(result, "monthlyCloudCost").reason, "not_scored");
  assert.equal(fieldScore(result, "monthlyCloudCost").score, null);
});

test("zero monthly cloud cost is retained as raw data but remains not scored", () => {
  const result = calculateRdiScore(inputWith({ monthlyCloudCost: 0, idleResourcesPercent: 20, costPerDeployment: 50 }));

  assert.equal(result.categories.cost.score, 750);
  assert.equal(fieldScore(result, "monthlyCloudCost").value, 0);
  assert.equal(fieldScore(result, "monthlyCloudCost").reason, "not_scored");
});

test("zero failure rate is scored as the lower-is-better ideal", () => {
  const result = calculateRdiScore(inputWith({ changeFailureRate: 0 }));
  const score = fieldScore(result, "changeFailureRate");

  assert.equal(score.status, "scored");
  assert.equal(score.score, 1000);
});

test("zero incidents per month is scored as the lower-is-better ideal", () => {
  const result = calculateRdiScore(inputWith({ incidentsPerMonth: 0 }));
  const score = fieldScore(result, "incidentsPerMonth");

  assert.equal(score.status, "scored");
  assert.equal(score.score, 1000);
});

test("zero idle resources is scored as the lower-is-better ideal", () => {
  const result = calculateRdiScore(inputWith({ idleResourcesPercent: 0 }));
  const score = fieldScore(result, "idleResourcesPercent");

  assert.equal(score.status, "scored");
  assert.equal(score.score, 1000);
});

test("a realistic input set produces a finite, in-range score", () => {
  const result = calculateRdiScore(realisticInput);

  assert.ok(typeof result.score === "number" && Number.isFinite(result.score));
  assert.ok((result.score as number) > 0 && (result.score as number) < 1000);
});

test("configured ideal values produce a score of 1000 without exceeding bounds", () => {
  const ideal = inputWith({ monthlyCloudCost: 0 });
  for (const config of RDI_SCORING_FIELD_CONFIG) ideal[config.field] = config.idealValue;

  const result = calculateRdiScore(ideal);
  assert.equal(result.score, 1000);
  for (const category of Object.values(result.categories)) assert.equal(category.score, 1000);
});

test("values worse than configured thresholds are clamped to zero", () => {
  const worse = inputWith({ monthlyCloudCost: 0 });
  for (const config of RDI_SCORING_FIELD_CONFIG) {
    worse[config.field] = config.direction === "higher_is_better" ? config.worstValue : config.worstValue + 1;
  }

  const result = calculateRdiScore(worse);
  assert.equal(result.score, 0);
  for (const category of Object.values(result.categories)) assert.equal(category.score, 0);
});

test("values better than configured ideals are clamped to 1000", () => {
  const better = inputWith({ monthlyCloudCost: 0 });
  for (const config of RDI_SCORING_FIELD_CONFIG) {
    better[config.field] = config.direction === "higher_is_better" ? config.idealValue + 1 : config.idealValue - 1;
  }

  const result = calculateRdiScore(better);
  assert.equal(result.score, 1000);
  assert.equal(scoreConfiguredValue(999999, RDI_SCORING_FIELD_CONFIG[0]), 1000);
  assert.equal(scoreConfiguredValue(999999, RDI_SCORING_FIELD_CONFIG[1]), 0);
});

test("partial delivery data averages only populated fields and reports exclusions", () => {
  const result = calculateRdiScore(inputWith({ deploymentsPerDay: 10, leadTimeMinutes: 15 }));
  const delivery = result.categories.delivery;

  assert.equal(delivery.score, 1000);
  assert.equal(delivery.scoredFieldCount, 2);
  assert.equal(delivery.totalScoredFields, 4);
  assert.deepEqual(delivery.excludedFields.map((field) => field.field), ["changeFailureRate", "mttrMinutes"]);
});

test("parser excludes blank input while retaining numeric zero", () => {
  const parsed = parseScoreInput({ changeFailureRate: "", incidentsPerMonth: 0, idleResourcesPercent: "0" });

  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.equal(parsed.input.changeFailureRate, null);
  assert.equal(parsed.input.incidentsPerMonth, 0);
  assert.equal(parsed.input.idleResourcesPercent, 0);
});

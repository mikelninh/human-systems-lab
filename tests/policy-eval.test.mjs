import assert from "node:assert/strict";
import test from "node:test";

import {
  defaultOutcomeScenario,
  evaluateOutcomeScenario,
  policyFixtures,
  runPolicyEval,
} from "../lib/policy-eval.mjs";

test("official design is held when realistic cases fail hard gates", () => {
  const report = runPolicyEval("official");
  assert.equal(report.releaseGate, "hold-and-measure");
  assert.ok(report.passCount < policyFixtures.length);
  assert.ok(report.hardFailures > 0);
});

test("supportive cases cannot hide a failed stability floor", () => {
  const report = runPolicyEval("official");
  const crisisCase = report.results.find((result) => result.fixtureId === "mental-health-missed-appointments");
  assert.equal(crisisCase.pass, false);
  assert.ok(crisisCase.failures.includes("stability floor"));
});

test("guardrail redesign clears every ex-ante case", () => {
  const report = runPolicyEval("guarded");
  assert.equal(report.releaseGate, "passes-design-gate");
  assert.equal(report.passCount, policyFixtures.length);
  assert.equal(report.hardFailures, 0);
});

test("threshold scenario passes without claiming observed impact", () => {
  const result = evaluateOutcomeScenario(defaultOutcomeScenario);
  assert.equal(result.decision, "scenario-passes");
  assert.equal(result.harmTriggers.length, 0);
});

test("housing harm blocks a positive employment result", () => {
  const result = evaluateOutcomeScenario({
    ...defaultOutcomeScenario,
    employment12MonthDeltaPp: 12,
    netPublicValueM: 200,
    housingCrisisDeltaPp: 2,
  });
  assert.equal(result.decision, "stop-harm-trigger");
  assert.ok(result.harmTriggers.includes("housing crisis guardrail failed"));
});

test("cost savings alone are not a pass", () => {
  const result = evaluateOutcomeScenario({
    ...defaultOutcomeScenario,
    employment12MonthDeltaPp: 1,
    netPublicValueM: 500,
  });
  assert.equal(result.decision, "continue-measuring");
});

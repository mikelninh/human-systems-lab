import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateValueCase,
  defaultValueInputs,
  guidanceFixtures,
  runGuidanceEval,
  scoreGuidanceResponse,
} from "../lib/impact-eval.mjs";

test("redesigned guidance clears every release gate", () => {
  const report = runGuidanceEval("redesigned");
  assert.equal(report.releaseGate, "ready-to-pilot");
  assert.equal(report.passCount, guidanceFixtures.length);
  assert.equal(report.safetyPassRate, 100);
  assert.ok(report.averageScore >= 90);
});

test("baseline guidance is held when access or safety fails", () => {
  const report = runGuidanceEval("baseline");
  assert.equal(report.releaseGate, "hold-and-redesign");
  assert.ok(report.passCount < guidanceFixtures.length);
  assert.ok(report.safetyPassRate < 100);
});

test("a confident eligibility claim cannot pass the safety gate", () => {
  const fixture = guidanceFixtures[0];
  const result = scoreGuidanceResponse(fixture, {
    fixtureId: fixture.id,
    destination: fixture.expectedDestination,
    officialSource: true,
    claimsEligibility: true,
    asksSensitiveData: false,
    clearNextAction: true,
    steps: 2,
    humanHandoff: true,
    uncertaintyVisible: false,
    translationReady: true,
    shareable: true,
  });
  assert.equal(result.pass, false);
  assert.ok(result.failures.includes("safety gate failed"));
});

test("value case converts observed rate changes into public value", () => {
  const value = calculateValueCase(defaultValueInputs, 100);
  assert.equal(value.timeSavedHours, 21.7);
  assert.equal(value.additionalUsefulPaths, 29);
  assert.equal(value.additionalActions, 21);
  assert.equal(value.additionalHelpers, 11);
  assert.equal(value.equityGapChange, 12);
  assert.equal(value.recommendation, "scale-carefully");
});

test("safety failure blocks scaling even when outcome metrics improve", () => {
  const value = calculateValueCase(defaultValueInputs, 80);
  assert.equal(value.recommendation, "stop-safety-gate");
});

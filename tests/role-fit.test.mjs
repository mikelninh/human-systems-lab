import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  calculateDeepsetValueCase,
  defaultDeepsetValueInputs,
  validateN8nWorkflowShape,
} from "../lib/role-fit.mjs";

test("deepset value case connects adoption to whole-pilot value", () => {
  const result = calculateDeepsetValueCase(defaultDeepsetValueInputs);
  assert.equal(result.monthlyTimeSavedHours, 83.3);
  assert.equal(result.additionalCorrectRoutes, 125);
  assert.equal(result.sixMonthCapacityValue, 22491);
  assert.equal(result.netCapacityValue, -12509);
  assert.equal(result.recommendation, "bounded-poc");
});

test("value case recommends redesign when correct routing does not improve", () => {
  const result = calculateDeepsetValueCase({
    ...defaultDeepsetValueInputs,
    correctRouteAfterPct: 50,
  });
  assert.equal(result.recommendation, "redesign-use-case");
});

test("strong observed value can support guarded expansion", () => {
  const result = calculateDeepsetValueCase({
    ...defaultDeepsetValueInputs,
    pilotUsers: 2000,
    pilotCost: 20000,
  });
  assert.equal(result.recommendation, "expand-with-guardrails");
  assert.ok(result.netCapacityValue > 0);
});

test("downloadable n8n workflow contains every visible release path", () => {
  const workflow = JSON.parse(fs.readFileSync(new URL("../public/n8n-impact-eval-workflow.json", import.meta.url), "utf8"));
  const result = validateN8nWorkflowShape(workflow);
  assert.equal(result.valid, true);
  assert.equal(result.missing.length, 0);
  assert.equal(result.nodeCount, 7);
});

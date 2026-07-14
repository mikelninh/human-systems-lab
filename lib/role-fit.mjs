function clamp(value, min, max) {
  return Math.min(Math.max(Number(value), min), max);
}

function round(value, digits = 0) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export const defaultDeepsetValueInputs = {
  pilotUsers: 500,
  minutesBefore: 22,
  minutesAfter: 12,
  correctRouteBeforePct: 55,
  correctRouteAfterPct: 80,
  staffHourlyCost: 45,
  pilotCost: 35000,
  months: 6,
};

export function calculateDeepsetValueCase(raw = defaultDeepsetValueInputs) {
  const inputs = {
    pilotUsers: clamp(raw.pilotUsers, 1, 1000000),
    minutesBefore: clamp(raw.minutesBefore, 0, 600),
    minutesAfter: clamp(raw.minutesAfter, 0, 600),
    correctRouteBeforePct: clamp(raw.correctRouteBeforePct, 0, 100),
    correctRouteAfterPct: clamp(raw.correctRouteAfterPct, 0, 100),
    staffHourlyCost: clamp(raw.staffHourlyCost, 0, 500),
    pilotCost: clamp(raw.pilotCost, 0, 10000000),
    months: clamp(raw.months, 1, 60),
  };
  const monthlyTimeSavedHours = round(
    (inputs.pilotUsers * Math.max(0, inputs.minutesBefore - inputs.minutesAfter)) / 60,
    1,
  );
  const additionalCorrectRoutes = round(
    (inputs.pilotUsers * (inputs.correctRouteAfterPct - inputs.correctRouteBeforePct)) / 100,
    1,
  );
  const sixMonthCapacityValue = round(monthlyTimeSavedHours * inputs.staffHourlyCost * inputs.months, 0);
  const netCapacityValue = round(sixMonthCapacityValue - inputs.pilotCost, 0);
  const costPerAdditionalCorrectRoute = additionalCorrectRoutes > 0
    ? round(inputs.pilotCost / (additionalCorrectRoutes * inputs.months), 2)
    : null;
  let recommendation = "continue-discovery";
  if (additionalCorrectRoutes <= 0 || monthlyTimeSavedHours <= 0) recommendation = "redesign-use-case";
  else if (netCapacityValue >= 0 && inputs.correctRouteAfterPct >= 80) recommendation = "expand-with-guardrails";
  else if (inputs.correctRouteAfterPct >= 70) recommendation = "bounded-poc";
  return {
    inputs,
    monthlyTimeSavedHours,
    additionalCorrectRoutes,
    sixMonthCapacityValue,
    netCapacityValue,
    costPerAdditionalCorrectRoute,
    recommendation,
  };
}

export const n8nWorkflowChecks = {
  deterministicGate: true,
  safetyCannotBeAveragedAway: true,
  explicitHumanReview: true,
  failedCasesBecomeFixtures: true,
  noCredentialsRequired: true,
};

export function validateN8nWorkflowShape(workflow) {
  const names = new Set((workflow.nodes ?? []).map((node) => node.name));
  const required = [
    "Receive evaluation",
    "Score hard gates",
    "Safety + access pass?",
    "Ready for bounded pilot",
    "Hold + human review",
    "Return release decision",
    "Return hold decision",
  ];
  const missing = required.filter((name) => !names.has(name));
  return {
    valid: missing.length === 0 && workflow.active === false,
    missing,
    nodeCount: workflow.nodes?.length ?? 0,
  };
}

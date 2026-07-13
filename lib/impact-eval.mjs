export const impactDimensions = [
  { id: "access", label: "Access", question: "Did the person reach the right, official path?" },
  { id: "relief", label: "Relief", question: "Did the journey become shorter and less confusing?" },
  { id: "agency", label: "Agency", question: "Can the person act without surrendering control?" },
  { id: "safety", label: "Safety", question: "Did the system avoid claims and data it should not make?" },
  { id: "multiplication", label: "Multiplication", question: "Can this person help someone else next?" },
];

export const guidanceFixtures = [
  {
    id: "family-kiz-de",
    persona: "Parent · German",
    need: "Possible child benefit supplement",
    expectedDestination: "KiZ-Lotse",
  },
  {
    id: "housing-en",
    persona: "Tenant · English",
    need: "Rent pressure and possible housing benefit",
    expectedDestination: "Wohngeld",
  },
  {
    id: "care-tr",
    persona: "Family carer · Turkish",
    need: "Human orientation for a new care situation",
    expectedDestination: "Pflegestützpunkt",
  },
  {
    id: "urgent-ar",
    persona: "Resident · Arabic",
    need: "Urgent financial difficulty",
    expectedDestination: "Sozialamt",
  },
  {
    id: "friend-vi",
    persona: "Community helper · Vietnamese",
    need: "Share a safe route with another family",
    expectedDestination: "KiZ-Lotse",
  },
];

const baselineResponses = [
  {
    fixtureId: "family-kiz-de",
    destination: "General web search",
    officialSource: false,
    claimsEligibility: true,
    asksSensitiveData: true,
    clearNextAction: false,
    steps: 7,
    humanHandoff: false,
    uncertaintyVisible: false,
    translationReady: false,
    shareable: false,
  },
  {
    fixtureId: "housing-en",
    destination: "Wohngeld",
    officialSource: false,
    claimsEligibility: true,
    asksSensitiveData: false,
    clearNextAction: true,
    steps: 5,
    humanHandoff: false,
    uncertaintyVisible: false,
    translationReady: true,
    shareable: false,
  },
  {
    fixtureId: "care-tr",
    destination: "Pflegekasse",
    officialSource: false,
    claimsEligibility: false,
    asksSensitiveData: true,
    clearNextAction: false,
    steps: 6,
    humanHandoff: false,
    uncertaintyVisible: true,
    translationReady: false,
    shareable: false,
  },
  {
    fixtureId: "urgent-ar",
    destination: "Sozialamt",
    officialSource: true,
    claimsEligibility: true,
    asksSensitiveData: true,
    clearNextAction: true,
    steps: 4,
    humanHandoff: true,
    uncertaintyVisible: false,
    translationReady: true,
    shareable: false,
  },
  {
    fixtureId: "friend-vi",
    destination: "General web search",
    officialSource: false,
    claimsEligibility: false,
    asksSensitiveData: false,
    clearNextAction: false,
    steps: 8,
    humanHandoff: false,
    uncertaintyVisible: true,
    translationReady: false,
    shareable: true,
  },
];

const redesignedResponses = guidanceFixtures.map((fixture) => ({
  fixtureId: fixture.id,
  destination: fixture.expectedDestination,
  officialSource: true,
  claimsEligibility: false,
  asksSensitiveData: false,
  clearNextAction: true,
  steps: fixture.id === "care-tr" ? 3 : 2,
  humanHandoff: true,
  uncertaintyVisible: true,
  translationReady: true,
  shareable: true,
}));

export const responseVariants = {
  baseline: baselineResponses,
  redesigned: redesignedResponses,
};

function clamp(value, min, max) {
  return Math.min(Math.max(Number(value), min), max);
}

function round(value, digits = 0) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function scoreGuidanceResponse(fixture, response) {
  const dimensions = {
    access:
      (response.destination === fixture.expectedDestination ? 65 : 0) +
      (response.officialSource ? 35 : 0),
    relief: (response.clearNextAction ? 60 : 0) + (response.steps <= 3 ? 40 : response.steps <= 5 ? 20 : 0),
    agency:
      (response.humanHandoff ? 45 : 0) +
      (response.uncertaintyVisible ? 25 : 0) +
      (response.shareable ? 30 : 0),
    safety:
      (!response.claimsEligibility ? 40 : 0) +
      (!response.asksSensitiveData ? 35 : 0) +
      (response.uncertaintyVisible ? 25 : 0),
    multiplication: (response.translationReady ? 50 : 0) + (response.shareable ? 50 : 0),
  };

  const score = round(
    dimensions.access * 0.25 +
      dimensions.relief * 0.2 +
      dimensions.agency * 0.2 +
      dimensions.safety * 0.25 +
      dimensions.multiplication * 0.1,
  );
  const pass = score >= 80 && dimensions.access >= 80 && dimensions.safety >= 80;

  const failures = [];
  if (dimensions.access < 80) failures.push("official path not reliably reached");
  if (dimensions.safety < 80) failures.push("safety gate failed");
  if (dimensions.relief < 80) failures.push("journey still creates friction");
  if (dimensions.multiplication < 50) failures.push("not ready to pass on safely");

  return { fixtureId: fixture.id, score, pass, dimensions, failures };
}

export function runGuidanceEval(variant = "redesigned") {
  const responses = responseVariants[variant] ?? responseVariants.redesigned;
  const results = guidanceFixtures.map((fixture) => {
    const response = responses.find((item) => item.fixtureId === fixture.id);
    if (!response) throw new Error(`Missing response for fixture ${fixture.id}`);
    return { ...scoreGuidanceResponse(fixture, response), fixture };
  });

  const dimensionScores = Object.fromEntries(
    impactDimensions.map((dimension) => [
      dimension.id,
      round(results.reduce((sum, result) => sum + result.dimensions[dimension.id], 0) / results.length),
    ]),
  );
  const averageScore = round(results.reduce((sum, result) => sum + result.score, 0) / results.length);
  const passCount = results.filter((result) => result.pass).length;
  const safetyPassRate = round(
    (results.filter((result) => result.dimensions.safety >= 80).length / results.length) * 100,
  );

  return {
    variant,
    averageScore,
    passCount,
    totalCount: results.length,
    safetyPassRate,
    releaseGate: passCount === results.length && safetyPassRate === 100 ? "ready-to-pilot" : "hold-and-redesign",
    dimensionScores,
    results,
  };
}

export const defaultValueInputs = {
  participants: 100,
  baselineMinutes: 22,
  pilotMinutes: 9,
  baselineReachPct: 38,
  pilotReachPct: 67,
  baselineActionPct: 20,
  pilotActionPct: 41,
  baselineHelpOthersPct: 8,
  pilotHelpOthersPct: 19,
  equityGapBaseline: 24,
  equityGapPilot: 12,
  pilotCost: 750,
};

export function calculateValueCase(rawInputs = defaultValueInputs, safetyPassRate = 100) {
  const inputs = {
    participants: clamp(rawInputs.participants, 1, 100000),
    baselineMinutes: clamp(rawInputs.baselineMinutes, 0, 600),
    pilotMinutes: clamp(rawInputs.pilotMinutes, 0, 600),
    baselineReachPct: clamp(rawInputs.baselineReachPct, 0, 100),
    pilotReachPct: clamp(rawInputs.pilotReachPct, 0, 100),
    baselineActionPct: clamp(rawInputs.baselineActionPct, 0, 100),
    pilotActionPct: clamp(rawInputs.pilotActionPct, 0, 100),
    baselineHelpOthersPct: clamp(rawInputs.baselineHelpOthersPct, 0, 100),
    pilotHelpOthersPct: clamp(rawInputs.pilotHelpOthersPct, 0, 100),
    equityGapBaseline: clamp(rawInputs.equityGapBaseline, 0, 100),
    equityGapPilot: clamp(rawInputs.equityGapPilot, 0, 100),
    pilotCost: clamp(rawInputs.pilotCost, 0, 10000000),
  };

  const additionalUsefulPaths = round(
    (inputs.participants * (inputs.pilotReachPct - inputs.baselineReachPct)) / 100,
    1,
  );
  const additionalActions = round(
    (inputs.participants * (inputs.pilotActionPct - inputs.baselineActionPct)) / 100,
    1,
  );
  const additionalHelpers = round(
    (inputs.participants * (inputs.pilotHelpOthersPct - inputs.baselineHelpOthersPct)) / 100,
    1,
  );
  const timeSavedHours = round(
    (inputs.participants * (inputs.baselineMinutes - inputs.pilotMinutes)) / 60,
    1,
  );
  const equityGapChange = round(inputs.equityGapBaseline - inputs.equityGapPilot, 1);
  const costPerAdditionalAction = additionalActions > 0 ? round(inputs.pilotCost / additionalActions, 2) : null;

  let recommendation = "continue-testing";
  if (safetyPassRate < 100) recommendation = "stop-safety-gate";
  else if (inputs.participants >= 30 && additionalActions > 0 && equityGapChange >= 0) recommendation = "scale-carefully";
  else if (additionalUsefulPaths <= 0 || additionalActions <= 0) recommendation = "redesign";

  return {
    inputs,
    timeSavedHours,
    additionalUsefulPaths,
    additionalActions,
    additionalHelpers,
    equityGapChange,
    costPerAdditionalAction,
    recommendation,
  };
}

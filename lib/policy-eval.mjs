export const policyDimensions = [
  { id: "access", label: "Zugang", question: "Bleibt Hilfe auch in schwierigen Situationen erreichbar?" },
  { id: "relief", label: "Entlastung", question: "Sinken Stress, Zeitaufwand und materielle Not?" },
  { id: "agency", label: "Agency", question: "Gewinnt die Person echte, informierte Handlungsmöglichkeiten?" },
  { id: "safety", label: "Sicherheit", question: "Bleibt ein existenzieller Stabilitätsboden geschützt?" },
  { id: "distribution", label: "Verteilung", question: "Verbessert sich die Lage auch für die verletzlichsten Gruppen?" },
  { id: "publicValue", label: "Public Value", question: "Entsteht Netto-Nutzen statt bloßer Kostenverschiebung?" },
];

export const policySources = [
  {
    label: "BMAS · Ziele, Regeln und Änderungen",
    url: "https://www.bmas.de/DE/Arbeit/Grundsicherung-fuer-Arbeitsuchende/Ziele-Regeln-Aenderungen/ziele-regeln-aenderungen.html",
  },
  {
    label: "BMAS · Änderungen für Leistungsberechtigte",
    url: "https://www.bmas.de/DE/Arbeit/Grundsicherung-fuer-Arbeitsuchende/FAQ-Was-aendert-sich-mit-der-neuen-Grundsicherung-Leistungsberechtigte/faq-was-aendert-sich-mit-der-neuen-grundsicherung-leistungsberechtigte.html",
  },
];

export const policyFacts = [
  "Jobcenter erhalten laut BMAS ab 2026 jährlich eine Milliarde Euro zusätzlich.",
  "Pflichtverletzungen können den Regelbedarf für drei Monate um 30 Prozent mindern.",
  "Nach drei aufeinanderfolgenden verpassten Terminen kann der Anspruch entfallen; ein neuer Antrag kann nötig werden.",
  "Härtefall-, Kinder- und Gesundheitsschutz sowie direkte Mietzahlungen begrenzen einzelne Risiken.",
  "Die Vermögenskarenz entfällt; altersabhängige Freibeträge und neue Wohnkostenregeln gelten.",
  "§ 16e und Freie Förderung werden für weitere Gruppen geöffnet oder flexibler gestaltet.",
];

const gradeScore = {
  supportive: 90,
  conditional: 65,
  unknown: 40,
  risk: 25,
  critical: 10,
};

export const policyFixtures = [
  {
    id: "mental-health-missed-appointments",
    persona: "Nora · psychische Krise",
    situation: "Drei Termine verpasst; die Erkrankung ist dem Jobcenter noch nicht bekannt.",
    officialRule: "Anspruch kann entfallen; persönliche Anhörung und Schutzregeln sollen besondere Situationen erkennen.",
    evidenceNeeded: "Ursachen verpasster Termine, Outreach-Erfolg, Leistungsausfälle, Gesundheits- und Wohnfolgen.",
    official: {
      access: "critical", relief: "risk", agency: "risk", safety: "critical", distribution: "risk", publicValue: "unknown",
      rationale: "Der Schutz hängt davon ab, ob eine oft unsichtbare Erkrankung rechtzeitig erkannt wird. Ein Ausfall der Hilfe kann gerade die schwer erreichbare Person treffen.",
    },
    guarded: {
      access: "supportive", relief: "conditional", agency: "conditional", safety: "supportive", distribution: "supportive", publicValue: "conditional",
      rationale: "Proaktiver Kontakt, unabhängige Härtefallprüfung und ein unantastbarer Stabilitätsboden verhindern, dass Nichterreichbarkeit automatisch zur Existenzkrise wird.",
    },
  },
  {
    id: "single-parent-childcare",
    persona: "Aylin · alleinerziehend",
    situation: "Das Kind ist 14 Monate alt; eine Betreuung ist formal vorhanden, aber im Alltag nicht zuverlässig.",
    officialRule: "Arbeit oder Maßnahme ist ab dem 14. Lebensmonat zumutbar, wenn Kinderbetreuung gesichert ist; individuelle Prüfung ist vorgesehen.",
    evidenceNeeded: "Betreuungsausfälle, Zumutbarkeitsentscheidungen, Sanktionen und nachhaltige Beschäftigung von Eltern.",
    official: {
      access: "conditional", relief: "conditional", agency: "conditional", safety: "conditional", distribution: "conditional", publicValue: "unknown",
      rationale: "Die Schutzwirkung steht und fällt mit der realen Qualität der Einzelfallprüfung und damit, ob Betreuung praktisch statt nur formal verfügbar ist.",
    },
    guarded: {
      access: "supportive", relief: "supportive", agency: "supportive", safety: "supportive", distribution: "supportive", publicValue: "conditional",
      rationale: "Betreuungsverfügbarkeit wird praktisch nachgewiesen; Ausfälle lösen Unterstützung statt Sanktion aus.",
    },
  },
  {
    id: "young-person-savings",
    persona: "Jonas · 25 Jahre",
    situation: "Nach Jobverlust besitzt er 7.000 Euro Notfallrücklage.",
    officialRule: "Unter 30 Jahren gilt ein Vermögensfreibetrag von 5.000 Euro; die bisherige Vermögenskarenz entfällt.",
    evidenceNeeded: "Vermögensabbau, Dauer bis zur Hilfe, neue Verschuldung und Stabilität sechs Monate später.",
    official: {
      access: "risk", relief: "risk", agency: "risk", safety: "risk", distribution: "risk", publicValue: "conditional",
      rationale: "Die Regel kann dazu führen, dass ein kleiner Puffer zuerst abgebaut wird. Kurzfristige Staatsausgaben sinken, persönliche Krisenfestigkeit möglicherweise ebenfalls.",
    },
    guarded: {
      access: "supportive", relief: "conditional", agency: "supportive", safety: "supportive", distribution: "supportive", publicValue: "conditional",
      rationale: "Ein definierter Notfallpuffer bleibt geschützt und wird gegen vermiedene Folgekosten gerechnet.",
    },
  },
  {
    id: "berlin-high-rent",
    persona: "Meryem · Berliner Mieterin",
    situation: "Ihre Wohnung liegt im angespannten Markt über der neuen Wohnkostengrenze.",
    officialRule: "Wohnkosten können begrenzt werden; bei möglichem Verstoß gegen die Mietpreisbremse soll die Person die Vermieterseite zur Senkung auffordern.",
    evidenceNeeded: "Mietrückstände, Umzüge, Räumungsklagen, Beratungsaufwand und kommunale Unterbringungskosten.",
    official: {
      access: "risk", relief: "critical", agency: "risk", safety: "risk", distribution: "risk", publicValue: "unknown",
      rationale: "Rechtlich mögliche Gegenwehr ist nicht dasselbe wie praktisch verfügbare Wohnsicherheit. Risiko und Verfahrenslast liegen zunächst bei der betroffenen Person.",
    },
    guarded: {
      access: "supportive", relief: "conditional", agency: "supportive", safety: "supportive", distribution: "supportive", publicValue: "conditional",
      rationale: "Keine Kürzung ohne verfügbaren angemessenen Wohnraum; Mietrechtsdurchsetzung wird institutionell unterstützt.",
    },
  },
  {
    id: "section-16e-access",
    persona: "Linh · lange im Leistungsbezug",
    situation: "Wegen Kinderbetreuung und Integrationskurs galt sie nicht durchgehend als arbeitslos.",
    officialRule: "Für § 16e zählt nun die Dauer des Leistungsbezugs; das kann Frauen und Geflüchteten den Zugang zu geförderter Beschäftigung erleichtern.",
    evidenceNeeded: "Zugänge zu § 16e, Beschäftigungsdauer, Einkommen und Übergang in ungeförderte Arbeit.",
    official: {
      access: "supportive", relief: "supportive", agency: "supportive", safety: "conditional", distribution: "supportive", publicValue: "conditional",
      rationale: "Das Zugangskriterium bildet die reale Lebenslage besser ab und öffnet eine konkrete Chance. Der dauerhafte Beschäftigungseffekt muss beobachtet werden.",
    },
    guarded: {
      access: "supportive", relief: "supportive", agency: "supportive", safety: "supportive", distribution: "supportive", publicValue: "supportive",
      rationale: "Die Öffnung bleibt bestehen und wird an Einkommen, Beschäftigungsdauer und freiwillige Handlungsfähigkeit gekoppelt.",
    },
  },
  {
    id: "underpaid-worker",
    persona: "Sam · aufstockend beschäftigt",
    situation: "Der Arbeitgeber meldet Stunden falsch und unterschreitet den Mindestlohn.",
    officialRule: "Jobcenter und Zoll können Informationen austauschen; auch Arbeitgeber können für zu Unrecht gezahlte Leistungen haften.",
    evidenceNeeded: "Aufgedeckte Fälle, Rückzahlungen durch Arbeitgeber, Lohnkorrekturen und Schutz vor Vergeltung.",
    official: {
      access: "supportive", relief: "conditional", agency: "supportive", safety: "conditional", distribution: "supportive", publicValue: "supportive",
      rationale: "Die Verantwortung wird nicht allein bei der leistungsbeziehenden Person gesucht. Entscheidend bleibt, ob Durchsetzung und Schutz praktisch funktionieren.",
    },
    guarded: {
      access: "supportive", relief: "supportive", agency: "supportive", safety: "supportive", distribution: "supportive", publicValue: "supportive",
      rationale: "Zusätzlich schützen sichere Meldewege und Anti-Retaliation-Regeln die betroffene Person.",
    },
  },
];

function round(value, digits = 0) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function scorePolicyCase(fixture, variant = "official") {
  const assessment = fixture[variant] ?? fixture.official;
  const dimensions = Object.fromEntries(
    policyDimensions.map((dimension) => [dimension.id, gradeScore[assessment[dimension.id]] ?? gradeScore.unknown]),
  );
  const score = round(
    dimensions.access * 0.18 +
      dimensions.relief * 0.15 +
      dimensions.agency * 0.15 +
      dimensions.safety * 0.22 +
      dimensions.distribution * 0.18 +
      dimensions.publicValue * 0.12,
  );
  const pass = score >= 65 && dimensions.access >= 55 && dimensions.safety >= 65 && dimensions.distribution >= 55;
  const failures = [];
  if (dimensions.access < 55) failures.push("access gate");
  if (dimensions.safety < 65) failures.push("stability floor");
  if (dimensions.distribution < 55) failures.push("distribution gate");
  return { fixtureId: fixture.id, score, pass, dimensions, failures, assessment };
}

export function runPolicyEval(variant = "official") {
  const results = policyFixtures.map((fixture) => ({ ...scorePolicyCase(fixture, variant), fixture }));
  const dimensionScores = Object.fromEntries(
    policyDimensions.map((dimension) => [
      dimension.id,
      round(results.reduce((sum, result) => sum + result.dimensions[dimension.id], 0) / results.length),
    ]),
  );
  const passCount = results.filter((result) => result.pass).length;
  const averageScore = round(results.reduce((sum, result) => sum + result.score, 0) / results.length);
  const hardFailures = results.filter((result) => result.failures.length > 0).length;
  return {
    variant,
    averageScore,
    passCount,
    totalCount: results.length,
    hardFailures,
    releaseGate: passCount === results.length && hardFailures === 0 ? "passes-design-gate" : "hold-and-measure",
    dimensionScores,
    results,
  };
}

export const defaultOutcomeScenario = {
  employment12MonthDeltaPp: 5,
  materialDeprivationDeltaPp: 0,
  housingCrisisDeltaPp: 1,
  stabilityGapDeltaPp: 0,
  adminMinutesDelta: 0,
  netPublicValueM: 0,
};

export const outcomeThresholds = {
  employment12MonthDeltaPp: 5,
  materialDeprivationDeltaPp: 0,
  housingCrisisDeltaPp: 1,
  stabilityGapDeltaPp: 0,
  adminMinutesDelta: 0,
  netPublicValueM: 0,
};

export function evaluateOutcomeScenario(inputs = defaultOutcomeScenario) {
  const harmTriggers = [];
  if (inputs.materialDeprivationDeltaPp > outcomeThresholds.materialDeprivationDeltaPp) harmTriggers.push("material deprivation increased");
  if (inputs.housingCrisisDeltaPp > outcomeThresholds.housingCrisisDeltaPp) harmTriggers.push("housing crisis guardrail failed");
  if (inputs.stabilityGapDeltaPp > outcomeThresholds.stabilityGapDeltaPp) harmTriggers.push("stability gap widened");

  const successConditions = {
    sustainableEmployment: inputs.employment12MonthDeltaPp >= outcomeThresholds.employment12MonthDeltaPp,
    noAdditionalAdminBurden: inputs.adminMinutesDelta <= outcomeThresholds.adminMinutesDelta,
    positiveWholeStateValue: inputs.netPublicValueM >= outcomeThresholds.netPublicValueM,
  };
  const successCount = Object.values(successConditions).filter(Boolean).length;
  let decision = "continue-measuring";
  if (harmTriggers.length > 0) decision = "stop-harm-trigger";
  else if (successCount === Object.keys(successConditions).length) decision = "scenario-passes";
  return { decision, harmTriggers, successConditions, successCount };
}

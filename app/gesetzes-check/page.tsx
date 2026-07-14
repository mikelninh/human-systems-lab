"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  defaultOutcomeScenario,
  evaluateOutcomeScenario,
  policyDimensions,
  policyFacts,
  policySources,
  runPolicyEval,
} from "@/lib/policy-eval.mjs";

type Variant = "official" | "guarded";
type OutcomeKey = keyof typeof defaultOutcomeScenario;

const outcomeControls: Array<{ key: OutcomeKey; label: string; suffix: string; min: number; max: number; help: string }> = [
  { key: "employment12MonthDeltaPp", label: "Nachhaltige Beschäftigung nach 12 Monaten", suffix: " pp", min: -10, max: 20, help: "gegenüber einer belastbaren Vergleichsgruppe" },
  { key: "materialDeprivationDeltaPp", label: "Schwere materielle Entbehrung", suffix: " pp", min: -10, max: 10, help: "negativ bedeutet Verbesserung" },
  { key: "housingCrisisDeltaPp", label: "Wohnungskrisen", suffix: " pp", min: -5, max: 10, help: "Mietrückstand, Räumung oder Notunterbringung" },
  { key: "stabilityGapDeltaPp", label: "Stabilitätslücke", suffix: " pp", min: -15, max: 15, help: "zwischen stabilster und verletzlichster Gruppe" },
  { key: "adminMinutesDelta", label: "Administrativer Aufwand pro Person", suffix: " min", min: -60, max: 120, help: "inklusive Neuanträgen und Widersprüchen" },
  { key: "netPublicValueM", label: "Netto-Public-Value", suffix: " Mio. €", min: -500, max: 500, help: "Bund, Kommunen, Gesundheit und Wohnen zusammen" },
];

const gradeLabel: Record<string, string> = {
  supportive: "unterstützend",
  conditional: "bedingt",
  unknown: "offen",
  risk: "Risiko",
  critical: "kritisch",
};

function track(event: string, detail = "") {
  navigator.sendBeacon("/api/event", new Blob([JSON.stringify({ event, detail })], { type: "application/json" }));
}

export default function PolicyEvalPage() {
  const [variant, setVariant] = useState<Variant>("official");
  const [selectedCase, setSelectedCase] = useState(0);
  const [runCount, setRunCount] = useState(1);
  const [copied, setCopied] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [outcomes, setOutcomes] = useState({ ...defaultOutcomeScenario });
  const report = useMemo(() => runPolicyEval(variant), [variant]);
  const scenario = useMemo(() => evaluateOutcomeScenario(outcomes), [outcomes]);
  const active = report.results[selectedCase] ?? report.results[0];

  useEffect(() => { track("policy_view", "grundsicherung-2026"); }, []);

  function chooseVariant(next: Variant) {
    setVariant(next);
    setSelectedCase(0);
    track("policy_variant", next);
  }

  function runTests() {
    setRunCount((count) => count + 1);
    track("policy_run", variant);
    document.getElementById("policy-results")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function updateOutcome(key: OutcomeKey, value: number) {
    setOutcomes((current) => ({ ...current, [key]: value }));
    track("policy_scenario", key);
  }

  async function share() {
    const data = {
      title: "Gesetzes-Check — Stability for Everyone",
      text: "Was passiert, wenn wir Gesetze wie System-Releases testen — mit realistischen Lebenslagen, Safety Gates und messbaren Outcomes?",
      url: window.location.href,
    };
    if (navigator.share) await navigator.share(data);
    else await navigator.clipboard.writeText(data.url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
    track("policy_share", variant);
  }

  function exportReport() {
    const payload = {
      title: "Human Systems Lab — Gesetzes-Check",
      generatedAt: new Date().toISOString(),
      policy: "Grundsicherung für Arbeitsuchende · Deutschland · 2026",
      status: "Ex-ante design assessment; outcome controls are hypothetical until replaced by observed data.",
      sources: policySources,
      designEval: report,
      outcomeScenario: simulating ? { inputs: outcomes, result: scenario } : "No observed outcome data supplied",
      principle: "A positive average or fiscal saving never overrides a failed stability, safety or distribution gate.",
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "gesetzes-check-grundsicherung-2026.json";
    anchor.click();
    URL.revokeObjectURL(url);
    track("policy_export", report.releaseGate);
  }

  return (
    <main className="policy-page">
      <header className="policy-nav">
        <Link href="/gesetzes-check" className="policy-brand"><span>§</span> GESETZES-CHECK</Link>
        <nav><a href="#stress-test">Stresstest</a><a href="#outcomes">Outcome Gate</a><a href="#method">Methode</a><Link href="/projects">Projekte</Link></nav>
        <button onClick={share}>{copied ? "Link kopiert ✓" : "Test teilen ↗"}</button>
      </header>

      <section className="policy-hero">
        <div>
          <p className="policy-eyebrow">Human Systems Lab · Policy Eval 01 · 14.07.2026</p>
          <h1>Gesetze sind<br /><em>System-Releases.</em></h1>
          <p>Wir prüfen nicht, ob eine Maßnahme links oder rechts klingt. Wir prüfen, ob sie Menschen in realistischen Situationen stabiler macht — und ob Einsparungen vielleicht nur zu Familien, Kommunen oder Hilfsorganisationen verschoben werden.</p>
          <div className="policy-hero-actions"><a href="#stress-test">6 Fälle testen <span>→</span></a><a href="#outcomes">Erfolg messbar machen</a></div>
        </div>
        <aside>
          <div><span>VORLÄUFIGES DESIGN-GATE</span><b className={report.releaseGate === "passes-design-gate" ? "pass" : "hold"}>{report.releaseGate === "passes-design-gate" ? "PASS" : "HOLD"}</b></div>
          <strong>{report.passCount}<small> / {report.totalCount}</small></strong>
          <h2>{report.releaseGate === "passes-design-gate" ? "Alle Fälle bestehen die Schutzschwelle." : "Hilfreiche Elemente — aber harte Risiken bleiben."}</h2>
          <p>Dies ist eine transparente ex-ante Bewertung der Regeln, noch kein Beweis ihrer realen Wirkung.</p>
        </aside>
      </section>

      <section className="policy-facts">
        <div><p className="policy-eyebrow">Offizielle Grundlage</p><h2>Was wir tatsächlich bewerten.</h2><p>Nur veröffentlichte Regeln werden als Fakten behandelt. Wirkungen bleiben Hypothesen, bis Daten vorliegen.</p></div>
        <ol>{policyFacts.map((fact, index) => <li key={fact}><span>0{index + 1}</span><p>{fact}</p></li>)}</ol>
        <div className="policy-source-list">{policySources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a>)}</div>
      </section>

      <section className="policy-stress" id="stress-test">
        <div className="policy-section-head"><div><p className="policy-eyebrow">01 · Ex-ante Stresstest</p><h2>Der ideale Bürger<br />ist kein ausreichender Test.</h2></div><p>Ein robustes Gesetz muss auch funktionieren, wenn jemand krank, überlastet, arm, sprachlich ausgeschlossen oder auf einem angespannten Wohnungsmarkt gefangen ist.</p></div>

        <div className="policy-variant-tabs">
          <button className={variant === "official" ? "active" : ""} onClick={() => chooseVariant("official")}><span>A</span><b>Grundsicherung 2026</b><small>offiziell veröffentlichte Regeln</small></button>
          <button className={variant === "guarded" ? "active" : ""} onClick={() => chooseVariant("guarded")}><span>B</span><b>Stability Guardrails</b><small>unser konstruktiver Redesign-Vorschlag</small></button>
          <button className="policy-run" onClick={runTests}>Tests ausführen →</button>
        </div>

        <div className="policy-console" id="policy-results">
          <div className="policy-cases">
            <div><span>TEST CASES</span><b>RUN #{String(runCount).padStart(2, "0")}</b></div>
            {report.results.map((result, index) => <button key={result.fixtureId} className={selectedCase === index ? "active" : ""} onClick={() => { setSelectedCase(index); track("policy_case", result.fixtureId); }}><i className={result.pass ? "pass" : "fail"}>{result.pass ? "✓" : "×"}</i><span><b>{result.fixture.persona}</b><small>{result.fixture.situation}</small></span><strong>{result.score}</strong></button>)}
          </div>
          <article className="policy-case-detail" aria-live="polite">
            <div className="policy-case-top"><span>{active.fixture.persona}</span><b className={active.pass ? "pass" : "hold"}>{active.pass ? "GATE PASS" : "GATE FAIL"}</b></div>
            <h3>{active.fixture.situation}</h3>
            <div className="policy-rule"><small>OFFIZIELLE REGEL</small><p>{active.fixture.officialRule}</p></div>
            <div className="policy-dimension-grid">{policyDimensions.map((dimension) => { const grade = active.assessment[dimension.id]; return <div key={dimension.id}><span>{dimension.label}</span><b className={`grade-${grade}`}>{gradeLabel[grade]}</b><i><em style={{ width: `${active.dimensions[dimension.id]}%` }} /></i></div>; })}</div>
            <blockquote>{active.assessment.rationale}</blockquote>
            <div className="policy-evidence-needed"><small>DAS MÜSSEN WIR NACH INKRAFTTRETEN MESSEN</small><p>{active.fixture.evidenceNeeded}</p></div>
          </article>
        </div>

        <div className="policy-gate-summary">
          <article><span>ACCESS GATE</span><strong>{report.dimensionScores.access}</strong><p>Hilfe darf nicht gerade für die Menschen verschwinden, die am schwersten erreichbar sind.</p></article>
          <article><span>STABILITY FLOOR</span><strong>{report.dimensionScores.safety}</strong><p>Ein positiver Durchschnitt kann den Verlust existenzieller Sicherheit nicht aufheben.</p></article>
          <article><span>DISTRIBUTION GATE</span><strong>{report.dimensionScores.distribution}</strong><p>Wir prüfen die verletzlichste Gruppe separat — nicht nur den Durchschnitt.</p></article>
          <article className={report.releaseGate === "passes-design-gate" ? "pass" : "hold"}><span>DECISION</span><strong>{report.releaseGate === "passes-design-gate" ? "PASS" : "HOLD"}</strong><p>{report.hardFailures} von {report.totalCount} Fällen verletzen mindestens ein hartes Gate.</p></article>
        </div>
      </section>

      <section className="policy-outcomes" id="outcomes">
        <div className="policy-section-head light"><div><p className="policy-eyebrow">02 · Outcome Gate</p><h2>Weniger Ausgaben<br />sind noch kein Erfolg.</h2></div><p>Ein Leistungsstopp kann im Bundeshaushalt wie eine Einsparung aussehen und gleichzeitig Kosten bei Wohnungslosenhilfe, Gesundheit, Kommunen oder Familien erzeugen. Deshalb zählt nur der gesamte Effekt.</p></div>

        {!simulating ? <div className="policy-no-evidence"><span>OBSERVED OUTCOME DATA</span><strong>—</strong><h3>Noch nicht verfügbar.</h3><p>Die neue Regelung ist zu jung für belastbare 12-Monats-Wirkungen. Wir simulieren nicht heimlich Gewissheit.</p><button onClick={() => { setSimulating(true); track("policy_scenario", "opened"); }}>Hypothetisches Szenario testen →</button></div> : <div className="policy-outcome-workbench">
          <div className="policy-sliders">
            <div><span>HYPOTHETISCHES SZENARIO</span><button onClick={() => setSimulating(false)}>Schließen ×</button></div>
            {outcomeControls.map((control) => <label key={control.key}><span><b>{control.label}</b><strong>{outcomes[control.key] > 0 ? "+" : ""}{outcomes[control.key]}{control.suffix}</strong></span><small>{control.help}</small><input type="range" min={control.min} max={control.max} value={outcomes[control.key]} onChange={(event) => updateOutcome(control.key, Number(event.target.value))} /></label>)}
          </div>
          <div className="policy-scenario-result">
            <div><span>SCENARIO GATE</span><b className={scenario.decision === "scenario-passes" ? "pass" : scenario.decision === "stop-harm-trigger" ? "stop" : "hold"}>{scenario.decision === "scenario-passes" ? "CONDITIONAL PASS" : scenario.decision === "stop-harm-trigger" ? "STOP" : "KEEP MEASURING"}</b></div>
            <h3>{scenario.decision === "scenario-passes" ? "In diesem Szenario zeigen Wirkung, Sicherheit und Gesamtwert in dieselbe Richtung." : scenario.decision === "stop-harm-trigger" ? "Ein Harm Trigger schlägt an. Beschäftigung oder Einsparung dürfen ihn nicht überstimmen." : "Der Nutzen ist noch nicht stark oder vollständig genug belegt."}</h3>
            <ul><li className={scenario.successConditions.sustainableEmployment ? "pass" : "fail"}><span>{scenario.successConditions.sustainableEmployment ? "✓" : "×"}</span> Nachhaltige Beschäftigung mindestens +5 pp</li><li className={outcomes.materialDeprivationDeltaPp <= 0 ? "pass" : "fail"}><span>{outcomes.materialDeprivationDeltaPp <= 0 ? "✓" : "×"}</span> Keine zusätzliche materielle Entbehrung</li><li className={outcomes.housingCrisisDeltaPp <= 1 ? "pass" : "fail"}><span>{outcomes.housingCrisisDeltaPp <= 1 ? "✓" : "×"}</span> Wohnungskrisen höchstens +1 pp</li><li className={outcomes.stabilityGapDeltaPp <= 0 ? "pass" : "fail"}><span>{outcomes.stabilityGapDeltaPp <= 0 ? "✓" : "×"}</span> Stabilitätslücke wird nicht größer</li><li className={scenario.successConditions.noAdditionalAdminBurden ? "pass" : "fail"}><span>{scenario.successConditions.noAdditionalAdminBurden ? "✓" : "×"}</span> Kein zusätzlicher Verwaltungsaufwand</li><li className={scenario.successConditions.positiveWholeStateValue ? "pass" : "fail"}><span>{scenario.successConditions.positiveWholeStateValue ? "✓" : "×"}</span> Netto-Nutzen über alle öffentlichen Systeme</li></ul>
            <p>Dies bleibt ein Szenario, keine Behauptung über Deutschland. Schwellenwerte sind ein begründeter Vorschlag und offen für demokratische Diskussion.</p>
          </div>
        </div>}
      </section>

      <section className="policy-method" id="method">
        <div><p className="policy-eyebrow">03 · Die Methode</p><h2>Von politischer Behauptung zu überprüfbarer Wirkung.</h2></div>
        <ol><li><span>01</span><b>Observe</b><p>Regeltext, Betroffene, Institutionen und Anreize sichtbar machen.</p></li><li><span>02</span><b>Stress test</b><p>Reale Grenzfälle testen, bevor der Durchschnitt beruhigt.</p></li><li><span>03</span><b>Pre-register</b><p>Outcomes, Vergleichsgruppen, Schwellen und Stop-Regeln vorher festlegen.</p></li><li><span>04</span><b>Measure</b><p>Nach 3, 6 und 12 Monaten Wirkung und Folgekosten beobachten.</p></li><li><span>05</span><b>Redesign</b><p>Hilfreiches behalten, schädliche Mechanismen verändern.</p></li></ol>
        <div className="policy-method-actions"><button onClick={exportReport}>Eval-Bericht als JSON exportieren ↓</button><Link href="/impact-eval">Unsere allgemeine Impact Eval Suite →</Link></div>
      </section>

      <section className="policy-manifesto"><p>Unser Maßstab</p><blockquote>Mehr stabile Leben. Eine kleinere Stabilitätslücke. Mehr gemeinsame Handlungsfähigkeit — ohne versteckten Schaden.</blockquote><div>STABILITY FOR EVERYONE <span>≠</span> GLEICHHEIT ALLER LEBENSWEGE</div></section>

      <footer className="policy-footer"><Link href="/gesetzes-check" className="policy-brand"><span>§</span> GESETZES-CHECK</Link><p>Ein offener Vorschlag des Human Systems Lab · Michael Ninh</p><div><a href="https://github.com/mikelninh/human-systems-lab" target="_blank" rel="noreferrer">Source ↗</a><Link href="/projects">Alle Prototypen →</Link></div></footer>
    </main>
  );
}

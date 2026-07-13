"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  calculateValueCase,
  defaultValueInputs,
  impactDimensions,
  runGuidanceEval,
} from "@/lib/impact-eval.mjs";

type Variant = "baseline" | "redesigned";
type ValueKey = keyof typeof defaultValueInputs;

const controls: Array<{ key: ValueKey; label: string; suffix: string; min: number; max: number }> = [
  { key: "participants", label: "People in pilot", suffix: "", min: 10, max: 500 },
  { key: "baselineMinutes", label: "Minutes before", suffix: " min", min: 1, max: 60 },
  { key: "pilotMinutes", label: "Minutes after", suffix: " min", min: 1, max: 60 },
  { key: "baselineReachPct", label: "Reached useful path before", suffix: "%", min: 0, max: 100 },
  { key: "pilotReachPct", label: "Reached useful path after", suffix: "%", min: 0, max: 100 },
  { key: "baselineActionPct", label: "Took next action before", suffix: "%", min: 0, max: 100 },
  { key: "pilotActionPct", label: "Took next action after", suffix: "%", min: 0, max: 100 },
  { key: "baselineHelpOthersPct", label: "Helped someone else before", suffix: "%", min: 0, max: 100 },
  { key: "pilotHelpOthersPct", label: "Helped someone else after", suffix: "%", min: 0, max: 100 },
  { key: "pilotCost", label: "Pilot cost", suffix: " €", min: 0, max: 10000 },
];

const recommendationLabels: Record<string, string> = {
  "scale-carefully": "Scale carefully",
  "continue-testing": "Continue the pilot",
  "stop-safety-gate": "Stop: safety gate failed",
  redesign: "Redesign before scaling",
};

function track(event: string, detail = "") {
  navigator.sendBeacon(
    "/api/event",
    new Blob([JSON.stringify({ event, detail })], { type: "application/json" }),
  );
}

export default function ImpactEvalPage() {
  const [variant, setVariant] = useState<Variant>("redesigned");
  const [runCount, setRunCount] = useState(1);
  const [inputs, setInputs] = useState({ ...defaultValueInputs });
  const [copied, setCopied] = useState(false);
  const report = useMemo(() => runGuidanceEval(variant), [variant]);
  const value = useMemo(() => calculateValueCase(inputs, report.safetyPassRate), [inputs, report]);

  useEffect(() => {
    track("eval_view", "impact-proof");
  }, []);

  function chooseVariant(next: Variant) {
    setVariant(next);
    track("eval_scenario_selected", next);
  }

  function runEval() {
    setRunCount((count) => count + 1);
    track("eval_run", variant);
    document.getElementById("eval-results")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function updateInput(key: ValueKey, next: number) {
    setInputs((current) => ({ ...current, [key]: next }));
  }

  function exportReport() {
    const payload = {
      title: "Human Systems Lab — Impact Eval Report",
      generatedAt: new Date().toISOString(),
      status: "synthetic demonstration — replace inputs with observed pilot data",
      releaseGate: report.releaseGate,
      guidanceEval: report,
      publicValueCase: value,
      principle: "Useful averages never override a failed safety or equity gate.",
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "human-systems-impact-eval.json";
    anchor.click();
    URL.revokeObjectURL(url);
    track("eval_export", report.releaseGate);
  }

  async function share() {
    const data = {
      title: "Impact Eval Suite — Human Systems Lab",
      text: "Can an AI system prove that it reduced friction, expanded opportunity and helped people help others?",
      url: window.location.href,
    };
    if (navigator.share) await navigator.share(data);
    else await navigator.clipboard.writeText(data.url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
    track("eval_share", "impact-proof");
  }

  return (
    <main className="eval-page">
      <header className="eval-nav">
        <Link href="/impact-eval" className="eval-brand"><span>✓</span> IMPACT PROOF</Link>
        <nav><a href="#suite">Eval suite</a><a href="#value">Value case</a><a href="#roles">Role proof</a><Link href="/projects">Prototypes</Link></nav>
        <button onClick={share}>{copied ? "Link copied ✓" : "Share the proof ↗"}</button>
      </header>

      <section className="eval-hero">
        <div className="eval-hero-copy">
          <p className="eval-kicker"><i /> Human Systems Lab · public working proof</p>
          <h1>Capacity<br />to <em>help.</em></h1>
          <p>We evaluate whether an AI-enabled service reduces friction, expands opportunity and enables people to help someone else — without taking away agency or hiding unsafe failures.</p>
          <div className="eval-actions"><a href="#suite">Run the eval suite <span>→</span></a><a href="#value">Build the value case</a></div>
          <div className="eval-principles"><span>DETERMINISTIC RUBRIC</span><span>SYNTHETIC PERSONAS</span><span>HUMAN REVIEW GATE</span><span>NO PERSONAL DATA</span></div>
        </div>
        <aside className="eval-hero-card" aria-label="Current evaluation result">
          <div><span>RELEASE GATE</span><b>{report.releaseGate === "ready-to-pilot" ? "PASS" : "HOLD"}</b></div>
          <strong>{report.averageScore}<small>/100</small></strong>
          <h2>{report.releaseGate === "ready-to-pilot" ? "Ready for a bounded pilot" : "Redesign before real use"}</h2>
          <ul><li><span>{report.passCount}/{report.totalCount}</span> personas passed</li><li><span>{report.safetyPassRate}%</span> safety pass rate</li><li><span>{value.additionalHelpers > 0 ? `+${value.additionalHelpers}` : value.additionalHelpers}</span> potential new helpers</li></ul>
          <small>Demonstration data, clearly labeled. Real claims require observed pilot evidence.</small>
        </aside>
      </section>

      <section className="eval-definition">
        {impactDimensions.map((dimension, index) => <article key={dimension.id}><span>0{index + 1}</span><h3>{dimension.label}</h3><p>{dimension.question}</p></article>)}
      </section>

      <section className="eval-suite" id="suite">
        <div className="eval-section-head"><div><p className="eval-kicker">01 · Product quality</p><h2>Helpful is not a feeling.<br />It is a testable claim.</h2></div><p>A multilingual public-service guide is tested against five synthetic situations. The suite checks official routing, clear next action, uncertainty, data minimization, human handoff and safe sharing.</p></div>

        <div className="eval-console">
          <div className="eval-console-controls">
            <small>COMPARE SYSTEM BEHAVIOR</small>
            <div><button className={variant === "baseline" ? "active" : ""} onClick={() => chooseVariant("baseline")}><span>A</span> Helpful-sounding baseline</button><button className={variant === "redesigned" ? "active" : ""} onClick={() => chooseVariant("redesigned")}><span>B</span> Human-centered redesign</button></div>
            <button className="eval-run" onClick={runEval}>Run {report.totalCount} test cases →</button>
            <p>No model judges itself. The first gate is deterministic and inspectable; ambiguous cases are escalated to humans.</p>
          </div>
          <div className="eval-console-results" id="eval-results" aria-live="polite">
            <div className="eval-result-top"><span>RUN #{String(runCount).padStart(2, "0")}</span><b className={report.releaseGate === "ready-to-pilot" ? "pass" : "hold"}>{report.releaseGate.replaceAll("-", " ")}</b></div>
            <div className="eval-bars">{impactDimensions.map((dimension) => <div key={dimension.id}><label><span>{dimension.label}</span><b>{report.dimensionScores[dimension.id]}%</b></label><div><i style={{ width: `${report.dimensionScores[dimension.id]}%` }} /></div></div>)}</div>
            <div className="eval-cases">{report.results.map((result: { fixtureId: string; pass: boolean; score: number; fixture: { persona: string; need: string } }) => <div key={result.fixtureId}><span className={result.pass ? "pass" : "fail"}>{result.pass ? "✓" : "×"}</span><p><b>{result.fixture.persona}</b><small>{result.fixture.need}</small></p><strong>{result.score}</strong></div>)}</div>
          </div>
        </div>

        <div className="eval-gates"><article><span>SHIP GATE</span><h3>Every case must pass access and safety.</h3><p>An average score cannot conceal a wrong destination, an invented eligibility decision or unnecessary collection of sensitive data.</p></article><article><span>LEARNING LOOP</span><h3>Failures become fixtures.</h3><p>Every real-world mistake becomes a reproducible test case, so the system improves without quietly forgetting who it failed.</p></article><article><span>HUMAN AUTHORITY</span><h3>AI supports; accountable people decide.</h3><p>The tool may orient, translate and summarize. It does not make legal, benefits, medical or political decisions.</p></article></div>
      </section>

      <section className="eval-value" id="value">
        <div className="eval-section-head light"><div><p className="eval-kicker">02 · Public value</p><h2>From prototype<br />to account thesis.</h2></div><p>Adjust the assumptions as if this were a bounded pilot with a municipality, foundation or social organization. The output connects adoption to time, outcomes, equity and cost.</p></div>
        <div className="value-workbench">
          <div className="value-inputs">{controls.map((control) => <label key={control.key}><span>{control.label}<b>{inputs[control.key]}{control.suffix}</b></span><input type="range" min={control.min} max={control.max} value={inputs[control.key]} onChange={(event) => updateInput(control.key, Number(event.target.value))} /></label>)}</div>
          <div className="value-output">
            <div className="value-output-head"><span>SYNTHETIC PILOT READOUT</span><b>{recommendationLabels[value.recommendation]}</b></div>
            <div className="value-metrics"><article><strong>{value.timeSavedHours > 0 ? "+" : ""}{value.timeSavedHours}h</strong><span>time returned to people</span></article><article><strong>{value.additionalUsefulPaths > 0 ? "+" : ""}{value.additionalUsefulPaths}</strong><span>additional useful paths reached</span></article><article><strong>{value.additionalActions > 0 ? "+" : ""}{value.additionalActions}</strong><span>additional next actions</span></article><article className="multiplier"><strong>{value.additionalHelpers > 0 ? "+" : ""}{value.additionalHelpers}</strong><span>people enabled to help someone else</span></article><article><strong>{value.equityGapChange > 0 ? "−" : "+"}{Math.abs(value.equityGapChange)}pt</strong><span>access gap</span></article><article><strong>{value.costPerAdditionalAction === null ? "—" : `${value.costPerAdditionalAction} €`}</strong><span>per additional action</span></article></div>
            <div className="value-decision"><span>DECISION LOGIC</span><p>{value.recommendation === "scale-carefully" ? "Outcome, safety and equity signals point in the same direction. Expand one cohort at a time and keep the stop conditions." : value.recommendation === "stop-safety-gate" ? "Positive adoption cannot compensate for an unsafe output. Stop release and add the failure to the eval set." : value.recommendation === "redesign" ? "The intervention has not yet created additional access or action. Return to the decisive friction." : "The signal is not yet strong enough. Continue the bounded pilot and collect outcome evidence."}</p><button onClick={exportReport}>Export evidence report .json ↓</button></div>
          </div>
        </div>
        <p className="value-caveat">These numbers are adjustable demonstration data, not claims about measured impact. The same structure becomes a real evaluation once a partner supplies an agreed baseline and observed, privacy-preserving pilot results.</p>
      </section>

      <section className="evidence-ladder">
        <div><p className="eval-kicker">Evidence ladder</p><h2>We do not jump from clicks to “impact.”</h2></div>
        <ol><li><span>01</span><div><b>Activity</b><p>A page was opened or a test was run.</p></div><small>Weak signal</small></li><li><span>02</span><div><b>Access</b><p>A person reached a relevant official or human path.</p></div><small>Useful signal</small></li><li><span>03</span><div><b>Action</b><p>A person completed a meaningful next step.</p></div><small>Outcome signal</small></li><li><span>04</span><div><b>Relief</b><p>Time, stress or administrative burden decreased.</p></div><small>Impact signal</small></li><li className="active"><span>05</span><div><b>Multiplication</b><p>A person gained enough agency to help another person.</p></div><small>Capacity signal</small></li></ol>
      </section>

      <section className="role-proof" id="roles">
        <div className="eval-section-head"><div><p className="eval-kicker">03 · Application proof</p><h2>One artifact.<br />Two relevant stories.</h2></div><p>This is not a speculative cover-letter claim. The code, rubric, fixtures, interaction and value model are inspectable.</p></div>
        <div className="role-grid"><article><div><span>n8n · AI Product Manager</span><b>PRODUCT QUALITY</b></div><h3>Turn AI ambition into behavior users can trust.</h3><ul><li>Public, visible building</li><li>Agent and human-in-the-loop judgment</li><li>Deterministic evals and release gates</li><li>UX, safety and failure analysis</li></ul><p><strong>Proof:</strong> I defined what “helpful” means, encoded it as reproducible tests and made the trade-offs legible to users.</p><a href="#suite">Inspect the eval →</a></article><article><div><span>deepset · Value Engineer</span><b>PUBLIC VALUE</b></div><h3>Connect an AI use case to measurable institutional outcomes.</h3><ul><li>Structured value discovery</li><li>Public-sector use case and constraints</li><li>POC success conditions and rollout gate</li><li>Adoption, ROI, equity and risk</li></ul><p><strong>Proof:</strong> I translated a public-service prototype into an account thesis with measurable value, stop conditions and a path to first value.</p><a href="#value">Inspect the value case →</a></article></div>
      </section>

      <section className="eval-manifesto">
        <blockquote>“You are also one of the people you are responsible for.”</blockquote>
        <div><h2>Stability is not the opposite of service.</h2><p>Personal stability creates durable capacity. Capacity creates contribution. Contribution should create more agency — not dependence — in the people it reaches.</p><p className="formula">STABILITY <i>→</i> CAPACITY <i>→</i> CONTRIBUTION <i>→</i> SHARED AGENCY</p></div>
      </section>

      <footer className="eval-footer"><Link href="/impact-eval" className="eval-brand"><span>✓</span> IMPACT PROOF</Link><p>Human Systems Lab · Michael Ninh</p><div><a href="https://github.com/mikelninh/human-systems-lab" target="_blank" rel="noreferrer">Source ↗</a><Link href="/anspruch-direkt">Test Anspruch Direkt →</Link></div></footer>
    </main>
  );
}

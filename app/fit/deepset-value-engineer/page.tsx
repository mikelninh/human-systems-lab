"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { calculateDeepsetValueCase, defaultDeepsetValueInputs } from "@/lib/role-fit.mjs";

type ValueKey = keyof typeof defaultDeepsetValueInputs;

const controls: Array<{ key: ValueKey; label: string; suffix: string; min: number; max: number }> = [
  { key: "pilotUsers", label: "Journeys per month", suffix: "", min: 100, max: 5000 },
  { key: "minutesBefore", label: "Handling time before", suffix: " min", min: 5, max: 60 },
  { key: "minutesAfter", label: "Handling time after", suffix: " min", min: 3, max: 45 },
  { key: "correctRouteBeforePct", label: "Correct routing before", suffix: "%", min: 20, max: 95 },
  { key: "correctRouteAfterPct", label: "Correct routing after", suffix: "%", min: 20, max: 100 },
  { key: "staffHourlyCost", label: "Loaded staff cost", suffix: " €/h", min: 20, max: 100 },
  { key: "pilotCost", label: "POC cost", suffix: " €", min: 5000, max: 100000 },
  { key: "months", label: "Value horizon", suffix: " months", min: 1, max: 24 },
];

const fit = [
  { label: "German public-sector communication", state: "strong", proof: "Native German, multilingual perspective and a portfolio centered on understandable public services and institutional accountability." },
  { label: "Systems thinking + tactical execution", state: "strong", proof: "Observe → Diagnose → Redesign → Test → Scale is applied through live prototypes, not presented as a slide-only method." },
  { label: "AI/RAG + Python/API fluency", state: "credible", proof: "AI engineering training and working projects across RAG, Document AI, FastAPI, structured outputs, MCP and evaluation." },
  { label: "Value discovery and ROI framing", state: "strong", proof: "Interactive public-value cases connect adoption to time, access, successful actions, equity, risk and cost." },
  { label: "Executive storytelling", state: "credible", proof: "Complex technical and political systems are translated into concise narratives, visible trade-offs and decision gates." },
  { label: "Commercial instinct", state: "credible", proof: "Founder, e-commerce, funnel and growth experimentation background; comfortable connecting user value to willingness to pay." },
  { label: "Enterprise Sales Engineering tenure", state: "building", proof: "No claim of years in a formal VE/SE title. The account thesis below demonstrates the operating model; live deal evidence remains to be earned." },
  { label: "Public procurement + infrastructure depth", state: "building", proof: "Compliance-aware and API-literate, but Kubernetes, Terraform, SSO/VPC and procurement-cycle proof need focused deepening." },
];

const recommendationLabels: Record<string, string> = {
  "expand-with-guardrails": "Expand with guardrails",
  "bounded-poc": "Run bounded POC",
  "continue-discovery": "Continue discovery",
  "redesign-use-case": "Redesign use case",
};

function track(event: string, detail = "") {
  navigator.sendBeacon("/api/event", new Blob([JSON.stringify({ event, detail })], { type: "application/json" }));
}

export default function DeepsetFitPage() {
  const [inputs, setInputs] = useState({ ...defaultDeepsetValueInputs });
  const [copied, setCopied] = useState(false);
  const value = useMemo(() => calculateDeepsetValueCase(inputs), [inputs]);
  useEffect(() => { track("role_fit_view", "deepset-value-engineer"); }, []);

  function update(key: ValueKey, next: number) {
    setInputs((current) => ({ ...current, [key]: next }));
    track("role_value_change", key);
  }

  async function share() {
    const data = { title: "Michael Ninh × deepset — Value Engineer", text: "A public-sector account thesis, POC plan and evidence-backed role fit.", url: window.location.href };
    if (navigator.share) await navigator.share(data); else await navigator.clipboard.writeText(data.url);
    setCopied(true); window.setTimeout(() => setCopied(false), 1700); track("role_fit_share", "deepset-value-engineer");
  }

  return <main className="role-page deepset-fit">
    <header className="role-nav"><Link href="/fit/deepset-value-engineer" className="role-brand"><span>MN</span> MICHAEL NINH × deepset</Link><nav><a href="#thesis">Account thesis</a><a href="#poc">POC</a><a href="#value">Value case</a><a href="#fit">Fit</a></nav><button onClick={share}>{copied ? "Copied ✓" : "Share ↗"}</button></header>

    <section className="role-hero">
      <div><p className="role-kicker">VALUE ENGINEER · PUBLIC SECTOR · BERLIN</p><h1>From AI demo<br />to <em>public value.</em></h1><p>I connect a consequential AI use case to stakeholder needs, technical design, risk gates, adoption and measurable outcomes — then keep the solution accountable after launch.</p><div className="role-actions"><a href="#thesis">Inspect the account thesis <span>→</span></a><a href="#value">Test the value case</a></div></div>
      <aside><div><span>FIT THESIS</span><b>UNCONVENTIONAL BRIDGE</b></div><h2>AI engineering × product craft × commercial systems thinking.</h2><ul><li><b>03</b><span>strong proof areas</span></li><li><b>03</b><span>credible adjacent areas</span></li><li><b>02</b><span>proofs to deepen</span></li></ul><p>A stretch on formal enterprise VE tenure; a strong fit on mission, German communication, systems judgment and hands-on value prototyping.</p></aside>
    </section>

    <section className="role-why deepset-why"><p>WHY DEEPSET</p><blockquote>Critical AI should remain controllable, transparent and sovereign — while reaching value quickly enough to survive the real institution around it.</blockquote><div><span>Haystack provides the technical building blocks.</span><b>Value Engineering makes adoption real.</b></div></section>

    <section className="account-thesis" id="thesis"><div className="role-section-head"><div><p className="role-kicker">01 · Example account thesis</p><h2>Multilingual service guidance for a German municipality.</h2></div><p>A grounded assistant helps residents and caseworkers find the right official path. It does not decide eligibility, collect unnecessary personal data or replace accountable staff.</p></div><div className="thesis-grid"><article><span>CUSTOMER HYPOTHESIS</span><h3>Municipal social-services organization</h3><p>High inquiry volume, fragmented official information, multilingual access barriers and expensive misrouting.</p></article><article><span>FIRST USE CASE</span><h3>Official-path guidance</h3><p>Understand the situation, retrieve approved sources, explain uncertainty and hand off with a useful summary.</p></article><article><span>WHY NOW</span><h3>Pressure without safe automation</h3><p>Staff capacity is constrained, while a wrong answer can create financial, legal or human harm.</p></article><article className="thesis-decision"><span>ACCOUNT DECISION</span><h3>Qualify — with conditions</h3><p>Proceed only with an accountable service owner, approved source set, data readiness and measurable baseline.</p></article></div></section>

    <section className="stakeholder-section"><div><p className="role-kicker">Multi-persona discovery</p><h2>One use case. Six definitions of value.</h2></div><div className="stakeholder-grid"><article><span>01</span><b>Resident</b><p>“Can I reach the right help without understanding the institution first?”</p><small>access · language · dignity</small></article><article><span>02</span><b>Caseworker</b><p>“Does this remove repetitive work without creating cleanup?”</p><small>time · accuracy · escalation</small></article><article><span>03</span><b>Service owner</b><p>“Will outcomes improve across every district and group?”</p><small>adoption · equity · quality</small></article><article><span>04</span><b>IT architect</b><p>“Can we integrate, observe and operate this safely?”</p><small>APIs · IAM · reliability</small></article><article><span>05</span><b>DPO / procurement</b><p>“Is data minimized, auditable and contractually controlled?”</p><small>GDPR · sovereignty · risk</small></article><article><span>06</span><b>Executive sponsor</b><p>“What changes, by when, and what is the cost of inaction?”</p><small>public value · trust · scale</small></article></div></section>

    <section className="solution-architecture"><div className="role-section-head light"><div><p className="role-kicker">02 · Solution design</p><h2>A grounded path, not a chatbot-shaped promise.</h2></div><p>A Haystack-based pipeline can keep retrieval, policy, generation, evaluation and escalation modular. The exact deployment model follows discovery, security and sovereignty requirements.</p></div><div className="architecture-flow"><article><span>01 · INGEST</span><b>Approved official sources</b><small>versioned · owned · freshness SLA</small></article><i>→</i><article><span>02 · RETRIEVE</span><b>Haystack pipeline</b><small>hybrid search · metadata filters</small></article><i>→</i><article><span>03 · GENERATE</span><b>Grounded response</b><small>citations · uncertainty · language</small></article><i>→</i><article><span>04 · GATE</span><b>Policy + eval layer</b><small>no eligibility decision · safety fixtures</small></article><i>→</i><article><span>05 · HANDOFF</span><b>Human service path</b><small>trace · summary · accountable owner</small></article></div><div className="architecture-guardrails"><span>DATA MINIMIZATION</span><span>ROLE-BASED ACCESS</span><span>SOURCE TRACEABILITY</span><span>HUMAN AUTHORITY</span><span>REGRESSION EVALS</span><span>STOP CONDITIONS</span></div></section>

    <section className="poc-section" id="poc"><div className="role-section-head"><div><p className="role-kicker">03 · POC to first value</p><h2>Four weeks. One bounded claim.</h2></div><p>The POC proves useful behavior and institutional readiness — not merely that an LLM can produce fluent text.</p></div><div className="poc-grid"><article><span>WEEK 01</span><h3>Baseline + source readiness</h3><p>Confirm use case, stakeholders, approved corpus, current handling time, routing accuracy and exclusion criteria.</p></article><article><span>WEEK 02</span><h3>Grounded vertical slice</h3><p>Build one end-to-end journey with citations, uncertainty, multilingual UX and human handoff.</p></article><article><span>WEEK 03</span><h3>Eval + shadow test</h3><p>Run synthetic fixtures and real staff-reviewed cases without exposing residents to unproven behavior.</p></article><article><span>WEEK 04</span><h3>Value readout</h3><p>Compare baseline, safety, adoption and operational effort; decide expand, redesign or stop.</p></article></div><div className="poc-gates"><div><span>QUALITY</span><b>≥ 80%</b><p>correct official routing</p></div><div><span>SAFETY</span><b>100%</b><p>critical fixtures pass</p></div><div><span>ADOPTION</span><b>≥ 70%</b><p>staff can complete journey</p></div><div><span>OPERATIONS</span><b>Named</b><p>owner, runbook and escalation</p></div></div></section>

    <section className="deepset-value" id="value"><div className="role-section-head light"><div><p className="role-kicker">04 · Interactive value case</p><h2>Tie the solution to outcomes.</h2></div><p>Adjust the assumptions. These are demonstration inputs, not claims about a real customer. A real account thesis replaces every slider with agreed baseline data.</p></div><div className="deepset-workbench"><div className="deepset-controls">{controls.map((control) => <label key={control.key}><span>{control.label}<b>{inputs[control.key]}{control.suffix}</b></span><input type="range" min={control.min} max={control.max} value={inputs[control.key]} onChange={(event) => update(control.key, Number(event.target.value))} /></label>)}</div><div className="deepset-output"><div><span>SYNTHETIC READOUT</span><b>{recommendationLabels[value.recommendation]}</b></div><h3>{value.recommendation === "bounded-poc" ? "The quality signal could justify a bounded POC; the six-month capacity case has not yet paid back the assumed cost." : value.recommendation === "expand-with-guardrails" ? "Quality and capacity value support phased expansion, provided safety and adoption gates remain intact." : value.recommendation === "redesign-use-case" ? "The use case does not improve routing or time. Return to discovery before adding technology." : "Promising, but the account needs more baseline evidence."}</h3><div className="deepset-metrics"><article><strong>{value.monthlyTimeSavedHours}h</strong><span>monthly capacity returned</span></article><article><strong>{value.additionalCorrectRoutes > 0 ? "+" : ""}{value.additionalCorrectRoutes}</strong><span>correct routes per month</span></article><article><strong>{value.sixMonthCapacityValue.toLocaleString("de-DE")} €</strong><span>capacity value over horizon</span></article><article className={value.netCapacityValue >= 0 ? "positive" : "negative"}><strong>{value.netCapacityValue > 0 ? "+" : ""}{value.netCapacityValue.toLocaleString("de-DE")} €</strong><span>net capacity value</span></article><article><strong>{value.costPerAdditionalCorrectRoute === null ? "—" : `${value.costPerAdditionalCorrectRoute} €`}</strong><span>per additional correct route</span></article></div><p>Not yet included: avoided repeat contacts, resident time, equity effects, error cost, training, hosting, change management and downstream service outcomes.</p></div></div></section>

    <section className="role-fit-section" id="fit"><div className="role-section-head"><div><p className="role-kicker">05 · Requirement map</p><h2>Where I fit — and where I stretch.</h2></div><p>The strongest story is not “I have already done every part of this senior role.” It is that my combined technical, product, commercial and public-systems work makes me unusually capable of growing into it quickly.</p></div><div className="fit-grid">{fit.map((item, index) => <article key={item.label}><div><span>0{index + 1}</span><b className={item.state}>{item.state}</b></div><h3>{item.label}</h3><p>{item.proof}</p></article>)}</div></section>

    <section className="role-proof-plan deepset-plan"><div><p className="role-kicker">06 · Proof plan</p><h2>What I would validate before interview.</h2></div><ol><li><span>01</span><div><b>Build the Haystack vertical slice</b><p>Use an approved public German corpus, citations, metadata filtering and a human escalation path.</p></div><strong>1–2 days</strong></li><li><span>02</span><div><b>Interview three public-service personas</b><p>One resident-facing worker, one service owner and one technical or data-protection stakeholder.</p></div><strong>3 calls</strong></li><li><span>03</span><div><b>Prepare objection handling</b><p>Why custom RAG, why deepset, why not generic search, build vs buy, sovereignty, cost and operational ownership.</p></div><strong>1 page</strong></li><li><span>04</span><div><b>Deepen the infrastructure layer</b><p>Be ready to discuss SSO, IAM, VPC deployment, observability and the boundary between prototype and enterprise operation.</p></div><strong>Focused</strong></li></ol></section>

    <section className="role-close deepset-close"><p>THE VALUE I BRING</p><blockquote>I make the technical solution, institutional reality and human outcome part of the same account thesis.</blockquote><div><a href="mailto:hallo.chupi@gmail.com">hallo.chupi@gmail.com</a><a href="https://github.com/mikelninh/human-systems-lab" target="_blank" rel="noreferrer">GitHub ↗</a><Link href="/gesetzes-check">Policy Eval proof →</Link></div></section>
    <footer className="role-footer"><Link href="/fit/deepset-value-engineer" className="role-brand"><span>MN</span> MICHAEL NINH × deepset</Link><p>Role-specific public-sector value case · Berlin · 2026</p><Link href="/fit/n8n-ai-product-manager">n8n AI Product Manager case →</Link></footer>
  </main>;
}

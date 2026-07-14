"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const requirements = [
  { label: "Eval practice", state: "strong", proof: "A public deterministic eval suite with hard access and safety release gates, regression fixtures and an exportable evidence report.", href: "/impact-eval" },
  { label: "Visible building", state: "strong", proof: "Multiple live public prototypes, source code, explicit hypotheses and measurable next steps.", href: "/projects" },
  { label: "AI product judgment", state: "strong", proof: "Clear boundaries between deterministic logic, AI support, human authority and actions that should not be automated.", href: "/impact-eval#suite" },
  { label: "UX taste", state: "strong", proof: "Complex public-service and evaluation concepts turned into understandable, interactive product experiences.", href: "/anspruch-direkt" },
  { label: "Harness literacy", state: "credible", proof: "Tool loops, structured outputs, hard gates, human escalation, failure capture and context-aware public-service prototypes.", href: "#workflow" },
  { label: "0→1 ownership", state: "credible", proof: "Founder background plus independent discovery, design, implementation, deployment and iteration across the Human Systems Lab.", href: "/lab" },
  { label: "Product data", state: "building", proof: "Event schemas, value cases and testable metrics exist; deeper SQL funnel and cohort evidence is the next proof to add.", href: "/impact-eval#value" },
  { label: "n8n product depth", state: "building", proof: "A working importable workflow is prepared; an executed n8n Cloud workflow and screenshot must still be produced before submission.", href: "#workflow" },
];

const motivation = `The sentence that the future of software lives between deterministic workflows, AI agents, and human judgment is the clearest description of how I want to build. My recent Impact Eval Suite encodes hard access and safety gates, routes ambiguous cases toward human review, and turns failures into reusable fixtures. n8n is where that product judgment can become a platform capability for hundreds of thousands of builders. I am especially drawn to AI Trust: making behavior inspectable, debuggable, and safe enough to move from a compelling demo to reliable production use.`;

const projectAnswer = `I recently built Human Systems Lab, a public portfolio of working systems prototypes. Its Impact Eval Suite compares a helpful-sounding AI baseline with a safer redesign across multilingual public-service cases. Deterministic access and safety gates block release even when the average score looks good; failed cases become regression fixtures, and a value workbench connects product behavior to time saved, successful actions, equity, and cost. For this application I also designed an importable n8n workflow that receives eval results, scores hard gates, branches to a bounded release or human review, and returns an inspectable decision. The site, code, tests, and workflow JSON are public.`;

function track(event: string, detail = "") {
  navigator.sendBeacon("/api/event", new Blob([JSON.stringify({ event, detail })], { type: "application/json" }));
}

export default function N8nFitPage() {
  const [workstream, setWorkstream] = useState<"trust" | "builder">("trust");
  const [copied, setCopied] = useState("");
  useEffect(() => { track("role_fit_view", "n8n-ai-pm"); }, []);

  async function copy(label: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1700);
    track("role_fit_copy", `n8n-${label}`);
  }

  async function share() {
    const data = { title: "Michael Ninh × n8n — AI Product Manager", text: "Evidence-backed fit for n8n's AI Product Manager role.", url: window.location.href };
    if (navigator.share) await navigator.share(data); else await navigator.clipboard.writeText(data.url);
    setCopied("share"); window.setTimeout(() => setCopied(""), 1700); track("role_fit_share", "n8n-ai-pm");
  }

  return <main className="role-page n8n-fit">
    <header className="role-nav"><Link href="/fit/n8n-ai-product-manager" className="role-brand"><span>MN</span> MICHAEL NINH × n8n</Link><nav><a href="#fit">Fit</a><a href="#workflow">Workflow</a><a href="#answers">Application answers</a><a href="#plan">Proof plan</a></nav><button onClick={share}>{copied === "share" ? "Copied ✓" : "Share ↗"}</button></header>

    <section className="role-hero">
      <div><p className="role-kicker">AI PRODUCT MANAGER · AI TRUST · BERLIN / REMOTE</p><h1>AI should be<br /><em>inspectable</em><br />before impressive.</h1><p>I turn ambiguous AI ideas into understandable products, explicit behavior tests, human decision points and learning loops. My strongest fit is the layer between deterministic workflows, agents and human judgment.</p><div className="role-actions"><a href="#workflow">Inspect the n8n workflow <span>→</span></a><a href="/impact-eval">Run my eval suite</a></div></div>
      <aside><div><span>FIT THESIS</span><b>HIGH-SLOPE BUILDER</b></div><h2>Strong early-career fit for <em>AI Trust</em>.</h2><ul><li><b>04</b><span>strong proof areas</span></li><li><b>02</b><span>credible adjacent areas</span></li><li><b>02</b><span>proofs to finish</span></li></ul><p>No invented production scale. The case is public craft, practical eval depth, unusual product judgment and the speed to close gaps.</p></aside>
    </section>

    <section className="role-why"><p>WHY THIS ROLE</p><blockquote>“The wonderfully weird space between deterministic workflows, AI agents, and human judgment.”</blockquote><div><span>That is not just language I agree with.</span><b>It is already how I design systems.</b></div></section>

    <section className="role-workstream">
      <div className="role-section-head"><div><p className="role-kicker">01 · Product direction</p><h2>Where I would create value first.</h2></div><p>Both workstreams interest me. AI Trust is the sharper entry point because I already have working proof; the builder experience is the direction I would grow into.</p></div>
      <div className="role-stream-tabs"><button className={workstream === "trust" ? "active" : ""} onClick={() => setWorkstream("trust")}><span>01</span><b>AI Trust</b><small>recommended starting point</small></button><button className={workstream === "builder" ? "active" : ""} onClick={() => setWorkstream("builder")}><span>02</span><b>AI Building</b><small>next growth surface</small></button></div>
      {workstream === "trust" ? <div className="role-stream-detail"><div><p>MISSION</p><h3>Make AI behavior inspectable enough to trust.</h3></div><ul><li><span>Evals</span><p>Define useful behavior as reproducible cases and gates.</p></li><li><span>Observability</span><p>Expose why a workflow passed, failed or escalated.</p></li><li><span>Human judgment</span><p>Route ambiguity and consequential decisions explicitly.</p></li><li><span>Learning loop</span><p>Turn real failures into regression fixtures.</p></li></ul></div> : <div className="role-stream-detail"><div><p>MISSION</p><h3>Let AI build with the user, not disappear behind magic.</h3></div><ul><li><span>Intent</span><p>Translate a fuzzy goal into a visible plan before acting.</p></li><li><span>Scaffolding</span><p>Keep context, tools and state understandable.</p></li><li><span>Progressive control</span><p>Move from suggestion to preview to authorized action.</p></li><li><span>Teachability</span><p>Help users understand and edit what the agent built.</p></li></ul></div>}
    </section>

    <section className="role-fit-section" id="fit"><div className="role-section-head"><div><p className="role-kicker">02 · Requirement map</p><h2>Claim → proof → honest boundary.</h2></div><p>I do not present prototypes as production adoption. I present exactly what exists, what it demonstrates, and what I would validate next.</p></div><div className="fit-grid">{requirements.map((item, index) => <a key={item.label} href={item.href}><div><span>0{index + 1}</span><b className={item.state}>{item.state}</b></div><h3>{item.label}</h3><p>{item.proof}</p><strong>Inspect proof →</strong></a>)}</div></section>

    <section className="n8n-workflow" id="workflow"><div className="role-section-head light"><div><p className="role-kicker">03 · Built for this application</p><h2>An importable AI release gate.</h2></div><p>This n8n workflow needs no external credentials. A webhook accepts case-level eval results, a Code node scores hard gates, and an IF node routes to bounded release or human review.</p></div><div className="workflow-canvas"><div className="workflow-line"><article className="trigger"><span>WEBHOOK</span><b>Receive evaluation</b><small>POST /impact-eval-release-gate</small></article><i>→</i><article className="code"><span>CODE</span><b>Score hard gates</b><small>access · safety · ambiguity</small></article><i>→</i><article className="if"><span>IF</span><b>Safety + access pass?</b><small>no averages override harm</small></article></div><div className="workflow-branches"><div><span>TRUE ↗</span><article><b>Ready for bounded pilot</b><small>release one cohort + monitor</small></article><i>→</i><article><b>Return 200</b><small>inspectable decision</small></article></div><div><span>FALSE ↘</span><article className="danger"><b>Hold + human review</b><small>capture failed cases</small></article><i>→</i><article className="danger"><b>Return 409</b><small>do not silently ship</small></article></div></div></div><div className="workflow-actions"><a href="/n8n-impact-eval-workflow.json" download onClick={() => track("role_asset_download", "n8n-workflow")}>Download workflow JSON ↓</a><Link href="/impact-eval#suite">See the eval it operationalizes →</Link><p><b>Before submission:</b> import into n8n Cloud, execute both branches, and upload the real n8n canvas screenshot requested in the form.</p></div></section>

    <section className="role-answers" id="answers"><div className="role-section-head"><div><p className="role-kicker">04 · Application narrative</p><h2>Ready to adapt, not blindly paste.</h2></div><p>The language is concise enough for the form and specific enough to survive follow-up questions because every major claim links to working evidence.</p></div><div className="answer-grid"><article><div><span>MOTIVATION</span><button onClick={() => copy("motivation", motivation)}>{copied === "motivation" ? "Copied ✓" : "Copy answer"}</button></div><h3>What caught your attention?</h3><p>{motivation}</p></article><article><div><span>RECENT SIDE PROJECT</span><button onClick={() => copy("project", projectAnswer)}>{copied === "project" ? "Copied ✓" : "Copy answer"}</button></div><h3>What did you build?</h3><p>{projectAnswer}</p></article></div></section>

    <section className="role-proof-plan" id="plan"><div><p className="role-kicker">05 · Before submit</p><h2>Close the two gaps that matter most.</h2></div><ol><li><span>01</span><div><b>Run the workflow in n8n Cloud</b><p>Import the JSON, execute PASS and HOLD payloads, save the workflow and take the requested screenshot.</p></div><strong>60–90 min</strong></li><li><span>02</span><div><b>Add one real user signal</b><p>Ask three builders to inspect the release decision and record where the workflow is unclear.</p></div><strong>1 day</strong></li><li><span>03</span><div><b>Prepare the production failure story</b><p>Use one real prototype failure: what broke, how it was detected, and which fixture now prevents recurrence.</p></div><strong>30 min</strong></li><li><span>04</span><div><b>Verify vacancy status</b><p>The supplied posting lists 30 May 2026 as its deadline. Confirm that this application form is still actively reviewed before using the 15-day application window.</p></div><strong>Critical</strong></li></ol></section>

    <section className="role-close"><p>THE VALUE I BRING</p><blockquote>I learn by making ambiguity visible — then turning it into a product people can inspect, trust and improve.</blockquote><div><a href="mailto:hallo.chupi@gmail.com">hallo.chupi@gmail.com</a><a href="https://github.com/mikelninh/human-systems-lab" target="_blank" rel="noreferrer">GitHub ↗</a><Link href="/projects">All public builds →</Link></div></section>
    <footer className="role-footer"><Link href="/fit/n8n-ai-product-manager" className="role-brand"><span>MN</span> MICHAEL NINH × n8n</Link><p>Built as a role-specific product proof · Berlin · 2026</p><Link href="/fit/deepset-value-engineer">deepset Value Engineer case →</Link></footer>
  </main>;
}

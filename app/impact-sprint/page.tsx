"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

type Goal = "donations" | "members" | "volunteers" | "admin";
type Role = "buyer" | "nomination";

const goals: Record<Goal, { label: string; outcome: string; before: string; after: string; metric: string }> = {
  donations: { label: "Mehr Spenden", outcome: "eine fokussierte Spendenseite, ein klares Angebot und drei Follow-ups", before: "Menschen finden die Organisation gut – und gehen wieder.", after: "Ein klarer Weg führt von Interesse zu einer konkreten Spende.", metric: "Spenden-Conversion" },
  members: { label: "Mehr Mitglieder", outcome: "einen Mitglieder-Funnel mit Einladung, Nutzen und einfachem Onboarding", before: "Mitgliedschaft klingt wichtig, aber abstrakt und aufwendig.", after: "Interessierte verstehen Wert, Beitrag und nächsten Schritt sofort.", metric: "Mitgliedsanträge" },
  volunteers: { label: "Mehr Volunteers", outcome: "einen Volunteer-Weg von Interesse über Matching bis zum ersten Termin", before: "Helfen wollen viele. Der Einstieg bleibt unklar.", after: "Rolle, Zeitaufwand und erster Termin sind in wenigen Minuten klar.", metric: "Qualifizierte Bewerbungen" },
  admin: { label: "Weniger Verwaltung", outcome: "einen strukturierten Intake mit automatischen nächsten Schritten und sauberer Übergabe", before: "Das Team beantwortet dieselben Fragen jede Woche manuell.", after: "Gute Informationen kommen vollständig an; Menschen wissen, wie es weitergeht.", metric: "Stunden pro Woche" },
};

function track(event: string, detail = "") {
  navigator.sendBeacon("/api/event", new Blob([JSON.stringify({ event, detail })], { type: "application/json" }));
}

export default function ImpactSprintPage() {
  const [goal, setGoal] = useState<Goal>("donations");
  const [role, setRole] = useState<Role | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const selected = useMemo(() => goals[goal], [goal]);

  useEffect(() => { document.title = "Impact Sprint — mehr Wirkung in 72 Stunden"; track("sprint_view", "direct"); }, []);

  function openForm(nextRole: Role) {
    setRole(nextRole); setStatus("idle"); track("sprint_form_opened", nextRole);
    window.setTimeout(() => document.getElementById("is-form")?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!role) return; setStatus("sending"); const form = new FormData(event.currentTarget);
    const response = await fetch("/api/pilot", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ project: "impact-sprint", role, name: form.get("name"), email: form.get("email"), organisation: form.get("organisation"), choice: goal, message: form.get("message"), locale: "de", website: form.get("website") }) });
    setStatus(response.ok ? "success" : "error"); if (response.ok) track("sprint_lead", `${role}:${goal}`);
  }

  async function share() {
    const data = { title: "Impact Sprint", text: "Ein testbarer Funnel für eine soziale Organisation – in 72 Stunden.", url: window.location.href };
    if (navigator.share) await navigator.share(data); else await navigator.clipboard.writeText(data.url);
    track("share_clicked", "impact-sprint");
  }

  return <main className="is-page">
    <header className="is-nav"><Link href="/impact-sprint" className="is-brand"><span>↗</span> IMPACT SPRINT</Link><nav><a href="#offer">Angebot</a><a href="#proof">Messung</a><a href="#price">Preis</a><Link href="/projects">Prototypen</Link></nav><button onClick={() => openForm("buyer")}>Pilot anfragen →</button></header>

    <section className="is-hero">
      <div className="is-hero-copy"><p className="is-kicker"><i/> 72 Stunden · ein Engpass · ein echter Test</p><h1>Mehr Wirkung.<br/><em>Weniger Warten.</em></h1><p>Wir bauen einer sozialen Organisation einen klaren digitalen Weg zu mehr Spenden, Mitgliedern oder Volunteers – und messen, ob er tatsächlich genutzt wird.</p><div className="is-actions"><button onClick={() => openForm("buyer")}>Pilot für 750 € anfragen <span>→</span></button><button onClick={() => openForm("nomination")}>Organisation nominieren</button></div><div className="is-trust"><span>FESTPREIS</span><span>TESTFÄHIG IN 72H</span><span>SYSTEM BLEIBT BEI DER NGO</span></div></div>
      <div className="is-scorecard"><div className="is-score-top"><span>LIVE PILOT</span><b>03 / 03 TAGE</b></div><div className="is-score-main"><small>GEWÄHLTES ZIEL</small><h2>{selected.label}</h2><p>Wir bauen {selected.outcome}.</p></div><div className="is-score-grid"><div><small>VORHER</small><strong>?</strong><span>unklarer Ausgangspunkt</span></div><div className="active"><small>MESSGRÖSSE</small><strong>↗</strong><span>{selected.metric}</span></div></div><div className="is-score-foot"><span>Observe</span><i>→</i><span>Build</span><i>→</i><b>Measure</b></div></div>
    </section>

    <section className="is-selector" id="offer"><div><p className="is-kicker">Wähle den Engpass</p><h2>Was soll nach 72 Stunden besser funktionieren?</h2></div><div className="is-goals">{(Object.keys(goals) as Goal[]).map((id, index) => <button key={id} className={goal === id ? "active" : ""} onClick={() => { setGoal(id); track("sprint_goal_selected", id); }}><span>0{index + 1}</span><b>{goals[id].label}</b><small>{goals[id].metric}</small></button>)}</div><div className="is-plan"><div><small>DER 72H-PLAN</small><h3>{selected.label}</h3><p>{selected.outcome.charAt(0).toUpperCase() + selected.outcome.slice(1)}.</p></div><ul><li><span>0–6h</span>Engpass, Zielgruppe und Baseline</li><li><span>6–30h</span>Angebot, Seite und Conversion-Weg</li><li><span>30–54h</span>Formular, Follow-up und Messpunkte</li><li><span>54–72h</span>Launch, Übergabe und erster Test</li></ul><button onClick={() => openForm("buyer")}>Diesen Sprint anfragen →</button></div></section>

    <section className="is-before" id="proof"><div className="is-before-head"><p className="is-kicker">Vorher / Nachher</p><h2>Kein abstraktes „Digitalprojekt“.<br/>Eine beobachtbare Veränderung.</h2></div><div className="is-compare"><article><small>HEUTE · REIBUNG</small><p>{selected.before}</p><div className="is-funnel broken"><span>100 Besuche</span><i/><span>?</span><i/><b>kaum messbar</b></div></article><article className="after"><small>NACH DEM SPRINT · TEST</small><p>{selected.after}</p><div className="is-funnel"><span>100 Besuche</span><i/><span>12 Aktionen</span><i/><b>{selected.metric}</b></div></article></div><p className="is-proof-note">Die Zahlen sind ein Messbeispiel, kein Ergebnisversprechen. Vor dem Start definieren wir gemeinsam Baseline, Ziel und Abbruchkriterium.</p></section>

    <section className="is-delivery"><div><p className="is-kicker">Was bleibt</p><h2>Nach 72 Stunden besitzt die Organisation ein nutzbares System.</h2></div><div className="is-delivery-grid"><article><span>01</span><h3>Klares Angebot</h3><p>Eine Botschaft, die Problem, Nutzen und nächsten Schritt verständlich macht.</p></article><article><span>02</span><h3>Conversion-Seite</h3><p>Responsive Landingpage und Formular, passend zur wichtigsten Zielgruppe.</p></article><article><span>03</span><h3>Follow-up</h3><p>Bestätigung und nächste Schritte, damit Interesse nicht im Postfach endet.</p></article><article><span>04</span><h3>Impact Readout</h3><p>Einfaches Dashboard und eine ehrliche Entscheidung: stoppen, verbessern oder skalieren.</p></article></div></section>

    <section className="is-price" id="price"><div className="is-price-copy"><p className="is-kicker">Founding Pilot</p><h2>Ein kleiner Einsatz.<br/>Ein überprüfbares Ergebnis.</h2><p>Der Einstieg ist bewusst niedrig, damit eine Organisation nicht monatelang Budget beantragen muss. Förderer können den Pilot vollständig übernehmen.</p><button onClick={() => openForm("nomination")}>Organisation nominieren →</button></div><div className="is-price-card"><div><span>72H IMPACT SPRINT</span><b>FESTPREIS</b></div><strong>750 €</strong><p>inkl. Konzeption, Umsetzung, Übergabe und 7-Tage-Auswertung</p><ul><li>✓ Ein Ziel und eine Zielgruppe</li><li>✓ Eine testfähige Conversion-Strecke</li><li>✓ Datensparsame Erfolgsmessung</li><li>✓ Vollständige Übergabe</li></ul><button onClick={() => openForm("buyer")}>Pilot verbindlich anfragen →</button><small>Die Anfrage ist noch keine zahlungspflichtige Bestellung. Umfang und Ziel werden vorab bestätigt.</small></div></section>

    <section className="is-values"><blockquote>“People seeking essential support are not the customer. Institutions and funders pay for measurable public value.”</blockquote><div><span>KEINE DATENVERKÄUFE</span><span>KEINE PROZENTUALE SPENDENPROVISION</span><span>KEINE VERSTECKTE ABHÄNGIGKEIT</span></div></section>

    <section className={`is-form-section ${role ? "open" : ""}`} id="is-form">
      {!role ? <div><p className="is-kicker">Bereit für einen echten Test?</p><h2>Fördern oder eine Organisation nominieren.</h2><p>Ein Gespräch, ein klarer Engpass, danach ein ehrliches Go oder No-Go.</p><div><button onClick={() => openForm("buyer")}>Pilot anfragen →</button><button onClick={() => openForm("nomination")}>Organisation nominieren →</button></div></div> : status === "success" ? <div className="is-success"><span>✓</span><h2>Das Signal ist angekommen.</h2><p>Ich melde mich persönlich. Kein automatischer Sales-Zirkus.</p><button onClick={share}>Pilot teilen ↗</button></div> : <form onSubmit={submit}><div className="is-form-head"><div><p className="is-kicker">{role === "buyer" ? "750 € Founding Pilot" : "Organisation nominieren"}</p><h2>{role === "buyer" ? "Was soll in 72 Stunden besser funktionieren?" : "Wem könnte dieser Sprint sofort helfen?"}</h2></div><button type="button" onClick={() => setRole(null)}>×</button></div><div className="is-fields"><label>Name<input name="name" required /></label><label>E-Mail<input name="email" type="email" required /></label><label>Organisation<input name="organisation" required /></label><label className="wide">Kurzer Kontext<textarea name="message" rows={4} placeholder={role === "buyer" ? `Unser Engpass: ${selected.label.toLowerCase()} …` : "Warum diese Organisation?"}/></label><label className="honey">Website<input name="website" tabIndex={-1}/></label></div><div className="is-form-submit"><span>Ausgewähltes Ziel: <b>{selected.label}</b></span><button disabled={status === "sending"}>{status === "sending" ? "Wird gesendet …" : role === "buyer" ? "Pilot anfragen →" : "Nominierung senden →"}</button></div>{status === "error" && <p className="error">Noch nicht gespeichert. Bitte erneut versuchen.</p>}</form>}
    </section>
    <footer className="is-footer"><Link href="/impact-sprint" className="is-brand"><span>↗</span> IMPACT SPRINT</Link><p>Growth that funds good · Human Systems Lab</p><div><button onClick={share}>Teilen</button><Link href="/anspruch-direkt">Anspruch Direkt →</Link></div></footer>
  </main>;
}

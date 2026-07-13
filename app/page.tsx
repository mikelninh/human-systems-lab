"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type LeadRole = "sponsor" | "organisation";

const causes = ["Kinder & Bildung", "Tiere", "Pflege & Würde", "Wohnen & Nahrung", "Klima"];
const goals = ["Mehr Spenden", "Mehr Mitglieder", "Mehr Volunteers", "Weniger Verwaltung"];

export default function Home() {
  const [cause, setCause] = useState(causes[0]);
  const [goal, setGoal] = useState(goals[0]);
  const [role, setRole] = useState<LeadRole | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  function track(event: string, detail = "") {
    const payload = new Blob([JSON.stringify({ event, detail })], { type: "application/json" });
    navigator.sendBeacon("/api/event", payload);
  }

  useEffect(() => {
    const payload = new Blob([JSON.stringify({ event: "page_view", detail: document.referrer ? "referred" : "direct" })], { type: "application/json" });
    navigator.sendBeacon("/api/event", payload);
  }, []);

  const sprintLine = useMemo(() => {
    const map: Record<string, string> = {
      "Mehr Spenden": "eine fokussierte Spendenseite mit 3 Follow-ups",
      "Mehr Mitglieder": "einen Mitglieder-Funnel mit klarer Einladung",
      "Mehr Volunteers": "einen Volunteer-Funnel von Interesse bis Onboarding",
      "Weniger Verwaltung": "einen Intake-Flow mit Automatisierung und Übergabe",
    };
    return map[goal];
  }, [goal]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/interest", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        role,
        name: form.get("name"),
        email: form.get("email"),
        organisation: form.get("organisation"),
        budget: form.get("budget"),
        message: form.get("message"),
        website: form.get("website"),
        cause,
        interest: goal,
      }),
    });
    setStatus(response.ok ? "success" : "error");
    track(response.ok ? "lead_submitted" : "lead_error", role ?? "unknown");
  }

  function openForm(nextRole: LeadRole) {
    track("form_opened", nextRole);
    setRole(nextRole);
    setStatus("idle");
    window.setTimeout(() => document.getElementById("interest")?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top">IMPACT SPRINT</a>
        <nav aria-label="Hauptnavigation">
          <a href="#ablauf">So funktioniert’s</a>
          <a href="#partner">Für Stiftungen</a>
          <a href="#methode">Methode</a>
          <a href="#builder">Sprint bauen</a>
          <a href="/projects">Prototypen</a>
        </nav>
        <button className="header-cta" onClick={() => openForm("sponsor")}>Sprint finanzieren <span>→</span></button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">7-Tage Digital-Sprint für sozialen Wandel</p>
          <h1>Eine Woche finanzieren.<br /><em>Jahre Wirkung</em> freisetzen.</h1>
          <p className="lead">Sie finanzieren den Sprint. Eine soziale Organisation bekommt das System, um mehr Spender, Mitglieder, Volunteers und Menschen in Not zu erreichen.</p>
          <div className="hero-actions">
            <button className="button primary" onClick={() => openForm("sponsor")}>Impact Sprint finanzieren <span>ab 2.500 € →</span></button>
            <button className="button secondary" onClick={() => openForm("organisation")}>Organisation nominieren →</button>
          </div>
          <div className="trust-line"><span className="shield">✓</span> Ein Förderer <i>•</i> eine Organisation <i>•</i> ein messbares Ziel</div>
        </div>

        <div className="receipt" aria-label="Beispiel eines Impact Receipts">
          <div className="receipt-top">
            <span>IMPACT RECEIPT</span>
            <strong>✓ SPRINT BEREIT</strong>
          </div>
          <div className="receipt-row">
            <div><small>FÖRDERER</small><b>Sie oder Ihre Stiftung</b></div><strong>2.500 €+</strong>
          </div>
          <div className="receipt-flow"><span>7-TAGE IMPACT SPRINT</span><b>↓</b></div>
          <div className="receipt-row">
            <div><small>ORGANISATION</small><b>Ein soziales Team</b></div><span className="icon">♡</span>
          </div>
          <div className="receipt-row outcome">
            <div><small>MESSBARES ZIEL</small><b>{goal}</b><p>für {cause}</p></div><span className="icon">↗</span>
          </div>
          <div className="receipt-items">
            <span>◎<small>Klares<br />Angebot</small></span>
            <span>▣<small>Funnel &<br />Formular</small></span>
            <span>✉<small>Follow-up<br />Automation</small></span>
            <span>▤<small>Wirkungs-<br />bericht</small></span>
          </div>
        </div>
      </section>

      <section className="steps" id="ablauf">
        <article><span>01</span><h2>Fokus wählen</h2><p>Eine Organisation, ein Engpass, ein überprüfbares 30-Tage-Ziel.</p></article>
        <article><span>02</span><h2>In 7 Tagen bauen</h2><p>Angebot, Landingpage, Formular, Follow-ups und einfache Automatisierung.</p></article>
        <article><span>03</span><h2>Wirkung zeigen</h2><p>Vorher/Nachher-Score, echte Kennzahlen und ein transparenter nächster Schritt.</p></article>
      </section>

      <section className="manifesto" id="partner">
        <div>
          <p className="eyebrow">Von der Spende zur Fähigkeit</p>
          <h2>Nicht nur ein Projekt bezahlen. <em>Reichweite dauerhaft aufbauen.</em></h2>
        </div>
        <p>Geld hilft heute. Ein funktionierendes digitales System hilft einer Organisation jeden Monat wieder. Stiftungen, Family Offices, Unternehmen und private Förderer können so Kapital, Verantwortung und sichtbare Wirkung verbinden.</p>
      </section>

      <section className="partner-grid">
        <article><span>STIFTUNG / FAMILY OFFICE</span><h3>Eine Förderlinie schnell erproben</h3><p>Finanzieren Sie 1, 3 oder 10 Sprints und vergleichen Sie, welche digitalen Hebel bei Ihren Partnerorganisationen wirken.</p></article>
        <article><span>UNTERNEHMEN / CSR</span><h3>Engagement greifbar machen</h3><p>Ein klarer Sprint, passend zu Ihrem Wirkungsfeld – mit Ergebnis statt abstraktem Sponsoring.</p></article>
        <article><span>PRIVATE FÖRDERER</span><h3>Verantwortung persönlich übernehmen</h3><p>Wählen Sie ein Thema, nominieren Sie eine Organisation und finanzieren Sie einen sichtbaren Fortschritt.</p></article>
      </section>

      <section className="method" id="methode">
        <div className="method-statement">
          <p className="eyebrow">Michael Ninh · Systems for human progress</p>
          <h2>I examine the systems people depend on, find where they fail, and redesign them to work better for everyone.</h2>
          <p>Ich verbinde Systemdenken, AI, Produktdesign und Umsetzung. Nicht nur analysieren – kleine, reale Verbesserungen bauen und mit Menschen testen.</p>
        </div>
        <ol className="method-steps">
          <li><span>01</span><div><b>Observe</b><p>Menschen, Anreize und Reibung im bestehenden System verstehen.</p></div></li>
          <li><span>02</span><div><b>Diagnose</b><p>Den Engpass finden, der Wirkung, Zugang oder Vertrauen blockiert.</p></div></li>
          <li><span>03</span><div><b>Redesign</b><p>Eine fairere und einfachere Intervention entwerfen.</p></div></li>
          <li><span>04</span><div><b>Test</b><p>Den kleinsten echten Versuch bauen und Verhalten messen.</p></div></li>
          <li><span>05</span><div><b>Scale</b><p>Nur das verstärken, was nachweislich Menschen besser dient.</p></div></li>
        </ol>
        <div className="method-links"><a className="method-link" href="/lab">Human Systems Lab öffnen →</a><a className="method-link" href="/projects">Alle Prototypen testen →</a></div>
      </section>

      <section className="builder" id="builder">
        <div className="builder-intro">
          <p className="eyebrow">Sprint Builder</p>
          <h2>Was soll nach sieben Tagen besser funktionieren?</h2>
          <p>Ein kleiner, klarer Test. Keine leeren Wirkungsversprechen.</p>
        </div>
        <div className="builder-panel">
          <label>1 / Wirkungsfeld</label>
          <div className="chips">{causes.map(item => <button key={item} onClick={() => { setCause(item); track("cause_selected", item); }} className={cause === item ? "active" : ""}>{item}</button>)}</div>
          <label>2 / Wichtigster Engpass</label>
          <div className="chips">{goals.map(item => <button key={item} onClick={() => { setGoal(item); track("goal_selected", item); }} className={goal === item ? "active" : ""}>{item}</button>)}</div>
          <div className="plan">
            <small>IHR PILOT</small>
            <h3>{cause}: {goal}</h3>
            <p>Wir bauen {sprintLine}, messen den Ausgangspunkt und übergeben einen 30-Tage-Plan.</p>
            <div><strong>7 Tage</strong><strong>ab 2.500 €</strong></div>
          </div>
          <button className="button primary full" onClick={() => openForm("sponsor")}>Diesen Pilot besprechen →</button>
        </div>
      </section>

      <section className="example">
        <div><p className="eyebrow">Beispiel, kein Versprechen</p><h2>Vom wiederholten Aufwand zum nutzbaren System.</h2></div>
        <div className="example-flow"><p><small>HEUTE</small>Ein Tierheim beantwortet dieselben Adoptionsfragen jede Woche manuell.</p><span>→</span><p><small>SPRINT</small>Infoseite, Bewerbungsformular und automatische nächsten Schritte.</p><span>→</span><p><small>MESSZIEL</small>4 Stunden weniger Verwaltung pro Woche und mehr vollständige Anfragen.</p></div>
      </section>

      <section className="pricing">
        <div><p className="eyebrow">Einfach starten</p><h2>Ein Pilot. Dann nur skalieren, wenn er trägt.</h2></div>
        <div className="price-cards">
          <article><small>1 ORGANISATION</small><strong>2.500 €</strong><p>Ein fokussierter 7-Tage-Sprint</p></article>
          <article className="featured"><small>3 ORGANISATIONEN</small><strong>7.000 €</strong><p>Drei Piloten, gemeinsamer Vergleich</p></article>
          <article><small>10 ORGANISATIONEN</small><strong>18.000 €</strong><p>Ein kleines Wirkungsportfolio</p></article>
        </div>
      </section>

      <section className={`interest ${role ? "open" : ""}`} id="interest">
        {!role ? (
          <div className="interest-prompt"><p className="eyebrow">Bereit für einen echten Test?</p><h2>Fördern oder eine Organisation nominieren.</h2><div><button className="button primary" onClick={() => openForm("sponsor")}>Ich möchte fördern →</button><button className="button secondary" onClick={() => openForm("organisation")}>Organisation nominieren →</button></div></div>
        ) : status === "success" ? (
          <div className="success"><span>✓</span><h2>Danke. Das ist echtes Interesse.</h2><p>Ich melde mich persönlich mit den nächsten sinnvollen Fragen – ohne automatischen Sales-Zirkus.</p></div>
        ) : (
          <form onSubmit={submit}>
            <div className="form-head"><div><p className="eyebrow">{role === "sponsor" ? "Impact Sprint fördern" : "Organisation nominieren"}</p><h2>{role === "sponsor" ? "Welchen Wandel möchten Sie ermöglichen?" : "Wo würde ein gutes System helfen?"}</h2></div><button type="button" onClick={() => setRole(null)} aria-label="Formular schließen">×</button></div>
            <div className="form-grid">
              <label>Name<input name="name" required /></label>
              <label>E-Mail<input name="email" type="email" required /></label>
              <label>Organisation<input name="organisation" /></label>
              <label>{role === "sponsor" ? "Möglicher Rahmen" : "Dringlichkeit"}<select name="budget" defaultValue=""><option value="" disabled>Bitte wählen</option>{role === "sponsor" ? <><option>2.500 € / 1 Sprint</option><option>7.000 € / 3 Sprints</option><option>18.000 € / 10 Sprints</option><option>Erst kennenlernen</option></> : <><option>Jetzt testen</option><option>In 1–3 Monaten</option><option>Nur Idee</option></>}</select></label>
              <label className="wide">Was sollten wir wissen?<textarea name="message" rows={4} /></label>
              <label className="honey">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
            </div>
            <button className="button primary" disabled={status === "sending"}>{status === "sending" ? "Wird gesendet …" : "Interesse senden →"}</button>
            {status === "error" && <p className="error">Das hat noch nicht geklappt. Bitte kurz erneut versuchen.</p>}
          </form>
        )}
      </section>

      <footer><a className="wordmark" href="#top">IMPACT SPRINT</a><p>Case Study #01 · Redesigning systems for human progress.</p><a href="#interest">Kontakt</a></footer>
    </main>
  );
}

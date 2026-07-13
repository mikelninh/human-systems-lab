"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

const levels = [
  ["01", "Self", "Körper, Aufmerksamkeit, Entscheidungen"],
  ["02", "Relationship", "Familie, Freundschaft, Fürsorge"],
  ["03", "Community", "Kiez, Schule, Verein, Netzwerke"],
  ["04", "Organisation", "Unternehmen, NGO, Verwaltung"],
  ["05", "City & Region", "Berlin, Infrastruktur, Wohnen"],
  ["06", "Nation", "Deutschland, Steuern, Sozialstaat"],
  ["07", "Europe", "EU-Rechte, Märkte, Migration"],
  ["08", "Planet", "Klima, Frieden, globale Ressourcen"],
];

const stories = [
  { place: "Finnland", title: "Housing First", result: "Erst eine dauerhafte Wohnung, dann freiwillige Unterstützung – statt Hilfe an vorherige Stabilität zu knüpfen.", lesson: "Die Reihenfolge eines Systems kann wichtiger sein als mehr Angebote.", href: "https://www.oecd.org/en/publications/housing-first-how-finland-is-ending-homelessness_aa39e88f-en.html" },
  { place: "Taiwan", title: "Digitale Demokratie", result: "Pol.is, vTaiwan und Join machen Übereinstimmung sichtbar und zwingen relevante Petitionen in öffentliche Antworten.", lesson: "Technologie kann Konflikt in gemeinsame Muster übersetzen.", href: "https://pdis.nat.gov.tw/en/blog/%E6%95%B8%E4%BD%8D%E6%B0%91%E4%B8%BB%E5%9C%A8%E8%87%BA%E7%81%A3/" },
  { place: "Kanada", title: "Child Benefit", result: "Eine direkte, einkommensabhängige Familienleistung senkte Kinderarmut deutlich; spätere Rückschritte zeigen zugleich die Grenzen einzelner Maßnahmen.", lesson: "Einfacher Zugang und automatische Transfers wirken – müssen aber resilient sein.", href: "https://www.canada.ca/en/employment-social-development/programs/poverty-reduction/national-advisory-council/reports/2025-annual.html" },
  { place: "Estland", title: "X-Road", result: "Eine sichere Datenaustauschschicht verbindet öffentliche und private Dienste, statt für jeden Antrag neue Datensilos zu bauen.", lesson: "Gemeinsame Infrastruktur schlägt hundert isolierte Apps.", href: "https://e-estonia.com/solutions/interoperability-services/x-road/" },
];

const pilots = [
  { rank: "01", title: "Berlin Education Bridge", impact: 5, cost: 2, speed: "10 Tage", mvp: "Ein mehrsprachiger Wegweiser plus Übergabe-Flow für eine konkrete Zielgruppe und fünf reale Familien.", money: "Stiftung oder Bezirk finanziert den Pilot; kostenlos für Familien." },
  { rank: "02", title: "Impact Sprint", impact: 4, cost: 1, speed: "Live", mvp: "Eine Organisation, ein digitaler Engpass, ein messbares 30-Tage-Ziel.", money: "2.500 € pro gefördertem Sprint." },
  { rank: "03", title: "Fairness Compass", impact: 4, cost: 1, speed: "Jetzt", mvp: "Verteilung verändern, Begründung abgeben und Dissens sichtbar machen.", money: "Workshops, Forschung und Beteiligungsformate – öffentlich frei zugänglich." },
  { rank: "04", title: "Public-Service Friction Map", impact: 5, cost: 3, speed: "4 Wochen", mvp: "Einen Berliner Verwaltungsprozess Schritt für Schritt mit Abbrüchen und Wartezeit kartieren.", money: "Öffentliche Aufträge oder Stiftungsförderung; keine Gebühren für Bürger:innen." },
  { rank: "05", title: "Success Pattern Library", impact: 3, cost: 2, speed: "3 Wochen", mvp: "20 belegte Systemverbesserungen als übertragbare Pattern Cards.", money: "Kostenloser Kern; bezahlte Briefings und Umsetzungspartnerschaften." },
];

export default function LabPage() {
  const [bottom, setBottom] = useState(15);
  const [top, setTop] = useState(40);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const middle = 100 - bottom - top;

  useEffect(() => {
    navigator.sendBeacon("/api/event", new Blob([JSON.stringify({ event: "lab_view", detail: "human-systems" })], { type: "application/json" }));
  }, []);

  const paths = useMemo(() => {
    const point = (x: number, y: number) => `${42 + x * 5.55},${326 - y * 2.75}`;
    return {
      equal: [[0,0],[50,50],[90,90],[100,100]].map(([x,y]) => point(x,y)).join(" "),
      current: [[0,0],[50,1],[90,44],[100,100]].map(([x,y]) => point(x,y)).join(" "),
      proposal: [[0,0],[50,bottom],[90,bottom + middle],[100,100]].map(([x,y]) => point(x,y)).join(" "),
    };
  }, [bottom, middle]);

  function updateBottom(value: number) { if (100 - value - top >= 5) setBottom(value); }
  function updateTop(value: number) { if (100 - bottom - value >= 5) setTop(value); }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus("sending");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/fairness-feedback", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({
      bottom, middle, top, stance: form.get("stance"), comment: form.get("comment"), email: form.get("email"), website: form.get("website")
    }) });
    setStatus(response.ok ? "done" : "error");
  }

  return <main className="lab-page">
    <header className="lab-header"><Link href="/lab" className="wordmark">HUMAN SYSTEMS LAB</Link><nav><a href="#levels">Ebenen</a><a href="#fairness">Fairness</a><a href="#pilots">Piloten</a><Link href="/projects">Prototypen</Link></nav><Link className="lab-back" href="/">Impact Sprint ↗</Link></header>
    <section className="lab-hero">
      <p className="eyebrow">A working portfolio by Michael Ninh</p>
      <h1>I examine the systems people depend on, <em>find where they fail</em>, and redesign them to work better for everyone.</h1>
      <div className="lab-hero-bottom"><p>Von Familie bis Weltpolitik: Wir behandeln Gesellschaft als verschachtelte, lernende Systeme – mit Würde, Evidenz und menschlicher Entscheidungshoheit.</p><div><span>OBSERVE</span><span>DIAGNOSE</span><span>REDESIGN</span><span>TEST</span><span>SCALE</span></div></div>
    </section>
    <section className="lab-levels" id="levels">
      <div className="section-heading"><p className="eyebrow">Acht Arbeitsebenen</p><h2>Kein Problem lebt nur auf einer Ebene.</h2><p>Eine Familie erlebt die Konsequenz. Eine Organisation formt den Zugang. Gesetze setzen Anreize. Märkte und Plattformen verbinden alle Ebenen.</p></div>
      <div className="level-grid">{levels.map(([n,title,text]) => <article key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
    </section>
    <section className="loop-section">
      <div><p className="eyebrow">Technology with boundaries</p><h2>AI beschleunigt das Lernen. Menschen behalten die Macht.</h2></div>
      <div className="loop-grid">
        <article><b>Listener Agent</b><p>Sammelt freiwilliges Feedback und wiederkehrende Reibung.</p></article><article><b>Evidence Agent</b><p>Prüft Quellen, vergleicht Länder und markiert Unsicherheit.</p></article><article><b>Red-Team Agent</b><p>Sucht Nebenwirkungen, Missbrauch und ausgeschlossene Gruppen.</p></article><article><b>Learning Loop</b><p>Messung → Reflexion → Anpassung. Keine automatische Politikentscheidung.</p></article>
      </div><p className="guardrail">Leitplanken: Quellenpflicht · Datenschutz · Opt-out · öffentliche Annahmen · menschliches Vetorecht · unabhängige Evaluation.</p>
    </section>
    <section className="fairness" id="fairness">
      <div className="section-heading"><p className="eyebrow">Fairness Compass · Diskussionsvorschlag</p><h2>Wie viel Konzentration ist mit gleicher Würde vereinbar?</h2><p>Die Kurve ist kein Naturgesetz. Sie macht eine normative Annahme sichtbar, veränderbar und kritisierbar.</p></div>
      <div className="fairness-grid">
        <div className="curve-card"><div className="curve-legend"><span className="current">Deutschland, vereinfacht</span><span className="proposal">Dein Vorschlag</span><span className="equal">Vollständige Gleichverteilung</span></div>
          <svg viewBox="0 0 640 360" role="img" aria-label="Vereinfachte Lorenzkurve für Vermögensverteilung">{[0,25,50,75,100].map(v => <g key={v}><line x1="42" x2="597" y1={326-v*2.75} y2={326-v*2.75} className="gridline"/><text x="8" y={330-v*2.75}>{v}%</text></g>)}<polyline points={paths.equal} className="line equal"/><polyline points={paths.current} className="line current"/><polyline points={paths.proposal} className="line proposal"/><text x="250" y="354">Kumulierte Haushalte →</text></svg>
          <p className="chart-note">Vereinfachung mit drei Gruppen. Aktuell: untere 50 % ≈ 1 %, mittlere 40 % ≈ 43 %, obere 10 % ≈ 56 %. Unterschiedliche Datensätze und Vermögensbegriffe können abweichen.</p></div>
        <div className="sliders"><div><label>Untere 50 % <strong>{bottom}%</strong></label><input type="range" min="1" max="35" value={bottom} onChange={e => updateBottom(Number(e.target.value))}/></div><div><label>Mittlere 40 % <strong>{middle}%</strong></label><div className="middle-meter"><span style={{width:`${middle}%`}}/></div></div><div><label>Obere 10 % <strong>{top}%</strong></label><input type="range" min="20" max="75" value={top} onChange={e => updateTop(Number(e.target.value))}/></div><div className="fair-principles"><p><b>Sicherheit:</b> Niemand fällt unter ein würdevolles Minimum.</p><p><b>Mobilität:</b> Herkunft bestimmt nicht Zukunft.</p><p><b>Freiheit:</b> Wohlstand bleibt möglich.</p><p><b>Keine Dominanz:</b> Vermögen darf Demokratie nicht kaufen.</p></div></div>
      </div>
      <div className="discussion">{status === "done" ? <div className="success"><span>✓</span><h2>Dein Widerspruch gehört zum Modell.</h2><p>Danke – ein Fairnessvorschlag wird besser, wenn seine Annahmen offen kritisiert werden.</p></div> : <form onSubmit={submit}><div><p className="eyebrow">Open for disagreement</p><h2>Wie fühlt sich {bottom} / {middle} / {top} für dich an?</h2></div><div className="discussion-fields"><label>Deine Einschätzung<select name="stance" required defaultValue=""><option value="" disabled>Bitte wählen</option><option>Guter Ausgangspunkt</option><option>Noch zu ungleich</option><option>Zu stark umverteilt</option><option>Falsche Messgröße</option></select></label><label>Warum?<textarea name="comment" required rows={4}/></label><label>E-Mail, wenn du weiterdiskutieren willst<input type="email" name="email"/></label><label className="honey">Website<input name="website"/></label><button className="button primary" disabled={status==="sending"}>{status === "sending" ? "Wird gespeichert …" : "Perspektive beitragen →"}</button>{status==="error"&&<p className="error">Das hat nicht geklappt. Bitte erneut versuchen.</p>}</div></form>}</div>
    </section>
    <section className="pilot-section" id="pilots"><div className="section-heading"><p className="eyebrow">Ranked by impact × speed ÷ cost</p><h2>Wo wir praktisch beginnen.</h2><p>Monetarisierung folgt der Regel: Institutionen mit Budget zahlen; Betroffene behalten kostenlosen Zugang und Kontrolle.</p></div><div className="pilot-list">{pilots.map(p => <article key={p.rank}><span>{p.rank}</span><div><h3>{p.title}</h3><p>{p.mvp}</p><small>{p.money}</small></div><div className="pilot-score"><b>Impact {p.impact}/5</b><b>Cost {p.cost}/5</b><b>MVP {p.speed}</b></div></article>)}</div><div className="start-now"><p className="eyebrow">Start now</p><h2>Impact Sprint finanzieren. Berlin Education Bridge mit einer Praxispartnerin co-designen.</h2><p>Das erste schafft Einkommen und Organisationszugang. Das zweite testet deine eigentliche Systemkompetenz an einem realen Bildungsengpass.</p><Link className="button primary" href="/#interest">Pilotpartner werden →</Link></div></section>
    <section className="story-section" id="stories"><div className="section-heading"><p className="eyebrow">Success stories, not slogans</p><h2>Systeme wurden schon besser. Wir lernen die übertragbaren Muster.</h2></div><div className="story-grid">{stories.map(s => <a href={s.href} target="_blank" rel="noreferrer" key={s.title}><small>{s.place}</small><h3>{s.title}</h3><p>{s.result}</p><strong>{s.lesson}</strong><span>Quelle öffnen ↗</span></a>)}</div></section>
    <footer><Link className="wordmark" href="/lab">HUMAN SYSTEMS LAB</Link><p>Case studies: Food systems · Nonprofit capacity · Wealth & fairness · Education access</p><Link href="/">Impact Sprint</Link></footer>
  </main>;
}

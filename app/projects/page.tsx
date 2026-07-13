"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const projects = [
  { title: "Gemeinsam Berlin", type: "Demokratie", status: "Live test", text: "Mehrsprachige Beteiligung, echte Gruppen-Aggregate und sichtbarer Konsens – ohne Kommentarspalte.", href: "/gemeinsam", partner: "Verwaltung · Demokratie · Stiftung" },
  { title: "OnceDE Familienstart", type: "Public Service", status: "Live demo", text: "Einwilligung, sichere Vorausfüllung, Widerruf und nachvollziehbare Datenzugriffe mit fiktiven Registern.", href: "/once-only", partner: "Verwaltung · Sozialberatung · GovTech" },
  { title: "Human Systems Lab", type: "Portfolio", status: "Live", text: "Methode, Systemebenen, Pilotportfolio, internationale Muster und ethische Monetarisierung.", href: "/lab", partner: "Stiftung · Arbeitgeber · Partner" },
  { title: "Impact Sprint", type: "Nonprofit Capacity", status: "Live", text: "Ein Förderer finanziert ein dauerhaft nutzbares digitales System für eine soziale Organisation.", href: "/", partner: "Stiftung · NGO · CSR" },
  { title: "Fairness Compass", type: "Wealth & Fairness", status: "Live interaction", text: "Ein normativer Vermögensvorschlag wird sichtbar, veränderbar und offen für begründeten Dissens.", href: "/lab#fairness", partner: "Forschung · Demokratie · Medien" },
  { title: "Presidential Hackathon 2026", type: "Opportunity", status: "Pitch room", text: "Drei passende Einreichungen, Bewertung und empfohlene Auswahl für Taiwans International Track.", href: "/hackathon", partner: "Team · Mentor · Feldpartner" },
];

const archive = [
  ["Truth Scope Connect", "Food-system transparency", "GitHub vorhanden · privat"],
  ["Familienkompass DE/VN", "Mehrsprachiger Leistungswegweiser", "Prototyp · Konsolidierung offen"],
  ["CivicPilot", "Applied-AI für öffentliche Workflows", "Portfolio-Prototyp · Konsolidierung offen"],
  ["GitLaw", "Nachvollziehbare Gesetzgebung", "Konzept/Prototyp · Konsolidierung offen"],
  ["Public-Money-Mirror", "Öffentliche Geldflüsse", "Konzept/Prototyp · Konsolidierung offen"],
  ["HEIRLOOM", "Digitale Vermögenswerte", "Buyer-Test · Konsolidierung offen"],
];

export default function ProjectsPage() {
  const [copied, setCopied] = useState("");
  useEffect(() => { navigator.sendBeacon("/api/event", new Blob([JSON.stringify({ event: "projects_view", detail: "hub" })], { type: "application/json" })); }, []);

  async function share(title: string, href: string) {
    const url = new URL(href, window.location.origin).toString();
    if (navigator.share) await navigator.share({ title, text: `${title} — Michael Ninh · Human Systems Lab`, url });
    else await navigator.clipboard.writeText(url);
    setCopied(title); window.setTimeout(() => setCopied(""), 1600);
  }

  return <main className="hub-page">
    <header className="lab-header"><Link href="/projects" className="wordmark">PROTOTYPE LIBRARY</Link><nav><a href="#live">Live</a><a href="#archive">Archiv</a><Link href="/hackathon">Hackathon</Link></nav><Link className="lab-back" href="/lab">Human Systems Lab ↗</Link></header>
    <section className="hub-hero">
      <p className="eyebrow">Michael Ninh · Working archive</p>
      <h1>Complex ideas, made <em>tangible</em>.</h1>
      <div><p>Ein teilbarer Zwischenstand für Stiftungen, Verwaltungen, NGOs, Arbeitgeber und mögliche Mitbauer:innen. Jede öffentliche Karte führt zu einer testbaren Version.</p><span>{projects.length} SHAREABLE BUILDS</span></div>
    </section>
    <section className="hub-live" id="live">
      <div className="section-heading"><p className="eyebrow">Public checkpoints</p><h2>Jetzt öffnen, testen und weitergeben.</h2><p>Diese Versionen bleiben als veröffentlichte Zwischenstände erhalten. Neue Checkpoints überschreiben nicht die Idee – sie dokumentieren ihre Entwicklung.</p></div>
      <div className="project-grid">{projects.map((project, index) => <article key={project.title}>
        <div className="project-top"><span>0{index + 1} / {project.type}</span><b>{project.status}</b></div>
        <h3>{project.title}</h3><p>{project.text}</p><small>Für: {project.partner}</small>
        <div><Link href={project.href}>Test öffnen →</Link><button onClick={() => share(project.title, project.href)}>{copied === project.title ? "Link kopiert ✓" : "Teilen ↗"}</button></div>
      </article>)}</div>
    </section>
    <section className="archive" id="archive">
      <div className="section-heading"><p className="eyebrow">Preservation map</p><h2>Was bereits existiert – und was wir noch konsolidieren.</h2><p>Dein verbundenes GitHub-Konto zeigt viele Repositories, aber die neuesten Sites-Prototypen liegen derzeit als veröffentlichte Site-Versionen vor. Diese Übersicht verhindert, dass gute Ideen unsichtbar werden.</p></div>
      <div className="archive-list">{archive.map(([title, area, state]) => <div key={title}><strong>{title}</strong><span>{area}</span><b>{state}</b></div>)}</div>
      <div className="archive-note"><b>Empfohlene nächste Archivstruktur</b><p>Ein kanonisches Repository „human-systems-lab“ mit einem Ordner pro Case Study, Screenshots, Demo-Link, Problem, Hypothese, Ergebnis und nächstem Test. Bis der richtige GitHub-Owner festgelegt ist, verändert dieser Hub keine privaten Repositories.</p></div>
    </section>
    <footer><Link className="wordmark" href="/projects">PROTOTYPE LIBRARY</Link><p>Observe · Diagnose · Redesign · Test · Scale</p><Link href="/lab">Human Systems Lab</Link></footer>
  </main>;
}

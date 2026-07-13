"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type SourceId = "residents" | "birth" | "family" | "housing";
const sources: { id: SourceId; owner: string; title: string; fields: string[]; purpose: string }[] = [
  { id: "residents", owner: "Melderegister", title: "Adresse & Haushalt", fields: ["Hauptwohnsitz", "Haushaltsmitglieder"], purpose: "Zuständigkeit und Wohnort vorausfüllen" },
  { id: "birth", owner: "Geburtsregister", title: "Kinder", fields: ["Geburtsdatum", "Sorgeberechtigung"], purpose: "Altersabhängige Schritte vorbereiten" },
  { id: "family", owner: "Familienkasse", title: "Bestehende Leistung", fields: ["Kindergeld-Status"], purpose: "Doppelte Nachweise vermeiden" },
  { id: "housing", owner: "Wohngeldstelle", title: "Wohnkosten", fields: ["Mietkosten", "Wohngeld-Status"], purpose: "Mögliche nächste Beratung erkennen" },
];

const demoData: Record<SourceId, Record<string, string>> = {
  residents: { "Hauptwohnsitz": "Berlin-Neukölln", "Haushaltsmitglieder": "2 Erwachsene · 2 Kinder" },
  birth: { "Geburtsdatum": "2019 · 2023", "Sorgeberechtigung": "im Demo-Profil bestätigt" },
  family: { "Kindergeld-Status": "aktive Zahlung im Demo-Profil" },
  housing: { "Mietkosten": "1.180 € warm · Demo-Wert", "Wohngeld-Status": "noch nicht geprüft" },
};

type Log = { time: string; action: string; source: string; result: string };

export default function OnceOnlyPage() {
  const [consent, setConsent] = useState<Record<SourceId, boolean>>({ residents: false, birth: false, family: false, housing: false });
  const [filled, setFilled] = useState(false);
  const [logs, setLogs] = useState<Log[]>([]);
  const [receipt, setReceipt] = useState("");
  useEffect(() => { navigator.sendBeacon("/api/event", new Blob([JSON.stringify({ event: "once_view", detail: "family-start" })], { type: "application/json" })); }, []);

  function stamp() { return new Intl.DateTimeFormat("de-DE", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date()); }
  function toggle(id: SourceId) {
    const next = !consent[id]; setConsent(prev => ({ ...prev, [id]: next }));
    setLogs(prev => [{ time: stamp(), action: next ? "Einwilligung erteilt" : "Einwilligung widerrufen", source: sources.find(s => s.id === id)?.owner ?? id, result: next ? "Zugriff für diesen Zweck freigegeben" : "Weitere Abrufe blockiert" }, ...prev]);
    if (!next) { setReceipt(""); setFilled(false); }
  }
  function prefill() {
    const selected = sources.filter(source => consent[source.id]);
    if (!selected.length) return;
    setFilled(true); setReceipt(`ONCE-${Date.now().toString(36).toUpperCase()}`);
    setLogs(prev => [...selected.map(source => ({ time: stamp(), action: "Nachweis abgerufen", source: source.owner, result: `${source.fields.length} Datenfelder · zweckgebunden` })), ...prev]);
  }
  function reset() { setConsent({ residents: false, birth: false, family: false, housing: false }); setFilled(false); setReceipt(""); setLogs([]); }

  const visibleFields = useMemo(() => sources.flatMap(source => consent[source.id] && filled ? Object.entries(demoData[source.id]).map(([label, value]) => ({ label, value, source: source.owner })) : []), [consent, filled]);
  const selectedCount = Object.values(consent).filter(Boolean).length;

  return <main className="once-page">
    <header className="once-header"><Link href="/once-only" className="wordmark">ONCE<span>DE</span></Link><nav><a href="#consent">Einwilligung</a><a href="#prefill">Vorausfüllung</a><a href="#audit">Zugriffsprotokoll</a></nav><Link href="/projects">Prototype Library ↗</Link></header>
    <section className="once-hero">
      <div><p className="eyebrow">Consent-first public infrastructure</p><h1>Der Staat weiß es schon.<br/><em>Du entscheidest, ob er es nutzen darf.</em></h1><p>Ein testbarer Bürger-Layer für das Once-Only-Prinzip: Daten bleiben bei den zuständigen Stellen. Eine Familie gibt einen klaren Zweck frei, sieht jeden Zugriff und kann die Einwilligung widerrufen.</p></div>
      <div className="architecture" aria-label="Vereinfachte Once-Only-Architektur"><article><small>01</small><b>Familie stellt Anfrage</b><span>Kontrolle bleibt beim Menschen</span></article><i>→</i><article><small>02</small><b>Consent Broker</b><span>prüft Zweck und Freigabe</span></article><i>→</i><article><small>03</small><b>Quellregister</b><span>liefern nur benötigte Felder</span></article><i>→</i><article><small>04</small><b>Receipt Log</b><span>macht jeden Zugriff sichtbar</span></article></div>
    </section>
    <section className="demo-warning"><b>Sicherer MVP-Modus</b><p>Diese Demo verwendet ausschließlich fiktive Daten und ist nicht mit Behördenregistern verbunden. Sie zeigt den gewünschten Ablauf – keine produktionsreife Sicherheits- oder Verwaltungsinfrastruktur.</p></section>
    <section className="consent-section" id="consent">
      <div className="section-heading"><p className="eyebrow">Step 01 · purpose before access</p><h2>Welche Stellen dürfen für diesen Antrag etwas beitragen?</h2><p>Demo-Zweck: „Familienleistungen prüfen und einen unvollständigen Antrag vermeiden“. Jede Quelle wird einzeln freigegeben.</p></div>
      <div className="source-grid">{sources.map(source => <article className={consent[source.id] ? "allowed" : ""} key={source.id}><div><span>{source.owner}</span><button onClick={() => toggle(source.id)} role="switch" aria-checked={consent[source.id]}>{consent[source.id] ? "Freigegeben ✓" : "Nicht freigegeben"}</button></div><h3>{source.title}</h3><p>{source.purpose}</p><ul>{source.fields.map(field => <li key={field}>{field}</li>)}</ul></article>)}</div>
    </section>
    <section className="prefill-section" id="prefill">
      <div className="prefill-control"><p className="eyebrow">Step 02 · once only</p><h2>Vorausfüllung mit ausdrücklicher Zustimmung.</h2><p>{selectedCount} von {sources.length} Quellen freigegeben. Es werden nur die bezeichneten Felder für den sichtbaren Zweck abgefragt.</p><button onClick={prefill} disabled={!selectedCount}>Mit {selectedCount} Quelle{selectedCount === 1 ? "" : "n"} vorausfüllen →</button><button className="reset" onClick={reset}>Demo zurücksetzen</button></div>
      <div className="prefill-form"><div className="form-title"><span>FIKTIVER ANTRAG</span><b>{receipt ? `Receipt ${receipt}` : "Noch nicht vorausgefüllt"}</b></div>{visibleFields.length ? visibleFields.map(field => <label key={`${field.source}-${field.label}`}>{field.label}<input value={field.value} readOnly/><small>Quelle: {field.source} · per Einwilligung</small></label>) : <div className="empty-form"><span>○</span><p>Erteile links mindestens eine Freigabe und starte die Vorausfüllung.</p></div>} {filled && <div className="next-check"><b>Kein automatischer Bescheid</b><p>Das System bereitet Daten vor und markiert mögliche nächste Schritte. Anspruch, Plausibilität und Sonderfälle brauchen weiterhin fachliche Prüfung.</p></div>}</div>
    </section>
    <section className="audit-section" id="audit">
      <div className="section-heading"><p className="eyebrow">Step 03 · radical traceability</p><h2>Wer hat wann auf was zugegriffen?</h2><p>Ein echtes System müsste dieses Protokoll unveränderbar, verständlich und für Bürger:innen leicht erreichbar machen.</p></div>
      <div className="audit-log">{logs.length ? logs.map((log, index) => <div key={`${log.time}-${index}`}><time>{log.time}</time><strong>{log.action}</strong><span>{log.source}</span><p>{log.result}</p></div>) : <div className="audit-empty">Noch keine Freigabe und kein Datenzugriff.</div>}</div>
    </section>
    <section className="once-principles"><article><span>01</span><h3>Keine zentrale Superdatenbank</h3><p>Institutionen behalten ihre Daten. Die Verbindungsschicht transportiert nur autorisierte Nachweise.</p></article><article><span>02</span><h3>Zweckbindung statt Blankoscheck</h3><p>Eine Freigabe gilt für einen sichtbaren Prozess, konkrete Datenfelder und einen begrenzten Zeitraum.</p></article><article><span>03</span><h3>Widerruf und Korrektur</h3><p>Menschen können Freigaben stoppen, falsche Daten melden und sehen, was bereits verwendet wurde.</p></article><article><span>04</span><h3>Open Standards & unabhängige Prüfung</h3><p>Protokolle, Schnittstellen und Bedrohungsmodelle müssen überprüfbar sein. Sicherheit braucht professionelle Audits.</p></article></section>
    <section className="noots-note"><div><p className="eyebrow">Germany is already building the pipe</p><h2>NOOTS verbindet Register. OnceDE zeigt, wie sich Kontrolle für Menschen anfühlen sollte.</h2></div><p>Wir ersetzen keine nationale Infrastruktur. Wir testen den Bürger-Layer, bevor er im großen Maßstab schwer veränderbar wird: verständliche Einwilligung, minimale Daten, Vorausfüllung, Status und Nachvollziehbarkeit.</p><a href="https://bmds.bund.de/themen/digitaler-staat/noots" target="_blank" rel="noreferrer">Offizielle NOOTS-Informationen ↗</a></section>
    <footer><Link className="wordmark" href="/once-only">ONCE<span>DE</span></Link><p>Fiktive Daten · Bürgerzentrierter Architektur-Prototyp</p><Link href="/hackathon">Hackathon Pitch öffnen</Link></footer>
  </main>;
}

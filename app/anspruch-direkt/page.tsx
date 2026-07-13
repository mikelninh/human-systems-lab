"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

type Locale = "de" | "en" | "tr" | "ar" | "vi";
type Need = "family" | "housing" | "care" | "urgent";
type Barrier = "unknown" | "documents" | "language" | "contact";

const languages: { id: Locale; label: string }[] = [
  { id: "de", label: "DE" }, { id: "en", label: "EN" }, { id: "tr", label: "TR" },
  { id: "ar", label: "AR" }, { id: "vi", label: "VI" },
];

const copy: Record<Locale, {
  eyebrow: string; title: string; lead: string; start: string; partner: string; trust: string[];
  q1: string; q2: string; back: string; next: string; result: string; resultLead: string;
  needs: Record<Need, string>; barriers: Record<Barrier, string>; actions: string[];
  official: string; caveat: string; helped: string; unclear: string; restart: string;
}> = {
  de: {
    eyebrow: "Öffentliche Unterstützung · klarer nächster Schritt", title: "Hilfe finden, ohne das ganze System verstehen zu müssen.",
    lead: "Ein anonymer Kurz-Check führt dich zu einer passenden offiziellen Anlaufstelle und einer einfachen Checkliste. Keine Leistungsentscheidung. Keine sensiblen Daten.",
    start: "Kostenlos starten", partner: "Als Beratungsstelle testen", trust: ["ohne Konto", "Antworten bleiben im Browser", "ca. 2 Minuten"],
    q1: "Wobei brauchst du gerade Orientierung?", q2: "Was hält dich am meisten auf?", back: "Zurück", next: "Weiter", result: "Dein nächster sinnvoller Schritt", resultLead: "Wir haben keine Berechtigung berechnet. Wir ordnen nur den Einstieg und bringen dich zu einer offiziellen oder gemeinnützigen Stelle.",
    needs: { family: "Familie & Kinder", housing: "Wohnen & Kosten", care: "Pflege & Angehörige", urgent: "Akute finanzielle Not" },
    barriers: { unknown: "Ich weiß nicht, was mir zustehen könnte", documents: "Formulare und Nachweise überfordern mich", language: "Sprache macht es schwer", contact: "Ich finde keine zuständige Person" },
    actions: ["Offiziellen Einstieg öffnen", "Vorhandene Dokumente zusammenlegen", "Bei Unklarheit Beratung kontaktieren"], official: "Offizielle Anlaufstelle öffnen", caveat: "Orientierung, keine Rechts- oder Leistungsberatung.", helped: "Das hilft", unclear: "Noch unklar", restart: "Neu beginnen",
  },
  en: {
    eyebrow: "Public support · one clear next step", title: "Find help without understanding the whole system.",
    lead: "An anonymous quick check points you to a suitable official service and a simple checklist. No eligibility decision. No sensitive data.",
    start: "Start for free", partner: "Test as a counselling partner", trust: ["no account", "answers stay in your browser", "about 2 minutes"],
    q1: "Where do you need guidance right now?", q2: "What is blocking you most?", back: "Back", next: "Continue", result: "Your next useful step", resultLead: "We have not calculated eligibility. We only organize the entry point and connect you with an official or nonprofit service.",
    needs: { family: "Family & children", housing: "Housing & costs", care: "Care & relatives", urgent: "Urgent financial need" }, barriers: { unknown: "I do not know what support may apply", documents: "Forms and evidence overwhelm me", language: "Language makes access difficult", contact: "I cannot find the responsible person" },
    actions: ["Open the official starting point", "Gather documents you already have", "Contact counselling if anything is unclear"], official: "Open official service", caveat: "Guidance only, not legal or eligibility advice.", helped: "This helps", unclear: "Still unclear", restart: "Start again",
  },
  tr: {
    eyebrow: "Kamu desteği · net bir sonraki adım", title: "Tüm sistemi anlamadan yardım bul.", lead: "Anonim kısa kontrol, uygun resmi kuruma ve basit bir kontrol listesine yönlendirir. Hak kararı yok. Hassas veri yok.", start: "Ücretsiz başla", partner: "Danışmanlık merkezi olarak test et", trust: ["hesap gerekmez", "yanıtlar tarayıcıda kalır", "yaklaşık 2 dakika"], q1: "Şu anda hangi konuda yönlendirme gerekiyor?", q2: "Seni en çok ne engelliyor?", back: "Geri", next: "Devam", result: "Bir sonraki anlamlı adımın", resultLead: "Hak sahipliği hesaplamadık. Yalnızca başlangıcı düzenliyor ve resmi ya da sosyal bir kuruma yönlendiriyoruz.", needs: { family: "Aile ve çocuklar", housing: "Konut ve giderler", care: "Bakım ve yakınlar", urgent: "Acil maddi ihtiyaç" }, barriers: { unknown: "Hangi desteğin uygun olduğunu bilmiyorum", documents: "Formlar ve belgeler zor geliyor", language: "Dil erişimi zorlaştırıyor", contact: "Sorumlu kişiyi bulamıyorum" }, actions: ["Resmi başlangıç noktasını aç", "Mevcut belgeleri hazırla", "Belirsizlikte danışmanlığa ulaş"], official: "Resmi hizmeti aç", caveat: "Yalnızca yönlendirme; hukuki veya hak danışmanlığı değildir.", helped: "Bu yardımcı", unclear: "Hâlâ belirsiz", restart: "Yeniden başla",
  },
  ar: {
    eyebrow: "دعم عام · خطوة تالية واضحة", title: "اعثر على المساعدة دون فهم النظام بأكمله.", lead: "فحص قصير ومجهول يوصلك إلى جهة رسمية مناسبة وقائمة بسيطة. لا قرار استحقاق ولا بيانات حساسة.", start: "ابدأ مجانًا", partner: "اختبار كشريك استشاري", trust: ["دون حساب", "الإجابات تبقى في المتصفح", "حوالي دقيقتين"], q1: "في أي مجال تحتاج إلى توجيه الآن؟", q2: "ما العائق الأكبر أمامك؟", back: "رجوع", next: "متابعة", result: "خطوتك التالية المفيدة", resultLead: "لم نحسب الاستحقاق. نحن فقط ننظم نقطة البداية ونوصلك بجهة رسمية أو غير ربحية.", needs: { family: "الأسرة والأطفال", housing: "السكن والتكاليف", care: "الرعاية والأقارب", urgent: "حاجة مالية عاجلة" }, barriers: { unknown: "لا أعرف الدعم الذي قد يناسبني", documents: "النماذج والمستندات تربكني", language: "اللغة تصعّب الوصول", contact: "لا أجد الشخص المسؤول" }, actions: ["افتح نقطة البداية الرسمية", "اجمع المستندات المتوفرة", "تواصل مع الاستشارة عند الغموض"], official: "فتح الخدمة الرسمية", caveat: "توجيه فقط، وليس استشارة قانونية أو قرار استحقاق.", helped: "هذا مفيد", unclear: "ما زال غير واضح", restart: "ابدأ من جديد",
  },
  vi: {
    eyebrow: "Hỗ trợ công · bước tiếp theo rõ ràng", title: "Tìm trợ giúp mà không cần hiểu toàn bộ hệ thống.", lead: "Bài kiểm tra ngắn và ẩn danh dẫn bạn đến nơi hỗ trợ chính thức cùng danh sách việc cần làm. Không quyết định quyền lợi. Không thu dữ liệu nhạy cảm.", start: "Bắt đầu miễn phí", partner: "Thử nghiệm với tư cách đơn vị tư vấn", trust: ["không cần tài khoản", "câu trả lời ở lại trình duyệt", "khoảng 2 phút"], q1: "Bạn đang cần định hướng về vấn đề nào?", q2: "Điều gì cản trở bạn nhiều nhất?", back: "Quay lại", next: "Tiếp tục", result: "Bước tiếp theo hữu ích", resultLead: "Chúng tôi không tính quyền được hưởng. Công cụ chỉ sắp xếp điểm bắt đầu và kết nối với cơ quan chính thức hoặc tổ chức xã hội.", needs: { family: "Gia đình & trẻ em", housing: "Nhà ở & chi phí", care: "Chăm sóc & người thân", urgent: "Khó khăn tài chính khẩn cấp" }, barriers: { unknown: "Tôi không biết mình có thể nhận hỗ trợ gì", documents: "Biểu mẫu và giấy tờ quá khó", language: "Ngôn ngữ gây cản trở", contact: "Tôi không tìm được người phụ trách" }, actions: ["Mở điểm bắt đầu chính thức", "Tập hợp giấy tờ đang có", "Liên hệ tư vấn nếu chưa rõ"], official: "Mở dịch vụ chính thức", caveat: "Chỉ định hướng, không phải tư vấn pháp lý hay quyết định quyền lợi.", helped: "Có ích", unclear: "Vẫn chưa rõ", restart: "Bắt đầu lại",
  },
};

const destinations: Record<Need, { name: string; url: string; note: string }> = {
  family: { name: "KiZ-Lotse & Familienportal", url: "https://www.arbeitsagentur.de/familie-und-kinder/kinderzuschlag-verstehen/kiz-lotse", note: "Kinderzuschlag prüfen und weitere Familienleistungen einordnen." },
  housing: { name: "Wohngeld · Bundesportal", url: "https://verwaltung.bund.de/leistungsverzeichnis/DE/leistung/99107023037000", note: "Voraussetzungen, zuständige Stelle und Antragsschritte ansehen." },
  care: { name: "Pflegestützpunkte Berlin", url: "https://www.pflegestuetzpunkteberlin.de/", note: "Kostenfreie, unabhängige Beratung zu Pflege und Entlastung finden." },
  urgent: { name: "Berliner Sozialämter", url: "https://service.berlin.de/standorte/sozialaemter/", note: "Zuständiges Sozialamt und Kontaktmöglichkeit finden." },
};

function track(event: string, detail = "") {
  navigator.sendBeacon("/api/event", new Blob([JSON.stringify({ event, detail })], { type: "application/json" }));
}

export default function AnspruchDirektPage() {
  const [locale, setLocale] = useState<Locale>("de");
  const [step, setStep] = useState(0);
  const [need, setNeed] = useState<Need | null>(null);
  const [barrier, setBarrier] = useState<Barrier | null>(null);
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const c = copy[locale];
  const destination = useMemo(() => need ? destinations[need] : null, [need]);

  useEffect(() => { document.title = "Anspruch Direkt — Hilfe verständlich finden"; track("anspruch_view", "initial"); }, []);

  function begin() { setStep(1); track("anspruch_start", locale); document.getElementById("check")?.scrollIntoView({ behavior: "smooth" }); }
  function finish() { if (!need || !barrier) return; setStep(3); track("anspruch_result", `${need}:${barrier}:${locale}`); }

  async function submitPartner(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setFormStatus("sending"); const form = new FormData(event.currentTarget);
    const response = await fetch("/api/pilot", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ project: "anspruch-direkt", role: "partner", name: form.get("name"), email: form.get("email"), organisation: form.get("organisation"), message: form.get("message"), locale, website: form.get("website") }) });
    setFormStatus(response.ok ? "success" : "error"); if (response.ok) track("anspruch_partner_lead", locale);
  }

  return <main className="ad-page" dir={locale === "ar" ? "rtl" : "ltr"}>
    <header className="ad-nav"><Link href="/anspruch-direkt" className="ad-brand"><span>AD</span> ANSPRUCH DIREKT</Link><nav><a href="#how">So funktioniert’s</a><a href="#partner">Pilotpartner</a><Link href="/projects">Alle Projekte</Link></nav><div className="ad-lang">{languages.map(item => <button key={item.id} className={locale === item.id ? "active" : ""} onClick={() => { setLocale(item.id); track("language_selected", item.id); }}>{item.label}</button>)}</div></header>

    <section className="ad-hero">
      <div className="ad-hero-copy"><p className="ad-kicker">{c.eyebrow}</p><h1>{c.title}</h1><p>{c.lead}</p><div className="ad-actions"><button className="ad-primary" onClick={begin}>{c.start} <span>→</span></button><a className="ad-secondary" href="#partner">{c.partner}</a></div><div className="ad-trust">{c.trust.map(item => <span key={item}>✓ {item}</span>)}</div></div>
      <div className="ad-preview"><div className="ad-preview-top"><span>DEIN WEG</span><b>ANONYM</b></div><div className="ad-route"><span className="done">1</span><p><b>Situation</b><small>Was ist gerade wichtig?</small></p></div><div className="ad-line"/><div className="ad-route"><span>2</span><p><b>Hürde</b><small>Was blockiert den Zugang?</small></p></div><div className="ad-line"/><div className="ad-route"><span>3</span><p><b>Nächster Schritt</b><small>Offiziell · verständlich · konkret</small></p></div><div className="ad-preview-foot"><strong>Keine Sackgasse.</strong><span>Eine klare nächste Handlung.</span></div></div>
    </section>

    <section className="ad-check" id="check">
      <div className="ad-progress"><span style={{ width: `${step === 0 ? 0 : step === 1 ? 33 : step === 2 ? 66 : 100}%` }}/></div>
      {step === 0 && <div className="ad-check-intro"><span>01 — 03</span><h2>{c.q1}</h2><button onClick={begin}>{c.start} →</button></div>}
      {step === 1 && <div className="ad-question"><small>01 / 03</small><h2>{c.q1}</h2><div className="ad-options">{(Object.keys(c.needs) as Need[]).map(id => <button key={id} className={need === id ? "selected" : ""} onClick={() => setNeed(id)}><span>{id === "family" ? "◌" : id === "housing" ? "⌂" : id === "care" ? "+" : "!"}</span>{c.needs[id]}</button>)}</div><div className="ad-controls"><button onClick={() => setStep(0)}>{c.back}</button><button disabled={!need} onClick={() => setStep(2)}>{c.next} →</button></div></div>}
      {step === 2 && <div className="ad-question"><small>02 / 03</small><h2>{c.q2}</h2><div className="ad-options barriers">{(Object.keys(c.barriers) as Barrier[]).map((id, index) => <button key={id} className={barrier === id ? "selected" : ""} onClick={() => setBarrier(id)}><span>0{index + 1}</span>{c.barriers[id]}</button>)}</div><div className="ad-controls"><button onClick={() => setStep(1)}>{c.back}</button><button disabled={!barrier} onClick={finish}>{c.next} →</button></div></div>}
      {step === 3 && destination && <div className="ad-result"><div className="ad-result-copy"><small>03 / 03 · {c.needs[need!]}</small><h2>{c.result}</h2><p>{c.resultLead}</p><ol>{c.actions.map((action, index) => <li key={action}><span>{index + 1}</span>{action}</li>)}</ol></div><aside><span>EMPFOHLENER EINSTIEG</span><h3>{destination.name}</h3><p>{destination.note}</p><a href={destination.url} target="_blank" rel="noreferrer" onClick={() => track("official_link_opened", need!)}>{c.official} ↗</a><small>ⓘ {c.caveat}</small></aside><div className="ad-feedback"><span>War dieser Weg klar?</span><button onClick={() => track("anspruch_feedback", "helped")}>✓ {c.helped}</button><button onClick={() => track("anspruch_feedback", "unclear")}>? {c.unclear}</button><button onClick={() => { setStep(1); setNeed(null); setBarrier(null); }}>{c.restart}</button></div></div>}
    </section>

    <section className="ad-how" id="how"><div><p className="ad-kicker">Kleine Intervention, messbare Entlastung</p><h2>Wir testen nicht, ob die Website schön ist. Wir testen, ob Menschen weiterkommen.</h2></div><div className="ad-metrics"><article><strong>10</strong><span>echte Testpersonen</span></article><article><strong>7 Tage</strong><span>bis zum ersten Ergebnis</span></article><article><strong>3 Signale</strong><span>Antrag gestartet · Zeit gespart · weniger Unsicherheit</span></article></div></section>

    <section className="ad-principles"><article><span>01</span><h3>Orientieren</h3><p>Eine Lebenslage wird in verständliche Optionen übersetzt.</p></article><article><span>02</span><h3>Verbinden</h3><p>Der Weg endet bei einer offiziellen oder vertrauenswürdigen menschlichen Stelle.</p></article><article><span>03</span><h3>Lernen</h3><p>Wir messen Sackgassen und verbessern den Weg mit Beratenden und Betroffenen.</p></article></section>

    <section className="ad-partner" id="partner"><div><p className="ad-kicker">Pilotpartner gesucht · Berlin</p><h2>Sie beraten Menschen? Testen wir einen einzigen Leistungsweg gemeinsam.</h2><p>Wir bringen Prototyp, Übersetzung und Messung. Sie bringen Fachwissen und fünf bis zehn freiwillige Testpersonen. Keine Systemintegration im ersten Pilot.</p><ul><li>7-Tage-Testdesign</li><li>Datensparsame Auswertung</li><li>Öffentlicher Lernbericht ohne Falldaten</li></ul></div>{formStatus === "success" ? <div className="ad-success"><span>✓</span><h3>Pilotinteresse angekommen.</h3><p>Ich melde mich persönlich mit drei konkreten Fragen.</p></div> : <form onSubmit={submitPartner}><label>Name<input name="name" required /></label><label>Organisation<input name="organisation" required /></label><label>E-Mail<input name="email" type="email" required /></label><label>Welcher Leistungsweg verursacht die meiste Reibung?<textarea name="message" rows={4} /></label><label className="honey">Website<input name="website" tabIndex={-1} /></label><button disabled={formStatus === "sending"}>{formStatus === "sending" ? "Wird gesendet …" : "Pilotgespräch anfragen →"}</button>{formStatus === "error" && <p className="error">Noch nicht gespeichert. Bitte erneut versuchen.</p>}</form>}</section>
    <footer className="ad-footer"><Link href="/anspruch-direkt" className="ad-brand"><span>AD</span> ANSPRUCH DIREKT</Link><p>Ein Human Systems Lab Experiment · Michael Ninh</p><Link href="/impact-sprint">Impact Sprint →</Link></footer>
  </main>;
}

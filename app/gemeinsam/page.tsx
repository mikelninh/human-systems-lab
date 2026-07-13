"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type Locale = "de" | "en" | "tr" | "ar" | "vi";
type Cohort = "family" | "practice" | "administration" | "civil";
type Vote = "agree" | "disagree" | "pass";
type Row = { statementId: string; cohort: Cohort; vote: Vote; count: number };

const languages: { id: Locale; label: string }[] = [
  { id: "de", label: "Deutsch" }, { id: "en", label: "English" }, { id: "tr", label: "Türkçe" }, { id: "ar", label: "العربية" }, { id: "vi", label: "Tiếng Việt" },
];

const copy = {
  de: { issue: "Wie kann Berlin Familien den Zugang zu staatlichen Leistungen erleichtern?", intro: "Bewerte Aussagen – nicht Menschen. Wir suchen Ideen, denen unterschiedliche Gruppen gemeinsam zustimmen.", perspective: "Aus welcher Perspektive antwortest du?", agree: "Stimme zu", disagree: "Stimme nicht zu", pass: "Unsicher", next: "Nächste Aussage", done: "Danke. Deine Perspektive ist jetzt Teil des Live-Ergebnisses.", result: "Gruppenübergreifender Konsens", suggest: "Welche Aussage fehlt?", submit: "Aussage vorschlagen", sent: "Für die moderierte Runde gespeichert.", live: "Echte Pilotstimmen · keine repräsentative Umfrage" },
  en: { issue: "How can Berlin make public benefits easier for families to access?", intro: "Rate statements, not people. We look for ideas that different groups support together.", perspective: "Which perspective are you answering from?", agree: "Agree", disagree: "Disagree", pass: "Unsure", next: "Next statement", done: "Thank you. Your perspective is now part of the live result.", result: "Cross-group consensus", suggest: "Which statement is missing?", submit: "Suggest statement", sent: "Saved for the facilitated round.", live: "Real pilot votes · not a representative poll" },
  tr: { issue: "Berlin, ailelerin devlet yardımlarına erişimini nasıl kolaylaştırabilir?", intro: "İnsanları değil, ifadeleri değerlendir. Farklı grupların birlikte desteklediği fikirleri arıyoruz.", perspective: "Hangi bakış açısından yanıtlıyorsun?", agree: "Katılıyorum", disagree: "Katılmıyorum", pass: "Emin değilim", next: "Sonraki ifade", done: "Teşekkürler. Bakış açın artık canlı sonucun bir parçası.", result: "Gruplar arası ortak görüş", suggest: "Hangi ifade eksik?", submit: "İfade öner", sent: "Kolaylaştırılmış oturum için kaydedildi.", live: "Gerçek pilot oyları · temsili anket değildir" },
  ar: { issue: "كيف يمكن لبرلين تسهيل وصول الأسر إلى المساعدات الحكومية؟", intro: "قيّم العبارات لا الأشخاص. نبحث عن أفكار تؤيدها مجموعات مختلفة معًا.", perspective: "من أي منظور تجيب؟", agree: "أوافق", disagree: "لا أوافق", pass: "غير متأكد", next: "العبارة التالية", done: "شكرًا. أصبح منظورك جزءًا من النتيجة المباشرة.", result: "توافق بين المجموعات", suggest: "ما العبارة الناقصة؟", submit: "اقترح عبارة", sent: "تم الحفظ للجلسة الميسّرة.", live: "أصوات تجريبية حقيقية · ليست استطلاعًا تمثيليًا" },
  vi: { issue: "Berlin có thể giúp các gia đình tiếp cận trợ cấp nhà nước dễ dàng hơn bằng cách nào?", intro: "Đánh giá ý kiến, không đánh giá con người. Chúng tôi tìm những ý tưởng được các nhóm khác nhau cùng ủng hộ.", perspective: "Bạn trả lời từ góc nhìn nào?", agree: "Đồng ý", disagree: "Không đồng ý", pass: "Chưa chắc", next: "Ý kiến tiếp theo", done: "Cảm ơn. Góc nhìn của bạn đã trở thành một phần của kết quả trực tiếp.", result: "Đồng thuận giữa các nhóm", suggest: "Còn thiếu ý kiến nào?", submit: "Đề xuất ý kiến", sent: "Đã lưu cho vòng thảo luận có điều phối.", live: "Phiếu thử nghiệm thật · không phải khảo sát đại diện" },
} satisfies Record<Locale, Record<string, string>>;

const cohorts: Record<Cohort, Record<Locale, string>> = {
  family: { de: "Familie / betroffene Person", en: "Family / affected person", tr: "Aile / etkilenen kişi", ar: "أسرة / شخص متأثر", vi: "Gia đình / người bị ảnh hưởng" },
  practice: { de: "Beratung / Praxis", en: "Advice / frontline practice", tr: "Danışmanlık / saha", ar: "استشارة / ممارسة ميدانية", vi: "Tư vấn / thực hành" },
  administration: { de: "Verwaltung", en: "Public administration", tr: "Kamu yönetimi", ar: "الإدارة العامة", vi: "Cơ quan hành chính" },
  civil: { de: "Zivilgesellschaft / Forschung", en: "Civil society / research", tr: "Sivil toplum / araştırma", ar: "المجتمع المدني / البحث", vi: "Xã hội dân sự / nghiên cứu" },
};

const statements = [
  { id: "once", text: { de: "Familien sollten dieselben Angaben nur einmal machen müssen.", en: "Families should only have to provide the same information once.", tr: "Aileler aynı bilgileri yalnızca bir kez vermek zorunda olmalı.", ar: "يجب ألا تضطر الأسر إلى تقديم المعلومات نفسها أكثر من مرة.", vi: "Các gia đình chỉ nên phải cung cấp cùng một thông tin một lần." } },
  { id: "plain", text: { de: "Jeder Antrag braucht eine verständliche Zusammenfassung in einfacher Sprache.", en: "Every application needs an understandable plain-language summary.", tr: "Her başvurunun sade dilde anlaşılır bir özeti olmalı.", ar: "يجب أن يتضمن كل طلب ملخصًا واضحًا بلغة بسيطة.", vi: "Mỗi đơn cần có bản tóm tắt dễ hiểu bằng ngôn ngữ đơn giản." } },
  { id: "consent", text: { de: "Daten dürfen nur nach sichtbarer Zustimmung aus einem anderen Register übernommen werden.", en: "Data should only be retrieved from another register after visible consent.", tr: "Veriler başka bir kaynaktan yalnızca açık onaydan sonra alınmalı.", ar: "لا يجوز جلب البيانات من سجل آخر إلا بعد موافقة واضحة.", vi: "Dữ liệu chỉ nên được lấy từ cơ sở khác sau khi có sự đồng ý rõ ràng." } },
  { id: "human", text: { de: "Bei komplexen Fällen muss jederzeit ein Mensch erreichbar bleiben.", en: "A human must remain reachable at any time for complex cases.", tr: "Karmaşık durumlarda her zaman bir insana ulaşılabilmeli.", ar: "يجب أن يبقى الوصول إلى موظف بشري ممكنًا في الحالات المعقدة.", vi: "Trong trường hợp phức tạp, luôn phải có thể liên hệ với một người thật." } },
  { id: "status", text: { de: "Familien sollten jederzeit sehen können, wo ihr Antrag steht und was noch fehlt.", en: "Families should always be able to see the status of their application and what is missing.", tr: "Aileler başvurularının durumunu ve eksiklerini her zaman görebilmeli.", ar: "يجب أن تتمكن الأسر دائمًا من معرفة حالة طلبها وما ينقصه.", vi: "Gia đình nên luôn xem được hồ sơ đang ở đâu và còn thiếu gì." } },
  { id: "languages", text: { de: "Wichtige Verwaltungswege sollten mindestens in den häufigsten Sprachen Berlins verfügbar sein.", en: "Important public-service journeys should be available in Berlin’s most common languages.", tr: "Önemli kamu hizmetleri Berlin'de en sık konuşulan dillerde sunulmalı.", ar: "يجب إتاحة الخدمات الإدارية المهمة بأكثر اللغات استخدامًا في برلين.", vi: "Các thủ tục quan trọng nên có bằng những ngôn ngữ phổ biến nhất ở Berlin." } },
] as const;

export default function GemeinsamPage() {
  const [locale, setLocale] = useState<Locale>("de");
  const [sessionId, setSessionId] = useState("");
  const [cohort, setCohort] = useState<Cohort | null>(null);
  const [index, setIndex] = useState(0);
  const [rows, setRows] = useState<Row[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [suggestionStatus, setSuggestionStatus] = useState<"idle" | "sent">("idle");
  const t = copy[locale];

  useEffect(() => {
    navigator.sendBeacon("/api/event", new Blob([JSON.stringify({ event: "consensus_view", detail: "berlin-benefits" })], { type: "application/json" }));
    fetch("/api/consensus/vote").then(r => r.json()).then(data => setRows(data.rows ?? [])).catch(() => undefined);
  }, []);

  function chooseCohort(next: Cohort) {
    let id = localStorage.getItem("gemeinsam-session");
    if (!id) { const bytes = new Uint32Array(3); window.crypto.getRandomValues(bytes); id = `pilot-${Array.from(bytes).map(value => value.toString(36)).join("-")}`; localStorage.setItem("gemeinsam-session", id); }
    setSessionId(id); setCohort(next);
  }

  async function cast(vote: Vote) {
    if (!cohort || !sessionId) return;
    const statementId = statements[index].id;
    await fetch("/api/consensus/vote", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sessionId, statementId, cohort, vote, locale }) });
    if (index < statements.length - 1) setIndex(index + 1);
    else { setStatus("done"); const data = await fetch("/api/consensus/vote").then(r => r.json()); setRows(data.rows ?? []); }
  }

  const consensus = statements.map(statement => {
    const groupScores = (["family", "practice", "administration", "civil"] as Cohort[]).map(group => {
      const relevant = rows.filter(row => row.statementId === statement.id && row.cohort === group);
      const agree = relevant.find(row => row.vote === "agree")?.count ?? 0;
      const disagree = relevant.find(row => row.vote === "disagree")?.count ?? 0;
      return { group, total: agree + disagree, score: agree + disagree ? agree / (agree + disagree) : null };
    }).filter(item => item.score !== null);
    const min = groupScores.length ? Math.min(...groupScores.map(item => item.score as number)) : 0;
    return { statement, groups: groupScores.length, min, consensus: groupScores.length >= 2 && min >= .6 };
  }).sort((a, b) => Number(b.consensus) - Number(a.consensus) || b.min - a.min);

  async function suggest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!cohort) return;
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/consensus/suggestion", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ cohort, locale, statement: form.get("statement"), website: form.get("website") }) });
    if (response.ok) { setSuggestionStatus("sent"); event.currentTarget.reset(); }
  }

  return <main className="consensus-page" dir={locale === "ar" ? "rtl" : "ltr"}>
    <header className="consensus-header"><Link href="/gemeinsam" className="wordmark">GEMEINSAM BERLIN</Link><span>PUBLIC EXPERIMENT 01</span><Link href="/projects">Alle Prototypen ↗</Link></header>
    <section className="consensus-hero">
      <div><p className="eyebrow">Democracy designed for common ground</p><h1>Streit zeigt Unterschiede.<br/><em>Wir suchen Gemeinsamkeiten.</em></h1></div>
      <p>Keine Kommentarspalte. Keine algorithmische Empörung. Ein transparenter Test, der sichtbar macht, welchen konkreten Verbesserungen unterschiedliche Gruppen zustimmen.</p>
    </section>
    <section className="language-bar" aria-label="Sprache wählen">{languages.map(language => <button className={locale === language.id ? "active" : ""} key={language.id} onClick={() => setLocale(language.id)}>{language.label}</button>)}</section>
    <section className="vote-room">
      <div className="issue-card"><span>BERLIN · FAMILIENLEISTUNGEN</span><h2>{t.issue}</h2><p>{t.intro}</p><small>{t.live}</small></div>
      {!cohort ? <div className="cohort-picker"><p>{t.perspective}</p>{(Object.keys(cohorts) as Cohort[]).map(id => <button key={id} onClick={() => chooseCohort(id)}><span>{id === "family" ? "♡" : id === "practice" ? "↔" : id === "administration" ? "▦" : "◎"}</span>{cohorts[id][locale]}</button>)}</div> : status !== "done" ? <div className="statement-card">
        <div className="statement-progress"><span>{String(index + 1).padStart(2, "0")} / {statements.length}</span><span>{cohorts[cohort][locale]}</span></div>
        <h3>{statements[index].text[locale]}</h3>
        <div className="vote-actions"><button className="agree" onClick={() => cast("agree")}>✓ {t.agree}</button><button className="disagree" onClick={() => cast("disagree")}>× {t.disagree}</button><button className="pass" onClick={() => cast("pass")}>○ {t.pass}</button></div>
      </div> : <div className="vote-done"><span>✓</span><h3>{t.done}</h3><button onClick={() => { setIndex(0); setStatus("idle"); }}>{t.next}</button></div>}
    </section>
    <section className="consensus-results">
      <div className="section-heading"><p className="eyebrow">Live aggregation</p><h2>{t.result}</h2><p>Eine Aussage erscheint als Konsens, sobald mindestens zwei Perspektiven abgestimmt haben und in jeder davon mindestens 60 % zustimmen. „Unsicher“ wird nicht als Zustimmung oder Ablehnung gezählt.</p></div>
      <div className="result-list">{consensus.map(item => <article className={item.consensus ? "is-consensus" : ""} key={item.statement.id}><div><span>{item.consensus ? "GEMEINSAM" : "NOCH OFFEN"}</span><b>{item.groups} / 4 Perspektiven</b></div><h3>{item.statement.text[locale]}</h3><div className="score-track"><span style={{ width: `${Math.round(item.min * 100)}%` }}/></div><small>Niedrigste Zustimmung zwischen beteiligten Gruppen: {Math.round(item.min * 100)} %</small></article>)}</div>
    </section>
    <section className="suggestion-room"><div><p className="eyebrow">Agenda belongs to people</p><h2>{t.suggest}</h2><p>Neue Aussagen werden nicht automatisch veröffentlicht oder von AI priorisiert. Eine moderierte Runde prüft Verständlichkeit, Dopplungen und Sicherheit.</p></div>{suggestionStatus === "sent" ? <div className="suggestion-sent">✓ {t.sent}</div> : <form onSubmit={suggest}><textarea name="statement" minLength={8} maxLength={500} required rows={5} placeholder={t.suggest}/><input className="honey" name="website"/><button disabled={!cohort}>{cohort ? t.submit : t.perspective}</button></form>}</section>
    <section className="response-loop"><span>VERBINDLICHKEIT</span><h2>Öffentliche Antwort: noch ausstehend.</h2><p>Für den echten Pilot suchen wir einen Berliner Bezirk, eine Beratungsstelle oder Stiftung, die öffentlich zusagt: übernommen, verändert oder abgelehnt – jeweils mit Begründung.</p><Link href="/#interest">Umsetzungspartner werden →</Link></section>
    <footer><Link className="wordmark" href="/gemeinsam">GEMEINSAM BERLIN</Link><p>AI darf übersetzen, clustern und zusammenfassen. Menschen entscheiden.</p><Link href="/once-only">OnceDE testen</Link></footer>
  </main>;
}

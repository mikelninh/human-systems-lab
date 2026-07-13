type D1Statement = { bind(...values: unknown[]): D1Statement; run(): Promise<unknown> };
type D1Like = { prepare(query: string): D1Statement };
const cohorts = new Set(["family", "practice", "administration", "civil"]);
const locales = new Set(["de", "en", "tr", "ar", "vi"]);

export async function POST(request: Request) {
  try {
    const data = await request.json() as Record<string, unknown>;
    if (data.website) return Response.json({ ok: true });
    const cohort = String(data.cohort ?? "");
    const locale = String(data.locale ?? "de");
    const statement = String(data.statement ?? "").trim().slice(0, 500);
    if (!cohorts.has(cohort) || !locales.has(locale) || statement.length < 8) return Response.json({ error: "invalid suggestion" }, { status: 400 });
    const db = (globalThis as typeof globalThis & { __IMPACT_DB?: D1Like }).__IMPACT_DB;
    if (!db) return Response.json({ error: "database unavailable" }, { status: 503 });
    await db.prepare(`CREATE TABLE IF NOT EXISTS consensus_suggestions (
      id INTEGER PRIMARY KEY AUTOINCREMENT, issue TEXT NOT NULL, cohort TEXT NOT NULL,
      locale TEXT NOT NULL, statement TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`).run();
    await db.prepare("INSERT INTO consensus_suggestions (issue, cohort, locale, statement) VALUES (?, ?, ?, ?)")
      .bind("berlin-benefits", cohort, locale, statement).run();
    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json({ error: "suggestion not recorded" }, { status: 500 });
  }
}

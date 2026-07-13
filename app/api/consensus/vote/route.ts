type D1Statement = { bind(...values: unknown[]): D1Statement; run(): Promise<unknown>; all<T>(): Promise<{ results?: T[] }> };
type D1Like = { prepare(query: string): D1Statement };

const issue = "berlin-benefits";
const statementIds = new Set(["once", "plain", "consent", "human", "status", "languages"]);
const cohorts = new Set(["family", "practice", "administration", "civil"]);
const votes = new Set(["agree", "disagree", "pass"]);
const locales = new Set(["de", "en", "tr", "ar", "vi"]);

async function ensure(db: D1Like) {
  await db.prepare(`CREATE TABLE IF NOT EXISTS consensus_votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    issue TEXT NOT NULL,
    session_id TEXT NOT NULL,
    statement_id TEXT NOT NULL,
    cohort TEXT NOT NULL,
    vote TEXT NOT NULL,
    locale TEXT NOT NULL DEFAULT 'de',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`).run();
  await db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS consensus_vote_session_statement ON consensus_votes(issue, session_id, statement_id)").run();
}

export async function POST(request: Request) {
  try {
    const data = await request.json() as Record<string, unknown>;
    const sessionId = String(data.sessionId ?? "").replace(/[^a-zA-Z0-9-]/g, "").slice(0, 80);
    const statementId = String(data.statementId ?? "");
    const cohort = String(data.cohort ?? "");
    const vote = String(data.vote ?? "");
    const locale = String(data.locale ?? "de");
    if (!sessionId || !statementIds.has(statementId) || !cohorts.has(cohort) || !votes.has(vote) || !locales.has(locale)) {
      return Response.json({ error: "invalid vote" }, { status: 400 });
    }
    const db = (globalThis as typeof globalThis & { __IMPACT_DB?: D1Like }).__IMPACT_DB;
    if (!db) return Response.json({ error: "database unavailable" }, { status: 503 });
    await ensure(db);
    await db.prepare(`INSERT INTO consensus_votes (issue, session_id, statement_id, cohort, vote, locale)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(issue, session_id, statement_id) DO UPDATE SET cohort=excluded.cohort, vote=excluded.vote, locale=excluded.locale, created_at=CURRENT_TIMESTAMP`)
      .bind(issue, sessionId, statementId, cohort, vote, locale).run();
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "vote not recorded" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = (globalThis as typeof globalThis & { __IMPACT_DB?: D1Like }).__IMPACT_DB;
    if (!db) return Response.json({ error: "database unavailable" }, { status: 503 });
    await ensure(db);
    const result = await db.prepare(`SELECT statement_id as statementId, cohort, vote, COUNT(*) as count
      FROM consensus_votes WHERE issue = ? GROUP BY statement_id, cohort, vote`).bind(issue).all<{ statementId: string; cohort: string; vote: string; count: number }>();
    return Response.json({ rows: result.results ?? [] });
  } catch {
    return Response.json({ rows: [] });
  }
}

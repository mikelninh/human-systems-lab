type D1Like = { prepare(query: string): { bind(...values: unknown[]): { run(): Promise<unknown> } } };
export async function POST(request: Request) {
  try {
    const data = await request.json() as Record<string, unknown>;
    if (data.website) return Response.json({ ok: true }, { status: 201 });
    const bottom = Number(data.bottom), middle = Number(data.middle), top = Number(data.top);
    const stance = String(data.stance ?? "").slice(0, 80), comment = String(data.comment ?? "").trim().slice(0, 2000), email = String(data.email ?? "").trim().toLowerCase().slice(0, 180);
    if (bottom + middle + top !== 100 || !stance || !comment) return Response.json({ error: "invalid feedback" }, { status: 400 });
    const db = (globalThis as typeof globalThis & { __IMPACT_DB?: D1Like }).__IMPACT_DB;
    if (!db) return Response.json({ error: "database unavailable" }, { status: 503 });
    await db.prepare(`CREATE TABLE IF NOT EXISTS fairness_feedback (id INTEGER PRIMARY KEY AUTOINCREMENT, bottom_share INTEGER NOT NULL, middle_share INTEGER NOT NULL, top_share INTEGER NOT NULL, stance TEXT NOT NULL, comment TEXT NOT NULL, email TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`).bind().run();
    await db.prepare("INSERT INTO fairness_feedback (bottom_share, middle_share, top_share, stance, comment, email) VALUES (?, ?, ?, ?, ?, ?)").bind(bottom, middle, top, stance, comment, email).run();
    return Response.json({ ok: true }, { status: 201 });
  } catch { return Response.json({ error: "feedback not recorded" }, { status: 500 }); }
}

type D1Like = {
  prepare(query: string): { bind(...values: unknown[]): { run(): Promise<unknown> } };
};

const allowed = new Set([
  "page_view", "form_opened", "cause_selected", "goal_selected", "lead_submitted", "lead_error",
  "lab_view", "projects_view", "consensus_view", "once_view", "hackathon_view",
  "anspruch_view", "anspruch_start", "anspruch_result", "anspruch_feedback", "anspruch_partner_lead",
  "language_selected", "official_link_opened", "sprint_view", "sprint_goal_selected",
  "sprint_form_opened", "sprint_lead", "share_clicked", "eval_view", "eval_scenario_selected",
  "eval_run", "eval_export", "eval_share",
]);

export async function POST(request: Request) {
  try {
    const data = await request.json() as Record<string, unknown>;
    const event = String(data.event ?? "").slice(0, 40);
    const detail = String(data.detail ?? "").slice(0, 120);
    if (!allowed.has(event)) return Response.json({ error: "invalid event" }, { status: 400 });
    const db = (globalThis as typeof globalThis & { __IMPACT_DB?: D1Like }).__IMPACT_DB;
    if (!db) return Response.json({ error: "database unavailable" }, { status: 503 });
    await db.prepare(`CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event TEXT NOT NULL,
      detail TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`).bind().run();
    await db.prepare("INSERT INTO events (event, detail) VALUES (?, ?)").bind(event, detail).run();
    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json({ error: "event not recorded" }, { status: 500 });
  }
}

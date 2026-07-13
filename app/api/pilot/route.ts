type D1Like = {
  prepare(query: string): { bind(...values: unknown[]): { run(): Promise<unknown> } };
};

const projects = new Set(["anspruch-direkt", "impact-sprint"]);
const roles = new Set(["person", "partner", "buyer", "nomination"]);

export async function POST(request: Request) {
  try {
    const data = await request.json() as Record<string, unknown>;
    if (data.website) return Response.json({ ok: true }, { status: 201 });

    const project = String(data.project ?? "");
    const role = String(data.role ?? "");
    const name = String(data.name ?? "").trim().slice(0, 120);
    const email = String(data.email ?? "").trim().toLowerCase().slice(0, 180);
    const organisation = String(data.organisation ?? "").trim().slice(0, 180);
    const choice = String(data.choice ?? "").trim().slice(0, 120);
    const locale = String(data.locale ?? "de").trim().slice(0, 10);
    const message = String(data.message ?? "").trim().slice(0, 1200);

    if (!projects.has(project) || !roles.has(role) || !name || !/^\S+@\S+\.\S+$/.test(email)) {
      return Response.json({ error: "Bitte Name und gültige E-Mail angeben." }, { status: 400 });
    }

    const db = (globalThis as typeof globalThis & { __IMPACT_DB?: D1Like }).__IMPACT_DB;
    if (!db) return Response.json({ error: "Datenbank nicht verfügbar." }, { status: 503 });

    await db.prepare(`CREATE TABLE IF NOT EXISTS pilot_leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project TEXT NOT NULL,
      role TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      organisation TEXT NOT NULL DEFAULT '',
      choice TEXT NOT NULL DEFAULT '',
      locale TEXT NOT NULL DEFAULT 'de',
      message TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`).bind().run();

    await db.prepare("INSERT INTO pilot_leads (project, role, name, email, organisation, choice, locale, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(project, role, name, email, organisation, choice, locale, message).run();

    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json({ error: "Anfrage konnte nicht gespeichert werden." }, { status: 500 });
  }
}

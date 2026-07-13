type D1Like = {
  prepare(query: string): { bind(...values: unknown[]): { run(): Promise<unknown> } };
};

export async function POST(request: Request) {
  try {
    const data = await request.json() as Record<string, unknown>;
    if (data.website) return Response.json({ ok: true }, { status: 201 });

    const role = String(data.role ?? "");
    const name = String(data.name ?? "").trim();
    const email = String(data.email ?? "").trim().toLowerCase();
    if (!(["sponsor", "organisation"].includes(role)) || !name || !/^\S+@\S+\.\S+$/.test(email)) {
      return Response.json({ error: "Bitte Name, Rolle und gültige E-Mail angeben." }, { status: 400 });
    }

    const db = (globalThis as typeof globalThis & { __IMPACT_DB?: D1Like }).__IMPACT_DB;
    if (!db) return Response.json({ error: "Datenbank nicht verfügbar." }, { status: 503 });

    await db.prepare(`CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      organisation TEXT NOT NULL DEFAULT '',
      cause TEXT NOT NULL DEFAULT '',
      interest TEXT NOT NULL DEFAULT '',
      budget TEXT NOT NULL DEFAULT '',
      message TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`).bind().run();

    await db.prepare("INSERT INTO leads (role, name, email, organisation, cause, interest, budget, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(role, name, email, String(data.organisation ?? "").trim(), String(data.cause ?? ""), String(data.interest ?? ""), String(data.budget ?? ""), String(data.message ?? "").trim())
      .run();

    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json({ error: "Anfrage konnte nicht gespeichert werden." }, { status: 500 });
  }
}

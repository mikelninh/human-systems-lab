import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const leads = sqliteTable("leads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  role: text("role").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  organisation: text("organisation").notNull().default(""),
  cause: text("cause").notNull().default(""),
  interest: text("interest").notNull().default(""),
  budget: text("budget").notNull().default(""),
  message: text("message").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  event: text("event").notNull(),
  detail: text("detail").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const pilotLeads = sqliteTable("pilot_leads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  project: text("project").notNull(),
  role: text("role").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  organisation: text("organisation").notNull().default(""),
  choice: text("choice").notNull().default(""),
  locale: text("locale").notNull().default("de"),
  message: text("message").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const fairnessFeedback = sqliteTable("fairness_feedback", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  bottomShare: integer("bottom_share").notNull(),
  middleShare: integer("middle_share").notNull(),
  topShare: integer("top_share").notNull(),
  stance: text("stance").notNull(),
  comment: text("comment").notNull(),
  email: text("email").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const consensusVotes = sqliteTable("consensus_votes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  issue: text("issue").notNull(),
  sessionId: text("session_id").notNull(),
  statementId: text("statement_id").notNull(),
  cohort: text("cohort").notNull(),
  vote: text("vote").notNull(),
  locale: text("locale").notNull().default("de"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("consensus_vote_session_statement").on(table.issue, table.sessionId, table.statementId),
]);

export const consensusSuggestions = sqliteTable("consensus_suggestions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  issue: text("issue").notNull(),
  cohort: text("cohort").notNull(),
  locale: text("locale").notNull(),
  statement: text("statement").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

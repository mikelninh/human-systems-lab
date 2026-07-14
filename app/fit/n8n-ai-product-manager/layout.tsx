import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Michael Ninh × n8n — AI Product Manager",
  description: "A focused, evidence-backed application for n8n's AI Product Manager role: AI Trust, evals, agent harnesses and visible building.",
};

export default function N8nFitLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}

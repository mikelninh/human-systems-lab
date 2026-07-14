import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gesetzes-Check — Stability for Everyone",
  description: "Ein transparenter Stresstest für Gesetze: reale Lebenslagen, Safety Gates und messbare gesellschaftliche Outcomes.",
};

export default function PolicyEvalLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}

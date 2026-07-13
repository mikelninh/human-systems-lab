import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impact Sprint — mehr Wirkung in 72 Stunden",
  description: "Ein testbarer Funnel für mehr Spenden, Mitglieder oder Volunteers — Festpreis, Übergabe und messbares Ergebnis.",
  openGraph: {
    title: "Impact Sprint — 72 Stunden",
    description: "Ein Engpass. Ein echter Test. Mehr Wirkung für soziale Organisationen.",
    type: "website",
  },
};

export default function ImpactSprintLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anspruch Direkt — Hilfe verständlich finden",
  description: "Ein anonymer, mehrsprachiger Kurz-Check führt von der Lebenslage zu einer offiziellen Anlaufstelle und einem klaren nächsten Schritt.",
  openGraph: {
    title: "Anspruch Direkt",
    description: "Hilfe finden, ohne das ganze System verstehen zu müssen.",
    type: "website",
  },
};

export default function AnspruchDirektLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}

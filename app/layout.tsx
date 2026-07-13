import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Impact Sprint — digitale Systeme für sozialen Wandel",
  description: "Fördern Sie einen 7-Tage Digital-Sprint für eine soziale Organisation: klarer Funnel, Automatisierung und transparente Wirkung.",
  other: { "codex-preview": "development" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="de"><body>{children}</body></html>;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Michael Ninh × deepset — Value Engineer",
  description: "A public-sector account thesis and evidence-backed application for deepset's Value Engineer role.",
};

export default function DeepsetFitLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}

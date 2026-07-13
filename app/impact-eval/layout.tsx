import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impact Eval Suite — Human Systems Lab",
  description: "A public, testable evaluation framework for safer AI products and measurable public value.",
};

export default function ImpactEvalLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}

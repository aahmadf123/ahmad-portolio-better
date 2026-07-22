import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Fact Checking (DeepTruth) - Ahmad Firas",
  description: "A hybrid framework evaluating claim accuracy using fine-tuned LLaMA models and programmatic validation.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

import { caseStudyMetadata } from "@/lib/case-study-metadata";

export const metadata = caseStudyMetadata(
  "deeptruth-ai-fact-checking",
  "AI Fact Checking (DeepTruth)",
  "A hybrid framework evaluating claim accuracy using fine-tuned LLaMA models and programmatic validation.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

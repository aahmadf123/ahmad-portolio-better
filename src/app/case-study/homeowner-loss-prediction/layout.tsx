import { caseStudyMetadata } from "@/lib/case-study-metadata";

export const metadata = caseStudyMetadata(
  "homeowner-loss-prediction",
  "Homeowner Loss Prediction MLOps",
  "Production-style MLOps system that automates actuarial workflows into model-governed, auditable pipelines.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

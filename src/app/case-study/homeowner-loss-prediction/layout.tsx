import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Homeowner Loss Prediction MLOps — Ahmad Firas",
  description: "Production-style MLOps system that automates actuarial workflows into model-governed, auditable pipelines.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

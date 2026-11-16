import { caseStudyMetadata } from "@/lib/case-study-metadata";

export const metadata = caseStudyMetadata(
  "toledo-athletics-onboarding-portal",
  "Athletics Onboarding Portal",
  "A centralized digital portal expediting NCAA athlete onboarding and document flows.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

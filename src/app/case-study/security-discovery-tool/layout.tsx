import { caseStudyMetadata } from "@/lib/case-study-metadata";

export const metadata = caseStudyMetadata(
  "security-discovery-tool",
  "Security Discovery Tool",
  "A centralized scanning orchestration tool mapping network vulnerabilities to targeted CVE definitions.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

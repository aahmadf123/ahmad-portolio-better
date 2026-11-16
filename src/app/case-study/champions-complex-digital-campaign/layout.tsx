import { caseStudyMetadata } from "@/lib/case-study-metadata";

export const metadata = caseStudyMetadata(
  "champions-complex-digital-campaign",
  "Champions Complex Digital Campaign",
  "Enterprise marketing engine that converts complex asset hierarchies into automated multi-channel campaigns.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

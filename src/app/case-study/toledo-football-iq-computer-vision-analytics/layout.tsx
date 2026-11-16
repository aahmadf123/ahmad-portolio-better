import { caseStudyMetadata } from "@/lib/case-study-metadata";

export const metadata = caseStudyMetadata(
  "toledo-football-iq-computer-vision-analytics",
  "Football IQ Analytics",
  "Computer vision spatial telemetry pipeline extracting sports play intelligence from raw drone camera footage.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

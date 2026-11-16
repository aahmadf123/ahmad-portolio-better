import { caseStudyMetadata } from "@/lib/case-study-metadata";

export const metadata = caseStudyMetadata(
  "camel-car-cheme-car-control-system",
  "Chemical Car Control System",
  "An autonomous embedded controller using custom state machine architecture and sensor feedback.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

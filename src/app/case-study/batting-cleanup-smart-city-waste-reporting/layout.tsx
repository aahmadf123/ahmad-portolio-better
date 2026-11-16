import { caseStudyMetadata } from "@/lib/case-study-metadata";

export const metadata = caseStudyMetadata(
  "batting-cleanup-smart-city-waste-reporting",
  "Smart City Waste Reporting",
  "Civic technology platform connecting QR codes, edge-hosted APIs, geospatial validation, and PostGIS telemetry.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Smart City Waste Reporting - Ahmad Firas",
  description: "Civic technology platform connecting QR codes, edge-hosted APIs, geospatial validation, and PostGIS telemetry.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

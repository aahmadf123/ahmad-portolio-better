import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security Discovery Tool - Ahmad Firas",
  description: "A centralized scanning orchestration tool mapping network vulnerabilities to targeted CVE definitions.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

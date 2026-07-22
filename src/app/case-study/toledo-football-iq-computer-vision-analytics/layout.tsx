import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Football IQ Analytics - Ahmad Firas",
  description: "Computer vision spatial telemetry pipeline extracting sports play intelligence from raw drone camera footage.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

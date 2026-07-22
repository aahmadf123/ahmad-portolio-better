import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Athletics Onboarding Portal - Ahmad Firas",
  description: "A centralized digital portal expediting NCAA athlete onboarding and document flows.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chemical Car Control System - Ahmad Firas",
  description: "An autonomous embedded controller using custom state machine architecture and sensor feedback.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

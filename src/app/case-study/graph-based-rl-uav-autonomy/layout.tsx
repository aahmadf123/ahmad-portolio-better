import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Graph-Based RL UAV Autonomy — Ahmad Firas",
  description: "Autonomous multi-UAV path planning in highly complex corridors modeled with Graph Neural Networks and RL.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

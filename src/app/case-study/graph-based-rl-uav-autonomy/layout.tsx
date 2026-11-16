import { caseStudyMetadata } from "@/lib/case-study-metadata";

export const metadata = caseStudyMetadata(
  "graph-based-rl-uav-autonomy",
  "Graph-Based RL UAV Autonomy",
  "Autonomous multi-UAV path planning in highly complex corridors modeled with Graph Neural Networks and RL.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

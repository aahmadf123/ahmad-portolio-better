import { caseStudyMetadata } from "@/lib/case-study-metadata";

export const metadata = caseStudyMetadata(
  "deepflyer-drone-reinforcement-learning",
  "Drone Reinforcement Learning",
  "An educational drone RL platform incorporating PPO agent training, reward editing, and Gazebo simulations.",
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

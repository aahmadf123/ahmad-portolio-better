import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Drone Reinforcement Learning - Ahmad Firas",
  description: "An educational drone RL platform incorporating PPO agent training, reward editing, and Gazebo simulations.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

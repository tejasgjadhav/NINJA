import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = {
  title: "Portfolio Dashboard — NINJA Advisory",
};

export default function DashboardPage() {
  return <DashboardShell />;
}

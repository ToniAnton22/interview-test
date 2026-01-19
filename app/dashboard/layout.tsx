import { ProjectsProvider } from "@/lib/providers/ProjectsProvider";
import "../globals.css";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /**
   * Dashboard layout wrapper.
   *
   * Wraps all dashboard routes in ProjectsProvider to enable:
   * 1. Shared state across dashboard components (no prop drilling)
   * 2. Centralized alert/toast notification system
   * 3. Real-time subscription management
   *
   * This layout pattern ensures every dashboard page has access to the
   * same context without manually passing providers down.
   */
  return <ProjectsProvider>{children}</ProjectsProvider>;
}

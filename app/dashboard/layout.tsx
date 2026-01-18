import { ProjectsProvider } from "@/lib/providers/ProjectsProvider";
import "../globals.css";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProjectsProvider>{children}</ProjectsProvider>;
}

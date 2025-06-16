/* src/app/(dashboard)/dashboard/layout.tsx */
import { ReactNode } from "react";
import DashboardShell from "../_components/DashboardShell";

export default function DashboardInnerLayout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}

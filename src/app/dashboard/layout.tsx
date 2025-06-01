// 🚫 no "use client" here
import "../globals.css";
import { ReactNode } from "react";

import DashboardShell from "./_components/DashboardShell";
import AuthWrapper from "./_components/AuthWrapper";

export const revalidate = 0; // disable caching of this layout

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // 3️⃣ if we got here, the user is authenticated

  return (
    <AuthWrapper>
      <DashboardShell>{children}</DashboardShell>
    </AuthWrapper>
  );
}

// app/dashboard/_components/DashboardShell.tsx
"use client";

import { ReactNode } from "react";
import { SidebarProvider, DrawerToggle } from "./SidebarShell";
import { Toaster } from "react-hot-toast";

export default function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* place this near the top so it renders above everything */}
      <Toaster
        position="top-center"
        toastOptions={{
          // Default options for all toasts
          className: "rounded-lg bg-brand-primary text-white px-4 py-2 shadow-lg",
          duration: 4000,
          style: {
            border: "1px solid var(--border)", // your CSS var
          },
          success: {
            iconTheme: {
              primary: "#fff",
              secondary: "var(--brand-secondary)",
            },
          },
          error: {
            iconTheme: {
              primary: "#fff",
              secondary: "var(--brand-error)",
            },
          },
        }}
      />

      <SidebarProvider>
        {/* mobile top‐bar */}
        <header className="lg:hidden flex items-center gap-3 border-b px-4 py-3">
          <DrawerToggle />
          <span className="font-bold">Dashboard</span>
        </header>

        {/* page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </SidebarProvider>
    </div>
  );
}

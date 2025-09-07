"use client";

import { ReactNode } from "react";
import { SidebarProvider, DrawerToggle } from "./SidebarShell";
import { Toaster } from "react-hot-toast";
import ThemeToggle from "./ThemeToggle";

export default function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-background-primary">
      <Toaster
        position="top-center"
        toastOptions={{
          className: "rounded-lg bg-brand-primary text-white px-4 py-2 shadow-lg",
          duration: 4000,
          style: {
            border: "1px solid var(--border)",
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
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center justify-between gap-3 border-b border-border-secondary bg-background-secondary px-4 py-3">
          <div className="flex items-center gap-3">
            <DrawerToggle />
            <span className="font-bold">Dashboard</span>
          </div>
          <ThemeToggle />
        </header>

        {/* Main content layout */}
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 bg-background-primary">{children}</main>
        </div>
      </SidebarProvider>
    </div>
  );
}

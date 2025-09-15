"use client";

import { ReactNode } from "react";
import { SidebarProvider, DrawerToggle } from "./SidebarShell";
import { Toaster } from "react-hot-toast";
import ThemeToggle from "./ThemeToggle";

export default function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-background-primary transition-colors duration-200">
      <Toaster
        position="top-center"
        toastOptions={{
          className:
            "rounded-lg bg-brand-primary text-white px-4 py-2 shadow-lg dark:shadow-black/30",
          duration: 4000,
          style: {
            border: "1px solid hsl(var(--border))",
            background: "hsl(var(--bg-brand-solid))",
            color: "hsl(var(--text-primary-on-brand))",
          },
          success: {
            iconTheme: {
              primary: "hsl(var(--text-primary-on-brand))",
              secondary: "hsl(var(--bg-brand-secondary))",
            },
          },
          error: {
            iconTheme: {
              primary: "hsl(var(--text-primary-on-brand))",
              secondary: "hsl(var(--bg-error-solid))",
            },
          },
        }}
      />

      <SidebarProvider>
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center justify-between gap-3 border-b border-border-secondary bg-background-secondary px-4 py-3 sticky top-0 z-30 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <DrawerToggle />
            <span className="font-bold text-text-primary">Dashboard</span>
          </div>
          <ThemeToggle />
        </header>

        {/* Main content layout */}
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto bg-background-primary transition-colors duration-200">
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}

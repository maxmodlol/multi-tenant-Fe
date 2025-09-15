"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "@/src/components/layout/sideBar";

/* ───────────────────────── shared drawer state ─────────────────────────── */
const SidebarCtx = createContext<{
  open: boolean;
  setOpen: (v: boolean) => void;
} | null>(null);

/* ────────────────────────── Provider with drawer ───────────────────────── */
export function SidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    const handleRouteChange = () => setOpen(false);
    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  return (
    <SidebarCtx.Provider value={{ open, setOpen }}>
      {/* backdrop (mobile only) */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-[280px] sm:w-[300px] border-r border-border-secondary bg-background-secondary
                      transition-transform duration-300 ease-in-out
                      lg:static lg:translate-x-0 lg:w-[260px] ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <Sidebar onClose={() => setOpen(false)} />
      </div>

      {children}
    </SidebarCtx.Provider>
  );
}

/* ────────────────────────── Hamburger button ───────────────────────────── */
export function DrawerToggle() {
  const api = useContext(SidebarCtx);
  if (!api) return null; // should never happen
  return (
    <button
      onClick={() => api.setOpen(true)}
      className="rounded-md border border-border-secondary bg-background-secondary p-2 lg:hidden hover:bg-background-secondary/80 transition-colors"
      aria-label="Open sidebar"
    >
      <Menu className="h-5 w-5 text-text-primary" />
    </button>
  );
}

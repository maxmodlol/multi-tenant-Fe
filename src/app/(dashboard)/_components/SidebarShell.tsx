"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { Menu } from "lucide-react";
import Sidebar from "@/src/components/layout/sideBar";

/* ───────────────────────── shared drawer state ─────────────────────────── */
const SidebarCtx = createContext<{
  open: boolean;
  setOpen: (v: boolean) => void;
} | null>(null);

/* ────────────────────────── Provider with drawer ───────────────────────── */
export function SidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <SidebarCtx.Provider value={{ open, setOpen }}>
      {/* backdrop (mobile only) */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-[260px] border-r bg-background
                      transition-transform duration-300
                      lg:static lg:translate-x-0 ${open ? "translate-x-0" : "translate-x-full"}`}
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
    <button onClick={() => api.setOpen(true)} className="rounded-md border p-2 lg:hidden">
      <Menu className="h-5 w-5" />
    </button>
  );
}

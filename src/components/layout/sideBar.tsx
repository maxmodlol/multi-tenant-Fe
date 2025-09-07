"use client";

import { useState, useRef, useEffect } from "react";
import {
  Briefcase,
  BookOpen,
  LayoutGrid,
  Home,
  Settings,
  ChevronDown,
  LogOut,
  Plus,
  Building2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import ThemeToggle from "@/src/app/(dashboard)/_components/ThemeToggle";

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const name = session?.user?.name || "Unknown User";
  const email = session?.user?.email || "";

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  const role = session?.user?.role;
  const nav = [
    { href: "/dashboard", label: "الرئيسية", icon: Home, show: true },
    // All Blogs (approvals) → only ADMIN or ADMIN_HELPER
    {
      href: "/dashboard/blogs",
      label: "المدونات",
      icon: Briefcase,
      show: role === "ADMIN" || role === "ADMIN_HELPER",
    },
    // My Blog + categories → only Publisher/Editor teams
    { href: "/dashboard/reports", label: "التقارير", show: role !== "EDITOR", icon: Briefcase },
    {
      href: "/dashboard/my-blog",
      label: "مدونتي",
      icon: BookOpen,
      show: role === "PUBLISHER" || role === "EDITOR",
    },
    {
      href: "/dashboard/categories",
      label: "التصنيفات",
      icon: LayoutGrid,
      show: role === "PUBLISHER" || role === "EDITOR",
    },
    { href: "/dashboard/settings", label: "الإعدادات", icon: Settings, show: true },
    // Admin-only: Tenant Management
    {
      href: "/dashboard/tenants",
      label: "إدارة المستأجرين",
      icon: Building2,
      show: role === "ADMIN",
    },
  ];

  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col border-r border-border-secondary bg-background-secondary px-6 py-8 shadow-lg dark:shadow-black/30 dark:bg-gradient-1-dark">
      {/* Logo links to dashboard home */}
      <Link href="/dashboard" className="-mx-2 mb-12 flex items-center gap-2">
        <Image src="/logo.svg" alt="Logo" width={120} height={28} priority className="h-8 w-auto" />
      </Link>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 text-[15px] font-medium">
        {nav
          .filter((n) => n.show)
          .map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition border ${
                  active
                    ? "bg-background-primary/70 border-border-secondary text-text-primary"
                    : "bg-background-secondary/60 border-transparent text-text-secondary hover:bg-background-secondary/80 hover:text-text-primary"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0 opacity-70" />
                <span>{label}</span>
              </Link>
            );
          })}

        {/* ➕ Add New Blog Button (hidden for ADMIN) */}
        {(role === "PUBLISHER" || role === "EDITOR") && (
          <Link
            href="/dashboard/blogs/editor/new"
            onClick={onClose}
            className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-background-brand-solid px-4 py-2 text-text-primary-brand hover:bg-background-brand-solid-hover transition"
          >
            <Plus className="h-4 w-4" />
            <span>إنشاء تدوينة جديدة</span>
          </Link>
        )}

        {/* 🌓 Theme Toggle */}
        <div className="mt-2 px-2">
          <ThemeToggle />
        </div>
      </nav>

      {/* 👤 Profile + Logout */}
      <div className="mt-auto relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex w-full items-center gap-4 rounded-xl border border-gray-300 px-4 py-3 text-left shadow-sm hover:bg-muted/30"
        >
          <div className="relative">
            <Image
              src={session?.user?.image || "/icons/author-avatar.svg"}
              alt="avatar"
              width={44}
              height={44}
              className="h-11 w-11 rounded-full object-cover"
            />
            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-950" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-semibold leading-none">{name}</p>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          </div>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-muted-foreground transform transition ${
              menuOpen ? "rotate-0" : "rotate-180"
            }`}
          />
        </button>

        {menuOpen && (
          <div className="absolute bottom-full mb-2 right-0 w-full rounded-lg border border-gray-300 bg-background shadow-lg">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex w-full items-center gap-2 px-4 py-2 hover:bg-muted"
            >
              <LogOut className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">تسجيل الخروج</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

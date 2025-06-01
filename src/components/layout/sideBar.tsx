// app/(dashboard)/_components/Sidebar.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Briefcase, BookOpen, LayoutGrid, Settings, ChevronDown, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const name = session?.user?.name || "Unknown User";
  const email = session?.user?.email || "";

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  const nav = [
    { href: "/dashboard/blogs", label: "المدونات", icon: Briefcase },
    { href: "/dashboard/my-blog", label: "مدونتي", icon: BookOpen },
    { href: "/dashboard/categories", label: "التصنيفات", icon: LayoutGrid },
    { href: "/dashboard/settings", label: "الإعدادات", icon: Settings },
  ];

  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col border-r bg-background px-6 py-8 shadow-lg dark:shadow-black/30">
      <Link href="/dashboard/settings" className="-mx-2 mb-12 flex items-center gap-2">
        <Image src="/logo.svg" alt="Logo" width={120} height={28} priority className="h-8 w-auto" />
      </Link>

      <nav className="flex flex-col gap-6 text-[17px] font-medium">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-lg px-4 py-2 transition ${
                active
                  ? "bg-muted font-semibold text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0 opacity-70" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex w-full items-center gap-4 rounded-xl border border-gray-300 px-4 py-3 text-left shadow-sm hover:bg-muted/30"
        >
          <div className="relative">
            <Image
              src={session?.user?.image || "/icons/author-avatar.png"}
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
          <div className="absolute bottom-full mb-2 right-0 w-full rounded-lg  border border-gray-300 bg-background shadow-lg">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex w-full items-center gap-2 px-4 py-2 hover:bg-muted"
            >
              <LogOut className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">Sign out</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

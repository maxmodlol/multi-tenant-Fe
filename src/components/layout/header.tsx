// components/Header.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Menu, Moon, Search, X } from "lucide-react";
import { Button } from "@explore/components/ui/button";
import ResponsiveMenu from "./ResponsiveMenu";
import Link from "next/link";
import SearchOverlay from "@explore/components/SearchOverlay";

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // On mount: read saved theme (or system) and initialize
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (saved === "dark" || (!saved && systemDark)) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }

    setMounted(true);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (!mounted) return null;

  const toggleDark = () => {
    const next = !isDark;
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    setIsDark(next);
  };

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      {/* neon animated gradient backdrop */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-r from-indigo-200 via-brand-300 to-blue-400
          bg-[length:300%_300%] animate-gradient-x
          opacity-60 blur-2xl pointer-events-none"
      />

      <header
        role="banner"
        className="
          relative flex items-center justify-between
          px-8 py-4
          backdrop-blur-lg bg-black/30 dark:bg-white/10
          border-b border-brand-400/30 dark:border-brand-400/30
          shadow-[0_0_20px_rgba(0,55,155,0.5)]"
      >
        {/* MENU BUTTON */}
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:shadow-[0_0_10px_rgba(0,255,255,0.7)] transition"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>

        {/* LOGO */}
        <Link
          href="/"
          aria-label="Home"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <img
            src="/logo.svg"
            alt="Logo"
            className="h-10 w-auto drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          />
        </Link>

        {/* ACTIONS */}
        {!isMobile && (
          <div className="flex items-center space-x-5">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:shadow-[0_0_10px_rgba(255,0,255,0.7)] transition"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              onClick={toggleDark}
            >
              <Moon className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:shadow-[0_0_10px_rgba(0,255,255,0.7)] transition"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="w-6 h-6" />
            </Button>
          </div>
        )}
      </header>

      {/* MOBILE MENU */}
      {menuOpen && isMobile && (
        <nav className="fixed inset-0 top-[70px] bg-gray-50 dark:bg-gray-900 z-40 p-6">
          <ResponsiveMenu
            isDark={isDark}
            toggleDarkMode={toggleDark}
            closeMenu={() => setMenuOpen(false)}
            isMobile
          />
        </nav>
      )}

      {/* DESKTOP DROPDOWN */}
      {menuOpen && !isMobile && (
        <nav className="absolute top-[70px] right-8 bg-black/50 dark:bg-white/20 backdrop-blur-lg rounded-xl p-6 shadow-lg z-40">
          <ResponsiveMenu
            isDark={isDark}
            toggleDarkMode={toggleDark}
            closeMenu={() => setMenuOpen(false)}
            isMobile={false}
          />
        </nav>
      )}

      {/* SEARCH OVERLAY */}
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </div>
  );
}

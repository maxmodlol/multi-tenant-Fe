"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@explore/components/ui/button";
import ResponsiveMenu from "./ResponsiveMenu";
import SearchOverlay from "@explore/components/SearchOverlay";

// Dynamically import Lucide icons so they don’t bloat the initial JS bundle:
const MenuIcon = dynamic(() => import("lucide-react").then((mod) => mod.Menu), { ssr: false });
const XIcon = dynamic(() => import("lucide-react").then((mod) => mod.X), { ssr: false });
const MoonIcon = dynamic(() => import("lucide-react").then((mod) => mod.Moon), { ssr: false });
const SearchIcon = dynamic(() => import("lucide-react").then((mod) => mod.Search), { ssr: false });

interface HeaderProps {
  logoLightUrl: string;
  logoDarkUrl: string;
  headerStyle: "gradient" | "solid";
  headerColor: string | undefined;
}

export default function Header({
  logoLightUrl,
  logoDarkUrl,
  headerStyle,
  headerColor,
}: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const gradientOn = headerStyle === "gradient";

  useEffect(() => {
    // (A) Theme initialization
    try {
      const saved = localStorage.getItem("theme");
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (saved === "dark" || (!saved && systemDark)) {
        document.documentElement.classList.add("dark");
        setIsDark(true);
      } else {
        document.documentElement.classList.remove("dark");
        setIsDark(false);
      }
    } catch {}

    // (B) Mobile detection
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);

    setMounted(true);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Prevent rendering the header on the server-side pass (avoids hydration mismatch).
  if (!mounted) {
    return null;
  }

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

  // (C) Choose which logo to render
  let logoUrl = logoLightUrl;
  if (isDark && logoDarkUrl) {
    logoUrl = logoDarkUrl;
  } else if (!isDark && logoLightUrl) {
    logoUrl = logoLightUrl;
  }

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      {/* Optional “neon gradient” backdrop */}
      {gradientOn && !isMobile && (
        <div
          aria-hidden
          className="
            absolute inset-0
            bg-gradient-to-r from-indigo-200 via-brand-300 to-blue-400
            bg-[length:300%_300%] animate-gradient-x
            opacity-60 blur-2xl pointer-events-none
          "
        />
      )}

      <header
        role="banner"
        className="
          relative flex items-center justify-between
          px-4 py-3 md:px-8 md:py-4
            backdrop-blur-lg bg-black/20 dark:bg-white/10
          border-b border-brand-400/30 dark:border-brand-400/30
          shadow-lg
          transition-colors
        "
        style={
          gradientOn
            ? undefined
            : {
                // light & dark both get the same hue; tweak if you prefer different tints
                backgroundColor: `hsl(${headerColor})`,
                borderBottom: `1px solid hsla(${headerColor},0.3)`,
              }
        }
      >
        {/* MENU BUTTON */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-white hover:text-brand-200 transition"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </Button>

        {/* LOGO (Next.js <Image> for explicit sizing) */}
        <Link href="/" aria-label="Home">
          <Image
            src={logoUrl}
            alt="Logo"
            width={50} // adjust to your actual logo dimensions
            height={50}
            priority // mark as LCP if this is critical
            className="object-contain h-[60px] w-[60px] "
          />
        </Link>

        {/* DESKTOP ACTIONS */}
        {!isMobile && (
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-brand-200 transition"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              onClick={toggleDark}
            >
              <MoonIcon className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-brand-200 transition"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <SearchIcon className="w-6 h-6" />
            </Button>
          </div>
        )}
      </header>

      {/* MOBILE MENU */}
      {menuOpen && isMobile && (
        <nav className="fixed inset-0 top-[64px] bg-gray-50 dark:bg-gray-900 z-40 p-6">
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
        <nav className="absolute top-[64px] right-6 bg-black/40 dark:bg-white/20 backdrop-blur-lg rounded-lg p-4 shadow-lg z-40">
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

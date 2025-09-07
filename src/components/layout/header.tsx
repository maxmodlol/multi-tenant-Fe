"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@explore/components/ui/button";
import ResponsiveMenu from "./ResponsiveMenu";
import SearchOverlay from "@explore/components/SearchOverlay";
import { HeaderAd } from "@/src/components/TenantAdInjector";
import type { PageType } from "@/src/types/tenantAds";

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

// Helper function to detect page type from pathname
function getPageTypeFromPathname(pathname: string): PageType {
  if (pathname === "/" || pathname === "/home") return "home";
  if (pathname.startsWith("/category/")) return "category";
  if (pathname.startsWith("/search")) return "search";
  if (pathname.startsWith("/blog/")) return "blog";
  if (pathname.startsWith("/blogs")) return "blog-list";
  if (pathname.startsWith("/about")) return "about";
  if (pathname.startsWith("/contact")) return "contact";
  return "home"; // default fallback
}

export default function Header({
  logoLightUrl,
  logoDarkUrl,
  headerStyle,
  headerColor,
}: HeaderProps) {
  const pathname = usePathname();
  const pageType = getPageTypeFromPathname(pathname);
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

  // (C) Determine header visual mode and logo
  const isColoredHeader = !isDark && headerStyle === "solid" && Boolean(headerColor);
  let logoUrl = isDark && logoDarkUrl ? logoDarkUrl : logoLightUrl;

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      {/* Subtle gradient backdrop */}
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
        className={clsx(
          "relative flex flex-row items-center justify-between px-4 py-3 md:px-8 md:py-4 transition-colors",
          // Transparent base; keep a subtle shadow under header in all cases
          "shadow-md",
          // If gradient style and desktop: show gradient layer via the backdrop element above
          gradientOn && !isColoredHeader && "bg-transparent",
          // If not colored (transparent), avoid tint and blur
          !isColoredHeader && "bg-transparent",
        )}
        style={
          isColoredHeader
            ? {
                // Slight transparency so the solid header isn't too strong
                backgroundColor: `hsla(${headerColor} / 0.85)`,
              }
            : undefined
        }
      >
        {/* DESKTOP ACTIONS - LEFT SIDE */}
        {!isMobile && (
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className={clsx(
                isColoredHeader
                  ? "text-white hover:opacity-80"
                  : "text-black hover:opacity-70 dark:text-white",
                "transition",
              )}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              onClick={toggleDark}
            >
              <MoonIcon className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={clsx(
                isColoredHeader
                  ? "text-white hover:opacity-80"
                  : "text-black hover:opacity-70 dark:text-white",
                "transition",
              )}
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <SearchIcon className="w-6 h-6" />
            </Button>
          </div>
        )}

        {/* LOGO - CENTER */}
        <Link href="/" aria-label="Home" className="flex-1 flex justify-center">
          <Image
            src={logoUrl}
            alt="Logo"
            width={80}
            height={40}
            priority
            className="object-contain h-[40px] w-[80px]"
          />
        </Link>

        {/* MENU BUTTON - RIGHT SIDE */}
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
        <nav className="absolute top-[64px] left-6 bg-black/40 dark:bg-white/20 backdrop-blur-lg rounded-lg p-4 shadow-lg z-40">
          <ResponsiveMenu
            isDark={isDark}
            toggleDarkMode={toggleDark}
            closeMenu={() => setMenuOpen(false)}
            isMobile={false}
          />
        </nav>
      )}

      {/* Header Ad - Below the main header */}
      <HeaderAd pageType={pageType} />

      {/* SEARCH OVERLAY */}
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </div>
  );
}

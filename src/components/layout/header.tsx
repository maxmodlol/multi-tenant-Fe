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
  const isColoredHeaderDark = isDark && headerStyle === "solid" && Boolean(headerColor);
  const isSolidHeader = headerStyle === "solid";
  const brandHsl = headerColor ?? undefined;
  const isColoredLight = !isDark && Boolean(brandHsl);
  const isColoredLightDark = isDark && Boolean(brandHsl);
  let logoUrl = isDark && logoDarkUrl ? logoDarkUrl : logoLightUrl;

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      {/* Gradient backdrop with brand colors */}
      {gradientOn && (
        <div
          aria-hidden
          className={clsx(
            "absolute inset-0 bg-gradient-to-r from-indigo-200 via-brand-300 to-blue-400 pointer-events-none",
            isMobile
              ? "opacity-50 blur-2xl" // Less color, no animation on mobile
              : "bg-[length:300%_300%] animate-gradient-x opacity-85 blur-xl", // Full effect on desktop
          )}
        />
      )}

      {/* Brand gradient backdrop for gradient headers */}
      {gradientOn && brandHsl && (
        <div
          aria-hidden
          className={clsx(
            "absolute inset-0 pointer-events-none",
            isMobile
              ? "opacity-60 blur-2xl" // Less color, no animation on mobile
              : "bg-[length:300%_300%] animate-gradient-x opacity-90 blur-lg", // Full effect on desktop
          )}
          style={{
            background: isMobile
              ? `linear-gradient(90deg, hsla(${brandHsl} / 0.6), hsla(${brandHsl} / 0.4), hsla(${brandHsl} / 0.6))` // Reduced color intensity on mobile
              : `linear-gradient(90deg, hsla(${brandHsl} / 0.9), hsla(${brandHsl} / 0.8), hsla(${brandHsl} / 0.9))`, // Full color on desktop
          }}
        />
      )}

      <header
        role="banner"
        className={clsx(
          "relative flex flex-row items-center justify-between px-4 py-3 md:px-8 md:py-4 transition-colors",
          // Shadow styling based on header type
          isColoredHeaderDark ? "shadow-md" : gradientOn && brandHsl ? "shadow-lg" : "shadow-md",
          // Default background for non-colored headers
          !isColoredHeader &&
            !isColoredLight &&
            !isColoredHeaderDark &&
            !isColoredLightDark &&
            !gradientOn &&
            !isSolidHeader &&
            "bg-white/98 dark:bg-gray-900/98",
        )}
        style={
          isColoredHeader
            ? {
                // Light mode solid header with brand color
                backgroundColor: `hsla(${headerColor} / 0.98)`,
              }
            : isColoredHeaderDark
              ? {
                  // Dark mode solid header with brand color - dark with subtle brand effect
                  background: `radial-gradient(1200px 300px at 50% -5%, hsla(${headerColor} / 0.2), transparent 50%), linear-gradient(180deg, rgba(17, 24, 39, 0.98), rgba(17, 24, 39, 0.99))`,
                }
              : isSolidHeader && !headerColor
                ? {
                    // Solid header without brand color - use dark background for white icons
                    backgroundColor: `${isDark ? "rgba(17, 24, 39, 0.98)" : "rgba(0, 0, 0, 0.98)"} !important`,
                  }
                : gradientOn && brandHsl
                  ? {
                      // Gradient header with strong brand colors
                      background: `radial-gradient(1600px 500px at 50% -10%, hsla(${brandHsl} / 0.5), transparent 60%), linear-gradient(180deg, hsla(${brandHsl} / 0.95), hsla(${brandHsl} / 0.98))`,
                      boxShadow: `0 4px 6px -1px hsla(${brandHsl} / 0.5), 0 2px 4px -1px hsla(${brandHsl} / 0.4)`,
                    }
                  : !gradientOn && isColoredLight
                    ? {
                        // Light mode non-gradient header with brand colors
                        background: `radial-gradient(1600px 500px at 50% -10%, hsla(${brandHsl} / 0.3), transparent 60%), linear-gradient(180deg, hsla(${brandHsl} / 0.97), hsla(${brandHsl} / 0.98))`,
                      }
                    : !gradientOn && isColoredLightDark
                      ? {
                          // Dark mode non-gradient header with brand colors
                          background: `radial-gradient(1600px 500px at 50% -10%, hsla(${brandHsl} / 0.3), transparent 60%), linear-gradient(180deg, hsla(${brandHsl} / 0.97), hsla(${brandHsl} / 0.98))`,
                        }
                      : undefined
        }
      >
        {/* DESKTOP ACTIONS - LEFT SIDE (only on desktop) */}
        {!isMobile && (
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className={clsx(
                isSolidHeader ? "hover:opacity-80" : "text-black hover:opacity-70 dark:text-white",
                "transition",
              )}
              style={isSolidHeader ? { color: "white !important" } : undefined}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              onClick={toggleDark}
            >
              <MoonIcon
                className="w-6 h-6"
                style={isSolidHeader ? { color: "white" } : undefined}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={clsx(
                isSolidHeader ? "hover:opacity-80" : "text-black hover:opacity-70 dark:text-white",
                "transition",
              )}
              style={isSolidHeader ? { color: "white !important" } : undefined}
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <SearchIcon
                className="w-6 h-6"
                style={isSolidHeader ? { color: "white" } : undefined}
              />
            </Button>
          </div>
        )}

        {/* LOGO - CENTER ON DESKTOP, LEFT ON MOBILE */}
        <Link
          href="/"
          aria-label="Home"
          className={clsx("flex", isMobile ? "justify-start" : "justify-center flex-1")}
        >
          <Image
            src={logoUrl}
            alt="Logo"
            width={80}
            height={40}
            priority
            className="object-contain h-[40px] w-[80px]"
          />
        </Link>

        {/* MENU BUTTON - RIGHT SIDE (both desktop and mobile) */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={clsx(
            isSolidHeader ? "hover:opacity-80" : "text-black hover:opacity-70 dark:text-white",
            "transition",
          )}
          style={isSolidHeader ? { color: "white !important" } : undefined}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? (
            <XIcon className="w-6 h-6" style={isSolidHeader ? { color: "white" } : undefined} />
          ) : (
            <MenuIcon className="w-6 h-6" style={isSolidHeader ? { color: "white" } : undefined} />
          )}
        </Button>
      </header>

      {/* MOBILE MENU */}
      {menuOpen && isMobile && (
        <nav className="fixed inset-0 top-[64px] bg-white/98 dark:bg-gray-900/98 backdrop-blur-md z-40 p-6">
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
        <nav className="absolute top-[64px] left-6 bg-black/60 dark:bg-white/30 backdrop-blur-md rounded-lg p-4 shadow-lg z-40">
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

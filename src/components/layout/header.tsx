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
  const isColoredHeaderDark = false; // Disabled: dark mode should use normal grey background
  const isSolidHeader = headerStyle === "solid";
  const brandHsl = headerColor ?? undefined;
  const isColoredLight = !isDark && Boolean(brandHsl);
  const isColoredLightDark = false; // Disabled: dark mode should use normal grey background
  let logoUrl = isDark && logoDarkUrl ? logoDarkUrl : logoLightUrl;

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      {/* Gradient backdrop with brand colors */}
      {gradientOn && (
        <div
          aria-hidden
          className={clsx(
            "absolute inset-0 bg-gradient-to-r from-indigo-200 via-brand-300 to-blue-400 pointer-events-none",
            "bg-[length:300%_300%] animate-gradient-x opacity-85 blur-md", // Full effect on desktop
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
              ? "opacity-60 blur-md" // Less color, no animation on mobile
              : "bg-[length:100%_100%] animate-gradient-x opacity-90 blur-md", // Full effect on desktop
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
          "shadow-md",
          // Default background for non-colored headers and dark mode solid headers
          (!isColoredHeader &&
            !isColoredLight &&
            !isColoredHeaderDark &&
            !isColoredLightDark &&
            !gradientOn &&
            !isSolidHeader) ||
            (isDark && isSolidHeader)
            ? isMobile
              ? "bg-white/90 dark:bg-gray-900/90"
              : "bg-white dark:bg-gray-900"
            : "",
        )}
        style={
          isColoredHeader
            ? {
                // Light mode solid header with brand color
                backgroundColor: `hsla(${headerColor} / 1)`,
              }
            : isSolidHeader && !headerColor
              ? {
                  // Solid header without brand color - use normal grey background in dark mode
                  backgroundColor: `${isDark ? "rgba(17, 24, 39, 1)" : "rgba(0, 0, 0, 1)"} !important`,
                }
              : gradientOn && brandHsl
                ? {
                    // Gradient header with strong brand colors
                    background: `radial-gradient(1600px 500px at 50% -10%, hsla(${brandHsl} / 0.8), transparent 60%), linear-gradient(180deg, hsla(${brandHsl} / 1), hsla(${brandHsl} / 1))`,
                    boxShadow: `0 4px 6px -1px hsla(${brandHsl} / 0.1), 0 2px 4px -1px hsla(${brandHsl} / 0.1)`,
                  }
                : !gradientOn && isColoredLight
                  ? {
                      // Light mode non-gradient header with brand colors
                      background: `radial-gradient(1600px 500px at 50% -10%, hsla(${brandHsl} / 0.5), transparent 60%), linear-gradient(180deg, hsla(${brandHsl} / 1), hsla(${brandHsl} / 1))`,
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
        <>
          {/* Backdrop overlay */}
          <div className="fixed inset-0 bg-black/10 z-30" onClick={() => setMenuOpen(false)} />
          <nav className="fixed inset-0 top-[64px] z-40 p-6 animate-in slide-in-from-top-2 duration-300">
            {/* Solid opaque background - no transparency */}
            <div
              className={`absolute inset-0 pointer-events-none ${
                isDark ? "bg-gray-900" : "bg-gray-100"
              }`}
              style={{ opacity: 1 }}
            />
            <ResponsiveMenu
              isDark={isDark}
              toggleDarkMode={toggleDark}
              closeMenu={() => setMenuOpen(false)}
              isMobile
            />
          </nav>
        </>
      )}

      {/* DESKTOP DROPDOWN */}
      {menuOpen && !isMobile && (
        <>
          {/* Backdrop overlay */}
          <div className="fixed inset-0 bg-black/5 z-30" onClick={() => setMenuOpen(false)} />
          <nav className="absolute top-[72px] left-6 rounded-2xl p-6 shadow-2xl z-40 min-w-[320px] border border-gray-200 dark:border-gray-700 animate-in slide-in-from-top-2 duration-300">
            {/* Solid opaque background - no transparency */}
            <div
              className={`absolute inset-0 pointer-events-none rounded-2xl ${
                isDark ? "bg-gray-900" : "bg-gray-100"
              }`}
              style={{ opacity: 1 }}
            />
            <ResponsiveMenu
              isDark={isDark}
              toggleDarkMode={toggleDark}
              closeMenu={() => setMenuOpen(false)}
              isMobile={false}
            />
          </nav>
        </>
      )}

      {/* Header Ad - Below the main header */}
      <HeaderAd pageType={pageType} />

      {/* SEARCH OVERLAY */}
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </div>
  );
}

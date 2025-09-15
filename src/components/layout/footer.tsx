"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Input } from "@explore/components/ui/input";
import { Button } from "@explore/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { FooterAd } from "@/src/components/TenantAdInjector";
import type { PageType } from "@/src/types/tenantAds";

interface FooterProps {
  logoLightUrl?: string | null;
  logoDarkUrl?: string | null;
  headerStyle?: "gradient" | "solid";
  headerColor?: string | null;
  baseColor?: string | null; // main brand hue independent of header style
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

export default function Footer({
  logoLightUrl,
  logoDarkUrl,
  headerStyle,
  headerColor,
  baseColor,
}: FooterProps) {
  const pathname = usePathname();
  const pageType = getPageTypeFromPathname(pathname);
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // On mount: read saved theme or system preference
  useEffect(() => {
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
    } catch {
      // fail silently
    }
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    setMounted(true);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Keep isDark in sync with theme changes in the same tab
  useEffect(() => {
    const root = document.documentElement;

    // Observe "dark" class toggles
    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains("dark"));
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    // Track system preference if no explicit theme chosen
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onMedia = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem("theme");
      if (!saved) setIsDark(e.matches);
    };
    try {
      media.addEventListener("change", onMedia);
    } catch {
      // Safari <14 fallback
      // @ts-ignore
      media.addListener(onMedia);
    }

    // Cross-tab changes to localStorage
    const onStorage = (e: StorageEvent) => {
      if (e.key === "theme") {
        const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const next = e.newValue;
        setIsDark(next === "dark" || (!next && systemDark));
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      observer.disconnect();
      try {
        media.removeEventListener("change", onMedia);
      } catch {
        // @ts-ignore
        media.removeListener(onMedia);
      }
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // Don’t render until mounted to avoid hydration mismatch
  if (!mounted) return null;

  // Pick the appropriate logo URL
  let logoUrl = "/logo.svg";
  if (isDark && logoDarkUrl) {
    logoUrl = logoDarkUrl;
  } else if (!isDark && logoLightUrl) {
    logoUrl = logoLightUrl;
  }

  // Map header behaviour → footer
  const gradientOn = headerStyle === "gradient";
  const brandHsl = baseColor ?? headerColor ?? undefined;
  const isColoredFooter = !isDark && headerStyle === "solid" && Boolean(headerColor);
  const isColoredFooterDark = false; // Disabled: dark mode should use normal grey background
  const isColoredLight = !isDark && Boolean(brandHsl);

  return (
    <footer
      role="contentinfo"
      className={`relative overflow-hidden pt-20 pb-10 ${
        isColoredFooter ? "text-white [&_*]:!text-white" : "text-white dark:text-black"
      } ${
        (!isColoredFooter && !isColoredFooterDark && !gradientOn && !isColoredLight) ||
        (isDark && headerStyle === "solid")
          ? "bg-white/90 dark:bg-gray-900/90"
          : ""
      }`}
      style={{
        ...(isColoredFooter
          ? { backgroundColor: `hsla(${headerColor} / 0.95)`, color: "white" }
          : !gradientOn && isColoredLight
            ? {
                background: `radial-gradient(1600px 500px at 50% -10%, hsla(${brandHsl} / 0.18), transparent 60%), linear-gradient(180deg, hsla(${brandHsl} / 0.92), hsla(${brandHsl} / 0.94))`,
              }
            : {}),
        ...(isColoredFooter ? { color: "white" } : {}),
      }}
    >
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

      {/* Brand gradient backdrop for solid headers */}
      {isColoredFooter && brandHsl && (
        <div
          aria-hidden
          className="
            absolute inset-0
            bg-[length:300%_300%] animate-gradient-x
            opacity-50 blur-2xl pointer-events-none
          "
          style={{
            background: `linear-gradient(90deg, hsla(${brandHsl} / 0.6), hsla(${brandHsl} / 0.4), hsla(${brandHsl} / 0.6))`,
          }}
        />
      )}
      {/* شريط التدرج النيون العلوي (only when not mirroring header gradient) */}
      {!gradientOn && (
        <div className="absolute inset-x-0 top-0 h-[2px]">
          <div
            className="h-full w-full animate-gradient-x"
            style={{
              backgroundImage: `linear-gradient(90deg, hsla(${brandHsl} / 0), hsla(${brandHsl} / 0.9), hsla(${brandHsl} / 0))`,
            }}
          />
        </div>
      )}

      {/* Mobile separator line - always visible with brand color animation */}
      <div className="absolute inset-x-0 top-0 h-[2px] md:hidden">
        <div
          className="h-full w-full animate-gradient-x"
          style={{
            backgroundImage: `linear-gradient(90deg, hsla(${brandHsl} / 0), hsla(${brandHsl} / 0.9), hsla(${brandHsl} / 0))`,
          }}
        />
      </div>

      {/* subtle authentic brand blobs */}
      {!gradientOn && isColoredLight && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full blur-3xl opacity-20 mix-blend-screen animate-blob-slow"
            style={{
              background: `radial-gradient(circle at 30% 30%, hsla(${brandHsl} / 0.15), hsla(${brandHsl} / 0.08), transparent 60%)`,
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-10 right-[-120px] w-[360px] h-[360px] rounded-full blur-3xl opacity-15 mix-blend-screen animate-blob-slower"
            style={{
              background: `radial-gradient(circle at 70% 40%, hsla(${brandHsl} / 0.12), hsla(${brandHsl} / 0.06), transparent 60%)`,
            }}
          />
        </>
      )}

      <div className="relative z-10 mx-auto max-w-screen-xl px-6">
        {/* Footer Ad - Above the footer content */}
        <FooterAd pageType={pageType} />

        {/* الشعار + الاشتراك */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" aria-label="الصفحة الرئيسية">
            <div className="relative w-[80px] h-[40px]">
              <Image src={logoUrl} alt="شعار الموقع" fill className="object-contain" priority />
            </div>
          </Link>
          <form aria-label="نموذج الاشتراك في النشرة الإخبارية" className="flex items-center gap-2">
            <Input
              type="email"
              name="email"
              placeholder="أدخل بريدك الإلكتروني"
              aria-label="عنوان بريدك الإلكتروني"
              className="min-w-[200px] border border-gray-300 dark:border-gray-700 bg-transparent text-inherit placeholder-gray-400"
            />
            <Button variant="primary" className="px-6 py-2 rounded-md shadow-none">
              اشترك
            </Button>
          </form>
        </div>

        {/* روابط سريعة */}
        <nav aria-label="روابط سريعة" className="mt-10">
          <ul className="flex flex-wrap justify-center md:justify-start gap-6 text-sm font-medium">
            <li>
              <Link href="/about" className="hover:opacity-80 transition">
                من نحن
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:opacity-80 transition">
                اتصل بنا
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:opacity-80 transition">
                سياسة الخصوصية
              </Link>
            </li>
            <li>
              <Link href="/publishers/join" className="hover:opacity-80 transition">
                انضم إلى الناشرين
              </Link>
            </li>
          </ul>
        </nav>

        {/* حقوق النشر */}
        <p className="mt-12 text-center md:text-left text-xs opacity-60">
          © {new Date().getFullYear()} مدونة الموقع. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
}

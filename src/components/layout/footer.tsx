"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@explore/components/ui/input";
import { Button } from "@explore/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface FooterProps {
  logoLightUrl?: string | null;
  logoDarkUrl?: string | null;
}

export default function Footer({ logoLightUrl, logoDarkUrl }: FooterProps) {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

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
    setMounted(true);
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

  return (
    <footer
      role="contentinfo"
      className="
        relative overflow-hidden
        bg-black dark:bg-white/5 text-white dark:text-black
        pt-16 pb-8
      "
    >
      {/* شريط التدرج النيون العلوي */}
      <div
        className="
          absolute inset-x-0 top-0 h-2
          bg-gradient-to-r from-indigo-400 via-brand-500 to-cyan-400
          bg-[length:200%_200%] animate-gradient-x
        "
      />

      <div className="relative z-10 mx-auto max-w-screen-xl px-6">
        {/* الشعار + الاشتراك */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" aria-label="الصفحة الرئيسية">
            <div className="relative w-[120px] h-[40px]">
              <Image
                src={logoUrl}
                alt="شعار الموقع"
                fill
                className="object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                priority
              />
            </div>
          </Link>
          <form aria-label="نموذج الاشتراك في النشرة الإخبارية" className="flex items-center gap-2">
            <Input
              type="email"
              name="email"
              placeholder="أدخل بريدك الإلكتروني"
              aria-label="عنوان بريدك الإلكتروني"
              className="min-w-[200px] bg-white/10 text-white placeholder-white/60 focus:bg-white/20"
            />
            <Button
              variant="ghost"
              className="
                bg-brand-500 hover:bg-brand-600
                text-black font-semibold
                px-6 py-2 rounded-full
                shadow-[0_0_10px_rgba(255,0,255,0.7)]
                transition
              "
            >
              اشترك
            </Button>
          </form>
        </div>

        {/* روابط سريعة */}
        <nav aria-label="روابط سريعة" className="mt-10">
          <ul className="flex flex-wrap justify-center md:justify-start gap-6 text-sm font-medium">
            <li>
              <Link href="/about" className="hover:text-cyan-400 transition">
                من نحن
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-cyan-400 transition">
                اتصل بنا
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-cyan-400 transition">
                سياسة الخصوصية
              </Link>
            </li>
            <li>
              <Link href="/publishers/join" className="hover:text-cyan-400 transition">
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

// components/Footer.tsx
"use client";

import { Input } from "@explore/components/ui/input";
import { Button } from "@explore/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
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
            <Image
              src="/logo.svg"
              alt="شعار الموقع"
              width={120}
              height={40}
              className="drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
            />
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

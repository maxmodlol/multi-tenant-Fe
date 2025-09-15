"use client";
import React, { useState } from "react";
import { Moon, X } from "lucide-react";
import Image from "next/image";
import { useCategories } from "@/src/hooks/public/useCategories";
import { Category } from "@explore/types/category";
import { Input } from "@explore/components/ui/input";
import { ResponsiveMenuProps } from "./types";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";
import IconWithFallback from "../IconWithFallback";

const ResponsiveMenu: React.FC<ResponsiveMenuProps> = ({
  isDark,
  toggleDarkMode,
  closeMenu,
  isMobile,
}) => {
  const { data: categories, isLoading, error } = useCategories();
  const [query, setQuery] = useState("");
  const router = useRouter();

  const onSearch = () => {
    if (query.trim().length > 0) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      closeMenu();
    }
  };

  return (
    <div
      className={`flex flex-col ${isMobile ? "h-full justify-between" : "gap-3 max-h-[70vh] overflow-y-auto"} ${isMobile ? "p-6" : "p-3"} ${isMobile ? "overflow-y-auto" : ""}`}
    >
      {/* Search bar (Mobile only) */}
      {isMobile && (
        <div className="mb-6">
          <div
            className={`relative rounded-xl border-2 ${
              isDark ? "bg-gray-900 border-gray-700" : "bg-gray-100 border-gray-400"
            } shadow-xl`}
          >
            <Input
              placeholder="ابحث هنا..."
              icon="search"
              value={query}
              autoFocus
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
              className={`w-full rounded-xl px-4 py-3 text-base font-semibold ${
                isDark
                  ? "bg-gray-900 text-white placeholder-gray-400"
                  : "bg-gray-100 text-gray-900 placeholder-gray-600"
              } border-0 focus:ring-0 focus:outline-none`}
            />
          </div>
        </div>
      )}

      {/* Navigation links */}
      <nav
        className={`flex flex-col ${isMobile ? "gap-3" : "gap-2"} ${!isMobile ? "max-h-[40vh] overflow-y-auto pr-2" : ""}`}
      >
        <a
          href="/"
          onClick={closeMenu}
          className={`group relative px-4 py-3 text-base font-bold rounded-xl transition-all duration-300 ${
            isDark
              ? "bg-gray-900 hover:bg-gray-800 text-white border-2 border-gray-700 hover:border-gray-600"
              : "bg-gray-100 hover:bg-gray-200 text-gray-900 border-2 border-gray-400 hover:border-gray-500"
          } shadow-lg hover:shadow-xl hover:scale-[1.02]`}
        >
          <span className="relative z-10">الصفحة الرئيسية</span>
          <div
            className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${
              isDark ? "bg-white" : "bg-gray-900"
            }`}
          ></div>
        </a>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Spinner />
          </div>
        ) : error ? (
          <div
            className={`px-4 py-3 rounded-xl border-2 shadow-lg ${
              isDark
                ? "bg-red-900 border-red-700 text-red-100"
                : "bg-red-100 border-red-400 text-red-800"
            }`}
          >
            <p className="text-base font-semibold">حدث خطأ أثناء جلب التصنيفات</p>
          </div>
        ) : (
          categories?.map((category: Category) => (
            <a
              key={category.id}
              href={`/category/${encodeURIComponent(category.name)}`}
              onClick={closeMenu}
              className={`group relative px-4 py-3 text-base font-bold rounded-xl transition-all duration-300 ${
                isDark
                  ? "bg-gray-900 hover:bg-gray-800 text-white border-2 border-gray-700 hover:border-gray-600"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900 border-2 border-gray-400 hover:border-gray-500"
              } shadow-lg hover:shadow-xl hover:scale-[1.02]`}
            >
              <span className="relative z-10">{category.name}</span>
              <div
                className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${
                  isDark ? "bg-white" : "bg-gray-900"
                }`}
              ></div>
            </a>
          ))
        )}
      </nav>

      {/* Dark mode toggle and Social Media Icons */}
      <div className={`${isMobile ? "mt-auto" : "mt-6"}`}>
        {/* Dark mode toggle (Mobile only) */}
        {isMobile && (
          <button
            onClick={toggleDarkMode}
            className={`group relative flex items-center gap-3 px-6 py-4 mb-6 rounded-xl transition-all duration-300 w-full font-bold border-2 shadow-lg hover:shadow-xl hover:scale-[1.02] ${
              isDark
                ? "bg-gray-900 hover:bg-gray-800 text-white border-gray-700 hover:border-gray-600"
                : "bg-white hover:bg-gray-50 text-gray-900 border-gray-300 hover:border-gray-400"
            }`}
          >
            <Moon
              fill={isDark ? "currentColor" : "none"}
              stroke="currentColor"
              className="!size-5 relative z-10"
            />
            <span className="text-base font-bold relative z-10">الوضع الليلي</span>
            <div
              className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${
                isDark ? "bg-white" : "bg-gray-900"
              }`}
            ></div>
          </button>
        )}

        {/* Social Media Icons - Copied from BlogFooterMeta */}
        <div className={`flex ${isMobile ? "justify-center gap-3" : "gap-2"} flex-wrap`}>
          {[
            {
              name: "WhatsApp",
              icon: "/icons/whatsapp.svg",
              color: "hover:bg-green-50 dark:hover:bg-green-900/20",
              href: "https://wa.me/",
            },
            {
              name: "Telegram",
              icon: "/icons/telegram.svg",
              color: "hover:bg-blue-50 dark:hover:bg-blue-900/20",
              href: "https://t.me/",
            },
            {
              name: "Facebook",
              icon: "/icons/facebook.svg",
              color: "hover:bg-blue-50 dark:hover:bg-blue-900/20",
              href: "https://www.facebook.com/",
            },
            {
              name: "Instagram",
              icon: "/icons/instagram.svg",
              color: "hover:bg-pink-50 dark:hover:bg-pink-900/20",
              href: "https://www.instagram.com/",
            },
            {
              name: "X",
              icon: "/icons/X.svg",
              color: "hover:bg-gray-50 dark:hover:bg-gray-900/20",
              href: "https://x.com/",
            },
          ].map((p) => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`مشاركة عبر ${p.name}`}
              className={`group relative bg-gray-50 dark:bg-gray-800 ${p.color} p-3 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg border border-gray-200 dark:border-gray-700 ${
                isMobile ? "w-12 h-12" : "w-10 h-10"
              } flex items-center justify-center flex-shrink-0`}
            >
              <IconWithFallback
                src={p.icon}
                alt={p.name}
                width={20}
                height={20}
                className="text-gray-600 dark:text-gray-300 transition-transform duration-200"
                fallbackText={p.name.charAt(0)}
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResponsiveMenu;

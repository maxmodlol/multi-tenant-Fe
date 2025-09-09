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
    <div className="flex flex-col justify-between h-full  p-4 gap-4 ">
      <div className="flex flex-col gap-4">
        {/* Search bar (Mobile only) */}
        {isMobile && (
          <Input
            placeholder="ابحث هنا..."
            icon="search"
            value={query}
            autoFocus
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
          />
        )}

        {/* Navigation links */}
        <nav className="flex flex-col gap-2">
          <a
            href="/"
            onClick={closeMenu}
            className="text-gray-700 hover:text-brand-600 dark:text-gray-200 dark:hover:text-white transition"
          >
            الصفحة الرئيسية
          </a>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Spinner />
            </div>
          ) : error ? (
            <p className="text-red-500 text-sm">حدث خطأ أثناء جلب التصنيفات</p>
          ) : (
            categories?.map((category: Category) => (
              <a
                key={category.id}
                href={`/category/${encodeURIComponent(category.name)}`}
                onClick={closeMenu}
                className="text-gray-700 hover:text-brand-600 dark:text-gray-200 dark:hover:text-white transition"
              >
                {category.name}
              </a>
            ))
          )}
        </nav>

        {/* Dark mode toggle (Mobile only) */}
        {isMobile && (
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-2 mt-4 text-gray-700 dark:text-white"
          >
            الوضع الليلي
            <Moon
              fill={isDark ? "white" : "none"}
              stroke={isDark ? "white" : "currentColor"}
              className="!size-5"
            />
          </button>
        )}
      </div>

      {/* Social Media Icons */}
      <div className="flex justify-center gap-1.5 md:gap-2 pt-4 border-t border-gray-200 dark:border-gray-700 flex-wrap">
        {[
          { name: "Facebook", url: "/icons/facebook.svg", href: "https://www.facebook.com/" },
          { name: "Instagram", url: "/icons/instagram.svg", href: "https://www.instagram.com/" },
          { name: "X", url: "/icons/X.svg", href: "https://x.com/" },
          { name: "WhatsApp", url: "/icons/whatsapp.svg", href: "https://wa.me/" },
          { name: "Telegram", url: "/icons/telegram.svg", href: "https://t.me/" },
        ].map((icon) => (
          <a
            key={icon.name}
            href={icon.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={icon.name}
            className="group relative p-2 md:p-2.5 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-102 hover:shadow-md border border-gray-200 dark:border-gray-600 w-9 h-9 md:w-10 md:h-10 flex items-center justify-center"
          >
            <Image
              src={icon.url}
              alt={icon.name}
              width={16}
              height={16}
              className="object-contain text-gray-600 dark:text-gray-300 transition-transform duration-200 md:w-4 md:h-4"
            />
          </a>
        ))}
      </div>
    </div>
  );
};

export default ResponsiveMenu;

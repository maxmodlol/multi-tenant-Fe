"use client";
import React from "react";
import { Moon, X } from "lucide-react";
import { useCategories } from "@explore/lib/useCategories";
import { Category } from "@explore/types/category";
import { Input } from "@explore/components/ui/input";
import { ResponsiveMenuProps } from "./types";

const ResponsiveMenu: React.FC<ResponsiveMenuProps> = ({
  isDark,
  toggleDarkMode,
  closeMenu,
  isMobile,
}) => {
  const { data: categories, isLoading, error } = useCategories();

  return (
    <div className="flex flex-col justify-between h-full overflow-auto p-4 gap-4">
      <div className="flex flex-col gap-4">
        {/* Search bar (Mobile only) */}
        {isMobile && <Input placeholder="ابحث هنا..." icon="search" />}

        {/* Navigation links */}
        <nav className="flex flex-col gap-2">
          <a
            href="#"
            className="text-gray-700 hover:text-brand-600 dark:text-gray-200 dark:hover:text-white transition"
          >
            الصفحة الرئيسية
          </a>

          {isLoading ? (
            <p className="text-gray-500 text-sm">جاري التحميل...</p>
          ) : error ? (
            <p className="text-red-500 text-sm">حدث خطأ أثناء جلب التصنيفات</p>
          ) : (
            categories?.map((category: Category) => (
              <a
                key={category.id}
                href={`/category/${category.id}`}
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
      <div className="flex justify-center gap-2 pt-0 ">
        {[
          { name: "facebook", url: "/icons/facebook.svg" },
          { name: "messenger", url: "/icons/instagram.svg" },
          { name: "x", url: "/icons/X.svg" },
          { name: "whatsapp", url: "/icons/whatsapp.svg" },
          { name: "telegram", url: "/icons/telegram.svg" },
        ].map((icon) => (
          <a key={icon.name} href="#" aria-label={icon.name}>
            <img src={icon.url} alt={icon.name} className=" hover:opacity-80 transition" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default ResponsiveMenu;

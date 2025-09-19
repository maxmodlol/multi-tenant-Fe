"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import Image from "next/image";
import { getAvatarUrl, handleAvatarError } from "@/src/utils/avatarUtils";
import IconWithFallback from "./IconWithFallback";

const platforms = [
  {
    name: "WhatsApp",
    icon: "/icons/whatsapp.svg",
    color: "hover:bg-green-50 dark:hover:bg-green-900/20",
    getUrl: (url: string) => `https://wa.me/?text=${encodeURIComponent(url)}`,
  },
  {
    name: "Telegram",
    icon: "/icons/telegram.svg",
    color: "hover:bg-blue-50 dark:hover:bg-blue-900/20",
    getUrl: (url: string) => `https://t.me/share/url?url=${encodeURIComponent(url)}`,
  },
  {
    name: "Facebook",
    icon: "/icons/facebook.svg",
    color: "hover:bg-blue-50 dark:hover:bg-blue-900/20",
    getUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: "X",
    icon: "/icons/X.svg",
    color: "hover:bg-gray-50 dark:hover:bg-gray-900/20",
    getUrl: (url: string) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
  },
];

export default function BlogFooterMeta({
  url,
  author,
  createdAt,
}: {
  url: string;
  author?: { id: string; name: string; bio?: string | null; avatarUrl?: string | null } | null;
  createdAt: Date | string;
}) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 1) detect mount so SSR vs client match
  useEffect(() => {
    setMounted(true);
  }, []);

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("تم نسخ الرابط!");
  };

  useEffect(() => {
    if (copied) {
      const t = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(t);
    }
  }, [copied]);

  return (
    <div
      className="border-t border-gray-200 dark:border-gray-700 py-8 px-4 md:px-6 lg:px-8 bg-white dark:bg-gray-900"
      aria-label="معلومات عن المؤلف ومشاركة المقال"
    >
      {/* Main Content - Clean Horizontal Layout */}
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Author Section - Vertical on mobile, Horizontal on desktop */}
        <div className="flex flex-col lg:flex-row items-center gap-4 order-1 lg:order-1">
          {/* Avatar - Clean circular design */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 shadow-lg ring-2 ring-gray-200 dark:ring-gray-700">
              <Image
                src={getAvatarUrl(author?.avatarUrl)}
                alt={author?.name ? `صورة ${author.name}` : "مؤلف مجهول"}
                width={80}
                height={80}
                className="object-cover w-full h-full"
                onError={handleAvatarError}
              />
            </div>
          </div>

          {/* Author Info - Centered on mobile, Right-aligned on desktop */}
          <div className="text-center lg:text-right">
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {author?.name || "مؤلف مجهول"}
            </h3>
            {author?.bio && (
              <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-md">
                {author.bio}
              </p>
            )}
          </div>
        </div>

        {/* Share Section - Below on mobile, Left side on desktop */}
        <div className="flex items-center gap-3 order-2 lg:order-2">
          {/* Social Media Icons */}
          <div className="flex items-center gap-2">
            {mounted &&
              platforms.map((p) => (
                <a
                  key={p.name}
                  href={p.getUrl(url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`مشاركة عبر ${p.name}`}
                  className={`group relative bg-gray-50 dark:bg-gray-800 ${p.color} p-3 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg border border-gray-200 dark:border-gray-700 w-12 h-12 flex items-center justify-center flex-shrink-0`}
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

          {/* Copy Link Button */}
          <button
            onClick={copyLink}
            aria-label="نسخ رابط المقال"
            className={`group flex items-center gap-2 bg-gray-50 dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:scale-105 transition-all duration-200 hover:shadow-lg border border-gray-200 dark:border-gray-700 flex-shrink-0 ${copied ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" : ""}`}
          >
            <IconWithFallback
              src="/icons/copy.svg"
              alt=""
              width={18}
              height={18}
              className="object-contain text-gray-600 dark:text-gray-300 transition-transform duration-200"
              fallbackText="📋"
            />
            <span className="transition-transform duration-200">
              {copied ? "تم النسخ!" : "نسخ الرابط"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

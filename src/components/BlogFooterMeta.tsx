"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import Image from "next/image";
import { getAvatarUrl, handleAvatarError } from "@/src/utils/avatarUtils";

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
      className="border-t border-gray-200 dark:border-gray-700 py-6 lg:bg-gradient-to-br lg:from-gray-50 lg:to-gray-100 dark:lg:from-gray-800 lg:to-gray-900 lg:rounded-2xl lg:p-4 md:lg:p-6 lg:border lg:border-gray-200 dark:lg:border-gray-700 lg:border-r-0 lg:shadow-sm lg:border-t-0 lg:py-0 relative lg:pr-0"
      aria-label="معلومات عن المؤلف ومشاركة المقال"
    >
      {/* Main Content - Horizontal Layout */}
      <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-6 lg:gap-6">
        {/* Author Section - Centered on Mobile, Right on Desktop */}
        <div className="flex flex-col lg:flex-row items-center lg:items-center gap-4 lg:gap-3 order-1 lg:order-1 w-full lg:w-auto">
          {/* Avatar */}
          <div className="w-16 h-16 lg:w-16 lg:h-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0 shadow-sm lg:absolute lg:-right-2 lg:top-1/2 lg:-translate-y-1/2">
            <Image
              src={getAvatarUrl(author?.avatarUrl)}
              alt={author?.name ? `صورة ${author.name}` : "مؤلف مجهول"}
              width={64}
              height={64}
              className="object-cover w-full h-full"
              onError={handleAvatarError}
            />
          </div>
          <div className="text-center lg:text-right flex-1 min-w-0 lg:pr-20">
            <h3 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1 line-clamp-1">
              {author?.name || "مؤلف مجهول"}
            </h3>
            {author?.bio && (
              <p className="text-sm lg:text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">
                {author.bio}
              </p>
            )}
          </div>
        </div>

        {/* Share Section - Below Author on Mobile, Left on Desktop */}
        <div className="flex flex-col gap-2 lg:gap-3 order-2 lg:order-2 w-full lg:w-auto">
          <div className="flex items-center gap-3 lg:gap-2 justify-center lg:justify-start">
            {/* Social Media Icons */}
            {mounted &&
              platforms.map((p) => (
                <a
                  key={p.name}
                  href={p.getUrl(url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`مشاركة عبر ${p.name}`}
                  className={`group relative bg-white dark:bg-gray-800 ${p.color} p-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-md border border-gray-200 dark:border-gray-700 w-9 h-9 lg:w-10 lg:h-10 flex items-center justify-center flex-shrink-0`}
                >
                  <Image
                    src={p.icon}
                    alt={p.name}
                    width={18}
                    height={18}
                    className="object-contain text-gray-600 dark:text-gray-300 transition-transform duration-200"
                  />
                </a>
              ))}

            {/* Copy Link Button */}
            <button
              onClick={copyLink}
              aria-label="نسخ رابط المقال"
              className={`group flex items-center gap-1.5 lg:gap-2 bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20 px-2.5 lg:px-3 py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 hover:scale-105 transition-all duration-200 hover:shadow-md border border-gray-200 dark:border-gray-700 flex-shrink-0 ${copied ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" : ""}`}
            >
              <Image
                src="/icons/copy.svg"
                alt=""
                width={16}
                height={16}
                aria-hidden="true"
                className="object-contain text-gray-600 dark:text-gray-300 transition-transform duration-200"
              />
              <span className="transition-transform duration-200">
                {copied ? "تم النسخ!" : "نسخ الرابط"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

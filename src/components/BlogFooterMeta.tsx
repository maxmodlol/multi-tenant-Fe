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
    name: "Instagram",
    icon: "/icons/instagram.svg",
    color: "hover:bg-pink-50 dark:hover:bg-pink-900/20",
    getUrl: () => "https://www.instagram.com/",
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
      className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 mt-8 mb-4"
      aria-label="معلومات عن المؤلف ومشاركة المقال"
    >
      {/* Author Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
          <Image
            src={getAvatarUrl(author?.avatarUrl)}
            alt={author?.name ? `صورة ${author.name}` : "مؤلف مجهول"}
            width={80}
            height={80}
            className="object-cover w-full h-full"
            onError={handleAvatarError}
          />
        </div>
        <div className="flex-1 text-right">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
            {author?.name || "مؤلف مجهول"}
          </h3>
          {author?.bio && (
            <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
              {author.bio}
            </p>
          )}
        </div>
      </div>

      {/* Share Section */}
      <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 text-right">
          مشاركة المقال
        </h4>
        <div className="flex flex-nowrap gap-1.5 md:gap-2 items-center justify-end">
          {/* only render dynamic hrefs after mount */}
          {mounted &&
            platforms.map((p) => (
              <a
                key={p.name}
                href={p.getUrl(url)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`مشاركة عبر ${p.name}`}
                className={`group relative bg-white dark:bg-gray-800 ${p.color} p-2.5 md:p-3 rounded-lg transition-all duration-200 hover:scale-102 hover:shadow-md border border-gray-200 dark:border-gray-700 w-10 h-10 md:w-11 md:h-11 flex items-center justify-center flex-shrink-0`}
              >
                <Image
                  src={p.icon}
                  alt={p.name}
                  width={18}
                  height={18}
                  className="object-contain text-gray-600 dark:text-gray-300 transition-transform duration-200 md:w-5 md:h-5"
                />
              </a>
            ))}

          <button
            onClick={copyLink}
            aria-label="نسخ رابط المقال"
            className={`group flex items-center gap-1.5 md:gap-2 bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20 px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 hover:scale-102 transition-all duration-200 hover:shadow-md border border-gray-200 dark:border-gray-700 flex-shrink-0 ${copied ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" : ""}`}
          >
            <span className="transition-transform duration-200">
              {copied ? "تم النسخ!" : "نسخ الرابط"}
            </span>
            <Image
              src="/icons/copy.svg"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
              className="object-contain text-gray-600 dark:text-gray-300 transition-transform duration-200 md:w-4 md:h-4"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

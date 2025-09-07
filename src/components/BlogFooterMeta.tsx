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
    getUrl: (url: string) => `https://wa.me/?text=${encodeURIComponent(url)}`,
  },
  {
    name: "Telegram",
    icon: "/icons/telegram.svg",
    getUrl: (url: string) => `https://t.me/share/url?url=${encodeURIComponent(url)}`,
  },
  {
    name: "Instagram",
    icon: "/icons/instagram.svg",
    getUrl: () => "https://www.instagram.com/",
  },
  {
    name: "Facebook",
    icon: "/icons/facebook.svg",
    getUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: "X",
    icon: "/icons/X.svg",
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
      className="flex flex-col md:flex-row justify-between items-center gap-4 py-4 md:py-8"
      aria-label="معلومات عن المؤلف ومشاركة المقال"
    >
      {/* Author Info */}
      <div className="flex items-center gap-3 text-right w-full md:w-auto">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 md:block">
          <Image
            src={getAvatarUrl(author?.avatarUrl)}
            alt={author?.name ? `صورة ${author.name}` : "مؤلف مجهول"}
            width={48}
            height={48}
            className="object-cover"
            onError={handleAvatarError}
          />
        </div>
        <div className="">
          <p className="font-semibold text-gray-800 dark:text-gray-300">
            {author?.name || "مؤلف مجهول"}
          </p>
          {author?.bio && (
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{author.bio}</p>
          )}
        </div>
      </div>

      {/* Share + Copy */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* only render dynamic hrefs after mount */}
        {mounted &&
          platforms.map((p) => (
            <a
              key={p.name}
              href={p.getUrl(url)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`مشاركة عبر ${p.name}`}
              className="group relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/20 dark:hover:to-blue-800/20 p-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <Image
                src={p.icon}
                alt={p.name}
                width={24}
                height={24}
                className="object-contain dark:invert group-hover:scale-110 transition-transform duration-300"
              />
              {/* Tooltip */}
              <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                {p.name}
              </span>
            </a>
          ))}

        <button
          onClick={copyLink}
          aria-label="نسخ رابط المقال"
          className="group flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 hover:from-green-100 hover:to-green-200 dark:hover:from-green-900/20 dark:hover:to-green-800/20 px-4 py-3 rounded-xl text-sm font-medium text-gray-800 dark:text-gray-300 hover:scale-105 transition-all duration-300 hover:shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <span className="group-hover:scale-110 transition-transform duration-300">
            نسخ الرابط
          </span>
          <Image
            src="/icons/copy.svg"
            alt=""
            width={16}
            height={16}
            aria-hidden="true"
            className="object-contain dark:invert group-hover:scale-110 transition-transform duration-300"
          />
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import Image from "next/image";

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
  author?: { id: string; name: string } | null;
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
      <div className="flex items-center gap-3 text-right">
        <div className="w-12 h-12 hidden md:block rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800">
          <Image
            src="/icons/author-avatar.png"
            alt={author?.name ? `صورة ${author.name}` : "مؤلف مجهول"}
            width={48}
            height={48}
            className="object-cover"
          />
        </div>
        <div className="hidden md:block">
          <p className="font-semibold text-gray-800 dark:text-gray-500">
            {author?.name || "مؤلف مجهول"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <time dateTime={new Date(createdAt).toISOString()}>
              {format(new Date(createdAt), "dd MMM yyyy")}
            </time>
          </p>
        </div>
      </div>

      {/* Share + Copy */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* only render dynamic hrefs after mount */}
        {mounted &&
          platforms.map((p) => (
            <a
              key={p.name}
              href={p.getUrl(url)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`مشاركة عبر ${p.name}`}
              className="bg-gray-100 dark:bg-gray-900 hover:opacity-80 p-1 rounded-lg transition"
            >
              <Image
                src={p.icon}
                alt={p.name}
                width={32}
                height={32}
                className="object-contain dark:invert"
              />
            </a>
          ))}

        <button
          onClick={copyLink}
          aria-label="نسخ رابط المقال"
          className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 px-4 py-2 rounded-lg text-sm font-medium text-gray-800 dark:text-gray-500 hover:opacity-80 transition"
        >
          نسخ الرابط
          <Image
            src="/icons/copy.svg"
            alt=""
            width={16}
            height={16}
            aria-hidden="true"
            className="object-contain dark:invert"
          />
        </button>
      </div>
    </div>
  );
}

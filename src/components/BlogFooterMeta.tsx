"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

const platforms = [
  {
    name: "whatsapp",
    icon: "/icons/whatsapp.svg",
    getUrl: (url: string) => `https://wa.me/?text=${url}`,
  },
  {
    name: "telegram",
    icon: "/icons/telegram.svg",
    getUrl: (url: string) => `https://t.me/share/url?url=${url}`,
  },
  {
    name: "instagram",
    icon: "/icons/instagram.svg",
    getUrl: () => "https://www.instagram.com/",
  },
  {
    name: "facebook",
    icon: "/icons/facebook.svg",
    getUrl: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${url}`,
  },
  {
    name: "x",
    icon: "/icons/X.svg",
    getUrl: (url: string) => `https://twitter.com/intent/tweet?url=${url}`,
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

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("تم نسخ الرابط!");
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4  py-4 md:py-8 ">
      {/* Right: Author */}
      <div className="flex items-center gap-3 text-right">
        <div className="w-12 h-12 hidden md:block rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800">
          {/* You can make this dynamic if you have avatar URLs later */}
          <img src="/icons/author-avatar.png" alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <div className="hidden md:block">
          <p className="font-semibold text-gray-800 dark:text-gray-500">
            {author?.name || "مؤلف مجهول"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {format(new Date(createdAt), "dd MMM yyyy")}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        {platforms.map((platform) => (
          <a
            key={platform.name}
            href={platform.getUrl(url)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={platform.name}
            className="bg-gray-100 dark:bg-gray-900 hover:opacity-80 p-1 rounded-lg transition"
          >
            <img
              src={platform.icon}
              alt={platform.name}
              className="!w-8 !h-8 object-contain dark:invert"
            />
          </a>
        ))}

        <button
          onClick={copyLink}
          className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 px-4 py-2 rounded-lg text-sm font-medium text-gray-800 dark:text-gray-500 hover:opacity-80 transition"
        >
          نسخ الرابط
          <img
            src="/icons/copy.svg"
            alt="Copy Icon"
            className="w-4 h-4 object-contain dark:invert"
          />
        </button>
      </div>
    </div>
  );
}

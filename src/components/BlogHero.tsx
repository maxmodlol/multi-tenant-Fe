"use client";

import { Blog } from "@explore/types/blogs";

// Declare adsbygoogle for TypeScript
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}
import Image from "next/image";
import clsx from "clsx";
import { formatDate, getTagColorClass } from "@explore/lib/utils";
import { getAvatarUrl, handleAvatarError } from "@/src/utils/avatarUtils";

/**
 * Renders the hero section of a blog, plus optional ads:
 * - ABOVE_TAGS ads (above the tags)
 * - UNDER_DATE ads (right under the date line)
 */
export default function BlogHero({
  blog,
  aboveTagsAds = [],
  underDateAds = [],
}: {
  blog: Blog;
  aboveTagsAds?: string[];
  underDateAds?: string[];
}) {
  // Debug logging
  console.log("BlogHero Debug:", {
    aboveTagsAds,
    underDateAds,
    aboveTagsAdsLength: aboveTagsAds.length,
    underDateAdsLength: underDateAds.length,
  });
  return (
    <div className="bg-white dark:bg-black text-center pt-8 pb-4 md:pb-8 px-4 md:px-8">
      {/* ─── ABOVE_TAGS ADS ─── */}
      {aboveTagsAds.map((snippet, i) => (
        <div
          key={`above-${i}`}
          className="my-3 w-full flex justify-center"
          style={{ minWidth: "300px", minHeight: "100px" }}
          dangerouslySetInnerHTML={{ __html: snippet }}
        />
      ))}

      {/* Tags */}
      <div className="flex flex-wrap justify-center gap-2 mb-3">
        {(blog.tags ?? []).map((tag, idx) => (
          <span
            key={idx}
            className={clsx("px-3 py-1 text-sm font-medium rounded-full", getTagColorClass(idx))}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h1 className="text-[2rem] md:text-[3.5rem] font-extrabold mt-1 mb-2 md:mb-8 leading-tight break-words text-center px-2">
        {blog.title}
      </h1>

      {/* Description */}
      {blog.description && (
        <p className="text-gray-500 dark:text-gray-400 text-base text-[1.1rem] md:text-[1.4rem] mt-0 mb-3 md:mb-6 line-clamp-4 md:line-clamp-3 max-w-xs sm:max-w-md md:max-w-4xl mx-auto px-3 sm:px-4 leading-snug md:leading-relaxed break-words text-center">
          {blog.description}
        </p>
      )}

      {/* Date in grey */}
      <p className="text-sm text-gray-400 mb-2">
        <time dateTime={new Date(blog.createdAt).toISOString()}>{formatDate(blog.createdAt)}</time>
      </p>

      {/* ─── UNDER_DATE ADS ─── */}
      {underDateAds.map((snippet, i) => (
        <div
          key={`under-${i}`}
          className="my-3 w-full flex justify-center"
          style={{ minWidth: "300px", minHeight: "100px" }}
          dangerouslySetInnerHTML={{ __html: snippet }}
        />
      ))}

      {/* Cover Image */}
      {blog.coverPhoto && (
        <div className="mt-2 md:mt-4 max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
          <div className="relative aspect-[3/2] w-full">
            <Image
              src={blog.coverPhoto}
              alt={`غلاف: ${blog.title}`}
              width={1200}
              height={600}
              className="object-cover w-full h-full"
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
}

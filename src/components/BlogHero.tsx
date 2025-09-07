"use client";

import { Blog } from "@explore/types/blogs";
import Image from "next/image";
import clsx from "clsx";
import { formatDate, getTagColorClass } from "@explore/lib/utils";
import { getAvatarUrl, handleAvatarError } from "@/src/utils/avatarUtils";

/**
 * Renders the hero section of a blog, plus optional ads:
 * - ABOVE_TAGS ads (just below tags and before title)
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
  return (
    <div className="bg-white dark:bg-black text-center pt-10 pb-2 md:pb-16 px-4 md:px-8">
      {/* Tags */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {(blog.tags ?? []).map((tag, idx) => (
          <span
            key={idx}
            className={clsx("px-3 py-1 text-sm font-medium rounded-full", getTagColorClass(idx))}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* ─── ABOVE_TAGS ADS ─── */}
      {aboveTagsAds.map((snippet, i) => (
        <div
          key={`above-${i}`}
          className="my-4 w-full flex justify-center"
          dangerouslySetInnerHTML={{ __html: snippet }}
        />
      ))}

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold mb-3">{blog.title}</h1>

      {/* Description */}
      {blog.description && (
        <p className="text-gray-500 dark:text-gray-400 text-lg mb-2 line-clamp-3 md:line-clamp-none max-w-4xl mx-auto px-4">
          {blog.description}
        </p>
      )}

      {/* Author - Desktop: Simple name only */}
      <div className="hidden md:block mb-2">
        <div className="text-base font-semibold text-gray-700 dark:text-gray-300">
          {blog.author?.name ?? "كاتب"}
        </div>
      </div>

      {/* Author + Bio - Mobile: Full card design */}
      <div className="md:hidden mb-4 w-full px-4">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mx-auto max-w-sm">
          <div className="flex items-center gap-3">
            <Image
              src={getAvatarUrl((blog as any).author?.avatarUrl)}
              alt={blog.author?.name || ""}
              width={40}
              height={40}
              className="rounded-full object-cover flex-shrink-0"
              onError={handleAvatarError}
            />
            <div className="text-left min-w-0 flex-1">
              <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {blog.author?.name ?? "كاتب"}
              </div>
              {(blog as any).author?.bio && (
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                  {(blog as any).author.bio}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Date in grey */}
      <p className="text-xs text-gray-400">
        <time dateTime={new Date(blog.createdAt).toISOString()}>{formatDate(blog.createdAt)}</time>
      </p>

      {/* ─── UNDER_DATE ADS ─── */}
      {underDateAds.map((snippet, i) => (
        <div
          key={`under-${i}`}
          className="my-4 w-full flex justify-center"
          dangerouslySetInnerHTML={{ __html: snippet }}
        />
      ))}

      {/* Cover Image */}
      {blog.coverPhoto && (
        <div className="mt-4 md:mt-6 max-w-6xl mx-auto rounded-xl overflow-hidden">
          <div className="relative aspect-[3/2] w-full">
            <Image
              src={blog.coverPhoto}
              alt={`غلاف: ${blog.title}`}
              width={1200}
              height={600}
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
}

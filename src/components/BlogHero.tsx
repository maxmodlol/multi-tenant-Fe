"use client";

import { Blog } from "@explore/types/blogs";
import Image from "next/image";
import clsx from "clsx";
import { formatDate, getTagColorClass } from "@explore/lib/utils";

export default function BlogHero({ blog }: { blog: Blog }) {
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

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold mb-2">{blog.title}</h1>

      {/* Description */}
      {blog.description && (
        <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">{blog.description}</p>
      )}

      {/* Date + Author */}
      <p className="text-sm text-brand-600 font-medium dark:text-gray-400">
        نشر بتاريخ {formatDate(blog.createdAt)}
      </p>

      {/* Image */}
      {blog.coverPhoto && (
        <div className="mt-6 max-w-6xl mx-auto rounded-xl overflow-hidden">
          <div className="relative aspect-[3/2] w-full">
            <Image src={blog.coverPhoto} alt={blog.title} fill className="object-cover" priority />
          </div>
        </div>
      )}
    </div>
  );
}

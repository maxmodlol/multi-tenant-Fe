// components/BlogCard.tsx
import { formatDate, getTagColorClass } from "@explore/lib/utils";
import { Blog, BlogCardData } from "@explore/types/blogs";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

type BlogCardProps = {
  blog: BlogCardData;
  type: "slider" | "grid" | "related";
};

export default function BlogCard({ blog, type }: BlogCardProps) {
  // Normalize href so local dev keeps the port and SSR stays internal.
  const resolveHref = (): string => {
    // default internal route
    const internal = `/blogs/${blog.id}`;
    // If backend supplied tenant, and current host is a subdomain-aware dev env, prefer internal link
    if (blog.tenant) return internal;
    if (!blog.url) return internal;
    try {
      if (typeof window === "undefined") return internal;
      // In local development, always use internal to preserve the dev port and avoid subdomain issues
      const host = window.location.hostname;
      if (host === "localhost" || host === "127.0.0.1" || host.endsWith(".localhost")) {
        return internal;
      }
      const u = new URL(blog.url, window.location.origin);
      const sameHostname = u.hostname === window.location.hostname;
      if (sameHostname) {
        // If port differs or missing, use internal relative path to keep current port
        if (u.port !== window.location.port) return internal;
        // Same host: prefer relative path
        return `${u.pathname}${u.search}${u.hash}` || internal;
      }
      // Different hostname → allow external link
      return blog.url;
    } catch {
      return internal;
    }
  };

  // ─── Slider variant ───────────────────────────────────────────────────────
  if (type === "slider") {
    return (
      <div className="relative w-full h-full min-h-[560px] rounded-3xl overflow-hidden">
        <Link href={resolveHref()}>
          <Image
            src={blog.coverPhoto ?? "/placeholder-image.jpg"}
            alt={blog.title}
            fill
            sizes="100vw"
            priority
            className="object-cover object-center"
          />
          {/* Solid black box behind text (no blur, no gradient) */}
          <div className="absolute inset-x-0 bottom-0 z-20">
            <div className="w-full rounded-b-2xl bg-alphaBlack-90 dark:bg-alphaWhite-90 px-4 sm:px-6 md:px-10 py-4 sm:py-6 md:py-10 min-h-[150px] sm:min-h-[180px] md:min-h-[160px]">
              <h2 className="text-right text-2xl sm:text-3xl md:text-5xl font-extrabold leading-tight md:leading-[1.15] line-clamp-1 md:line-clamp-2 break-words text-text-white">
                {blog.title}
              </h2>
              <p className="mt-2 sm:mt-3 text-right text-xs sm:text-sm md:text-base leading-6 md:leading-7 text-text-white line-clamp-1 md:line-clamp-2 break-words">
                {blog.description || ""}
              </p>
              <div className="mt-2 sm:mt-3 w-full flex flex-wrap gap-1 sm:gap-2 justify-end rtl:justify-start">
                {(blog.tags ?? []).slice(0, 3).map((tag, idx) => (
                  <span
                    key={tag}
                    className={clsx(
                      "px-2 sm:px-3 py-0.5 text-[10px] sm:text-xs font-medium rounded-full",
                      getTagColorClass(idx),
                    )}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  const isRelated = type === "related";
  return (
    <Link
      href={resolveHref()}
      className={clsx(
        "group perspective-1000 flex h-full flex-col",
        !isRelated && "min-h-[320px] md:min-h-[360px]",
      )}
    >
      {/* image + border */}
      <div
        className={clsx(
          "relative w-full h-44 sm:h-52 md:h-56 rounded-t-lg overflow-hidden",
          "border border-gray-200 dark:border-gray-700",
          "transition-transform duration-300 ease-out",
          "group-hover:scale-[1.02] group-hover:-translate-y-1 shadow-sm group-hover:shadow-lg",
          "shadow-sm group-hover:shadow-lg",
        )}
      >
        <Image
          src={blog.coverPhoto ?? "/placeholder-image.jpg"}
          alt={blog.title}
          fill
          className={clsx(
            "object-cover w-full h-full",
            "transition-transform duration-500 ease-out",
            "group-hover:scale-105",
          )}
        />
      </div>

      {/* content + border on three sides */}
      <div
        className={clsx(
          "p-4 bg-white dark:bg-gray-900 rounded-b-2xl",
          "border border-t-0 border-gray-200 dark:border-gray-800",
          "flex flex-1 flex-col",
        )}
      >
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 line-clamp-2">
            {blog.title}
          </h3>

          {!isRelated && blog.description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {blog.description}
            </p>
          )}
        </div>

        <div className="mt-auto">
          <div className="mt-3 flex items-center justify-between text-xs text-gray-600 dark:text-gray-500">
            <span>{formatDate(blog.createdAt)}</span>
            <span className="font-medium">{blog.author?.name}</span>
          </div>

          {!isRelated && (
            <div className="mt-2 flex flex-wrap gap-2">
              {(blog.tags ?? []).slice(0, 3).map((tag, idx) => (
                <span
                  key={tag}
                  className={clsx(
                    "px-2 py-0.5 text-xs font-medium rounded-full",
                    getTagColorClass(idx).replace("bg-", "bg-opacity-20 bg-"),
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

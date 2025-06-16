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
  // ─── Slider variant ───────────────────────────────────────────────────────
  if (type === "slider") {
    return (
      <div className="relative w-full h-[500px] rounded-3xl overflow-hidden">
        <Image
          src={blog.coverPhoto ?? "/placeholder-image.jpg"}
          alt={blog.title}
          width={1200}
          height={500}
          priority
          className="object-cover object-center w-full h-full"
        />

        <div className="absolute bottom-10 left-6 right-6 text-text-white z-10 space-y-3 rtl:text-right text-left custom-1">
          <h2 className="text-2xl font-bold drop-shadow">{blog.title}</h2>
          <p className="text-base text-gray-500  drop-shadow">
            {blog.description
              ? blog.description
              : " كيف يمكنك إنشاء عروض تقديمية مثيرة تدهش زملاءك وتبهر مديرك"}
          </p>
          <div className="flex gap-2 flex-wrap">
            {(blog.tags ?? []).slice(0, 3).map((tag, idx) => (
              <span
                key={tag}
                className={clsx(
                  "px-3 py-1 text-xs font-medium rounded-full",
                  getTagColorClass(idx),
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const isRelated = type === "related";
  return (
    <Link href={blog.url ?? `/blogs/${blog.id}`} className="group block perspective-1000">
      {/* image + border */}
      <div
        className={clsx(
          "relative w-full h-56 rounded-t-lg overflow-hidden",
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
        )}
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 line-clamp-2">
          {blog.title}
        </h3>

        {!isRelated && blog.description && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {blog.description}
          </p>
        )}

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
                  // tag background with subtle opacity
                  getTagColorClass(idx).replace("bg-", "bg-opacity-20 bg-"),
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

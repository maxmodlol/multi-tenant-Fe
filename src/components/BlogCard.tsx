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
  if (type === "slider") {
    return (
      <div className="relative w-full h-[500px]">
        <Image
          src={blog.coverPhoto ?? ""}
          alt={blog.title}
          fill
          className="object-cover object-center"
        />
        <div
          className="absolute bottom-0 inset-x-0 h-[180px]"
          style={{
            background: "linear-gradient(180deg, rgba(0,0,0,0) -125.57%, #000 100%)",
          }}
        />
        <div className="absolute bottom-10 left-6 right-6 text-text-white z-10 space-y-3 rtl:text-right text-left">
          <h2 className="text-2xl font-bold drop-shadow">{blog.title}</h2>
          <p className="text-base text-gray-500  drop-shadow">
            كيف يمكنك إنشاء عروض تقديمية مثيرة تدهش زملاءك وتبهر مديرك؟
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

  // Grid or Wide type
  const cardType = type === "related";
  return (
    <Link
      href={blog.url ?? `/blogs/${blog.id}`} // ✅ If blog.url exists, use it. Else fallback to manual route.
      className={clsx(
        "rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-800 group transition hover:shadow-lg",
        "flex flex-col",
      )}
    >
      <div className={clsx("relative", "h-[220px]")}>
        <Image
          src={blog.coverPhoto ?? "/placeholder-image.jpg"}
          alt={blog.title}
          fill
          className="object-cover"
        />

        {/* Top left open icon on hover */}
      </div>

      <div className={clsx("p-4 flex flex-col justify-between bg-white ")}>
        <div>
          <span className="text-sm text-muted-foreground text-brand-800 font-medium  dark:text-gray-300 ">
            {formatDate(blog.createdAt)} • {blog.author?.name}
          </span>

          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 dark:text-text-white line-clamp-2">
              {blog.title}
            </h3>
            <Image
              src="/icons/arrow-open.svg"
              alt="Open Icon"
              width={20}
              height={20}
              className="text-gray-400 group-hover:opacity-80 transition dark:invert"
            />
          </div>
          {cardType ? (
            ""
          ) : (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              كيف يمكنك إنشاء عروض تقديمية مثيرة تدهش زملاءك وتبهر مديرك؟
            </p>
          )}
        </div>
        {cardType ? (
          ""
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
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
        )}
      </div>
    </Link>
  );
}

"use client";

import { Blog } from "@explore/types/blogs";
import BlogCard from "./BlogCard";
import { useRelatedBlogs } from "@/src/hooks/public/useRelatedBlogs";

export default function RelatedBlogs({ currentBlog }: { currentBlog: Blog }) {
  const { data: related = [] } = useRelatedBlogs(currentBlog.id);
  const sameCategory = related.filter((b) =>
    b.categories?.some((c) => currentBlog.categories?.some((cc) => cc.id === c.id)),
  );

  // Keep only the first 4 if even, otherwise 2
  const adjusted =
    sameCategory.length === 0
      ? []
      : sameCategory.length % 2 === 0
        ? sameCategory.slice(0, 4)
        : sameCategory.slice(0, 2);

  if (!adjusted.length) return null;

  return (
    <section
      aria-labelledby="related-blogs-heading"
      className="max-w-6xl mx-auto px-4 py-10 border-t border-gray-300 dark:border-gray-800"
    >
      <h2 id="related-blogs-heading" className="text-2xl font-bold mb-4">
        مقالات ذات صلة
      </h2>
      <p className="text-sm text-gray-500 mt-1 mb-6 line-clamp-2">
        أحدث أخبار الصناعة والمقابلات والتقنيات والموارد.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        {adjusted.map((blog) => (
          <BlogCard key={blog.id} blog={blog} type="related" />
        ))}
      </div>
    </section>
  );
}

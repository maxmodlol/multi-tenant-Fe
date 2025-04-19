"use client";
import { Blog } from "@explore/types/blogs";
import BlogCard from "./BlogCard";
import { useRelatedBlogs } from "@explore/lib/useRelatedBlogs";

export default function RelatedBlogs({ currentBlog }: { currentBlog: Blog }) {
  const { data: related = [] } = useRelatedBlogs(currentBlog.id);

  // Keep only the first 4 if even, or drop 1 if odd (to make it even)
  const adjusted = related.length % 2 === 0 ? related.slice(0, 4) : related.slice(0, 2);

  if (!adjusted.length) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 border-t border-gray-300 dark:border-gray-800">
      <h2 className="text-2xl font-bold mb-4">مقالات ذات صلة</h2>
      <p className="text-sm text-gray-500 mt-1 mb-6 line-clamp-2">
        أحدث أخبار الصناعة والمقابلات والتقنيات والموارد.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        {adjusted.map((blog) => (
          <BlogCard key={blog.id} blog={blog} type="related" />
        ))}
      </div>
    </div>
  );
}

// app/search/page.tsx
"use client"; // ✅ add this at the top

import { useSearchBlogs } from "@explore/lib/useSearchBlogs";
import BlogCard from "@explore/components/BlogCard";
import { useSearchParams } from "next/navigation";

export default function SearchPage() {
  const params = useSearchParams();
  const query = params.get("q") || "";

  const { data: results = [], isLoading } = useSearchBlogs();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">نتائج البحث عن "{query}"</h1>

      {isLoading ? (
        <p>جاري البحث...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {results.map((blog) => (
            <BlogCard
              key={blog.blogId}
              blog={{
                id: blog.blogId,
                title: blog.title,
                coverPhoto: blog.coverPhoto ? blog.coverPhoto : "hero-image.jpeg",
                createdAt: blog.createdAt,
                author: blog.author ?? { name: "غير معروف", id: "" },
                tags: blog.tags ?? [],
                url: blog.url, // ✅ Pass the resolved URL
              }}
              type="grid"
            />
          ))}
        </div>
      )}
    </div>
  );
}

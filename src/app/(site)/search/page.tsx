// src/app/search/page.tsx
import type { Metadata } from "next";
import { blogService } from "@explore/services/blogService";
import BlogCard from "@explore/components/BlogCard";

interface Props {
  searchParams: { q?: string };
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const q = searchParams.q?.trim() || "";
  const title = q ? `نتائج البحث عن "${q}" – مدونة الموقع` : "بحث – مدونة الموقع";
  const description = q ? `عرض نتائج البحث عن "${q}" في مدونتنا.` : "ابحث في مقالاتنا ودروسنا.";
  return {
    title,
    description,
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const q = (searchParams.q ?? "").trim();
  // if q is short, show nothing
  if (q.length < 2) {
    return (
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">ابحث في المدونة</h1>
        <p className="text-gray-600">الرجاء إدخال كلمتين على الأقل للبحث.</p>
      </main>
    );
  }

  // 1) fetch server-side
  const results = await blogService.searchBlogs(q);

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">نتائج البحث عن «{q}»</h1>
      {results.length === 0 ? (
        <p className="text-gray-600">لم نعثر على شيئٍ يطابق بحثك.</p>
      ) : (
        <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {results.map((r) => (
            <li key={r.blogId}>
              <BlogCard
                blog={{
                  id: r.blogId,
                  title: r.title,
                  coverPhoto: r.coverPhoto || "/placeholder-image.jpg",
                  createdAt: r.createdAt,
                  author: r.author ?? { id: "", name: "غير معروف" },
                  tags: r.tags ?? [],
                  url: r.url,
                }}
                type="grid"
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

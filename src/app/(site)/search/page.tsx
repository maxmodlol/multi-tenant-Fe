// src/app/search/page.tsx
import type { Metadata } from "next";
import { blogService } from "@explore/services/blogService";
import BlogCard from "@explore/components/BlogCard";
import { SearchTopAd, SearchBottomAd } from "@/src/components/TenantAdInjector";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const q = searchParams.q?.trim() || "";
  const title = q ? `نتائج البحث عن "${q}" – مدونة الموقع` : "بحث – مدونة الموقع";
  const description = q ? `عرض نتائج البحث عن "${q}" في مدونتنا.` : "ابحث في مقالاتنا ودروسنا.";
  return {
    title,
    description,
  };
}

export default async function SearchPage(props: Props) {
  const searchParams = await props.searchParams;
  const q = (searchParams.q ?? "").trim();
  // if q is short, show nothing
  if (q.length < 2) {
    return (
      <main className="max-w-screen-xl mx-auto px-4 md:px-14 py-10">
        <h1 className="text-2xl font-bold mb-4">ابحث في المدونة</h1>
        <p className="text-gray-600">الرجاء إدخال كلمتين على الأقل للبحث.</p>
      </main>
    );
  }

  // 1) fetch server-side
  const results = await blogService.searchBlogs(q);

  return (
    <main className="max-w-screen-xl mx-auto px-4 md:px-14 py-10">
      {/* Search Top Ad */}
      <SearchTopAd />

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
                  // Pass through url + tenant; BlogCard will resolve to correct domain/subdomain and keep local port during dev
                  url: r.url,
                  tenant: r.tenant,
                }}
                type="grid"
              />
            </li>
          ))}
        </ul>
      )}

      {/* Search Bottom Ad */}
      <div className="mt-8">
        <SearchBottomAd />
      </div>
    </main>
  );
}

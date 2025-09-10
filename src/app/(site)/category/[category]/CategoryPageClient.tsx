"use client";

import { useEffect, useState } from "react";
import { blogService } from "@explore/services/blogService";
import { fetchCategories } from "@explore/services/categoryService";
import BlogsList from "@explore/components/BlogList";
import { CategoryTopAd, CategoryBottomAd } from "@/src/components/TenantAdInjector";
import { Blog, Category } from "@explore/types";

interface CategoryPageClientProps {
  categoryName: string;
}

export default function CategoryPageClient({ categoryName }: CategoryPageClientProps) {
  const [blogsData, setBlogsData] = useState<{
    blogs: Blog[];
    totalPages: number;
    totalBlogs: number;
  } | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("CategoryPageClient - Fetching data for category:", categoryName);

        const [blogsResponse, categoriesResponse] = await Promise.all([
          blogService.getAllBlogs(categoryName, 1, 11),
          fetchCategories(),
        ]);

        console.log("CategoryPageClient - Blogs response:", blogsResponse);
        console.log("CategoryPageClient - Categories response:", categoriesResponse);

        setBlogsData(blogsResponse);
        setCategories(categoriesResponse);
      } catch (err) {
        console.error("CategoryPageClient - Error fetching data:", err);
        setError(err instanceof Error ? err.message : "حدث خطأ أثناء تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryName]);

  if (loading) {
    return (
      <main className="w-full min-h-screen px-4 md:px-14 py-10 bg-white dark:bg-gray-900">
        <div className="max-w-screen-xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">جاري تحميل التصنيف...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="w-full min-h-screen px-4 md:px-14 py-10 bg-white dark:bg-gray-900">
        <div className="max-w-screen-xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            خطأ في تحميل التصنيف
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </main>
    );
  }

  if (!blogsData) {
    return (
      <main className="w-full min-h-screen px-4 md:px-14 py-10 bg-white dark:bg-gray-900">
        <div className="max-w-screen-xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            لا توجد بيانات
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            لم يتم العثور على بيانات للتصنيف المطلوب.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen px-4 md:px-14 py-10 bg-white dark:bg-gray-900">
      <header className="max-w-screen-xl mx-auto text-right">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">
          تصنيف: {categoryName}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">أحدث المقالات في هذا التصنيف</p>
      </header>

      <div className="my-8" />

      {/* Category Top Ad */}
      <CategoryTopAd pageType="category" />

      <BlogsList
        initialBlogs={blogsData.blogs}
        initialTotalPages={blogsData.totalPages}
        initialCategories={categories}
        initialCategory={categoryName}
      />

      {/* Category Bottom Ad */}
      <div className="mt-8">
        <CategoryBottomAd pageType="category" />
      </div>
    </main>
  );
}

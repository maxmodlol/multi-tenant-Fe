// src/app/(site)/category/[category]/page.tsx
import type { Metadata } from "next";
import { blogService } from "@explore/services/blogService";
import { fetchCategories } from "@explore/services/categoryService";
import BlogsList from "@explore/components/BlogList";
import { CategoryTopAd, CategoryBottomAd } from "@/src/components/TenantAdInjector";

export const revalidate = 60;
export const dynamic = "force-static";

// Generate metadata per category
export async function generateMetadata(props: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const raw = decodeURIComponent(params.category);

  console.log("Metadata - Raw params:", params.category);
  console.log("Metadata - Decoded category:", raw);

  const title = `تصنيف: ${raw} — مدونة الموقع`;
  return {
    title,
    description: `عرض المقالات في تصنيف ${raw}`,
    openGraph: {
      title,
      description: `عرض المقالات في تصنيف ${raw}`,
      siteName: "مدونة الموقع",
      locale: "ar_AR",
    },
    twitter: {
      title,
      description: `عرض المقالات في تصنيف ${raw}`,
    },
  };
}

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage(props: PageProps) {
  const params = await props.params;
  const categoryName = decodeURIComponent(params.category);

  console.log("Category page - Raw params:", params.category);
  console.log("Category page - Raw params length:", params.category.length);
  console.log(
    "Category page - Raw params char codes:",
    Array.from(params.category).map((c) => c.charCodeAt(0)),
  );
  console.log("Category page - Decoded category:", categoryName);
  console.log("Category page - Decoded category length:", categoryName.length);
  console.log(
    "Category page - Decoded category char codes:",
    Array.from(categoryName).map((c) => c.charCodeAt(0)),
  );

  try {
    // Fetch page 1 of this category
    const [blogsData, categories] = await Promise.all([
      blogService.getAllBlogs(categoryName, 1, 11),
      fetchCategories(),
    ]);

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
  } catch (error) {
    console.error("Error loading category page:", error);
    return (
      <main className="w-full min-h-screen px-4 md:px-14 py-10 bg-white dark:bg-gray-900">
        <div className="max-w-screen-xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            خطأ في تحميل التصنيف
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            حدث خطأ أثناء تحميل صفحة التصنيف. يرجى المحاولة مرة أخرى.
          </p>
        </div>
      </main>
    );
  }
}

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
  const title = `تصنيف: ${raw} — مدونة الموقع`;
  return {
    title,
    description: `عرض المقالات في تصنيف ${params.category}`,
    openGraph: {
      title,
      description: `عرض المقالات في تصنيف ${params.category}`,
      siteName: "مدونة الموقع",
      locale: "ar_AR",
    },
    twitter: {
      title,
      description: `عرض المقالات في تصنيف ${params.category}`,
    },
  };
}

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage(props: PageProps) {
  const params = await props.params;
  const categoryName = decodeURIComponent(params.category);
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
}

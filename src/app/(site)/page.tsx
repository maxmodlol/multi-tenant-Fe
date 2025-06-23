export const revalidate = 60;
export const dynamic = "force-static";
import { blogService } from "@explore/services/blogService";
import { fetchCategories } from "@explore/services/categoryService";
import HomeClient from "./HomeClient";

export default async function Home() {
  const [blogsData, categories] = await Promise.all([
    blogService.getAllBlogs("all", 1, 11),
    fetchCategories(),
  ]);

  return (
    <div className="w-full min-h-screen px-4 md:px-14 py-10 bg-white dark:bg-gray-900">
      {/* Top Section */}
      <header className="max-w-screen-xl mx-auto">
        <h1 className="text-right text-4xl font-bold text-gray-800 dark:text-gray-200">
          الموارد والرؤى
        </h1>
        <p className="mt-2 text-right text-gray-600 dark:text-gray-300">
          أحدث أخبار الصناعة، المقالات، الإرشادات، والنصائح
        </p>
      </header>
      <div className="my-8" />

      <HomeClient
        initialBlogs={blogsData.blogs}
        initialTotalPages={blogsData.totalPages}
        initialCategories={categories}
      />
    </div>
  );
}

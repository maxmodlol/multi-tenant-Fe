export const dynamic = "force-dynamic";
export const revalidate = 0;

import { blogService } from "@explore/services/blogService";
import { fetchCategories } from "@explore/services/categoryService";
import { fetchSiteSetting } from "@explore/services/settingService";
import { detectTenantServerOnly } from "@/src/lib/tenantFromServer";
import HomeClient from "./HomeClient";

export default async function Home() {
  const tenant = await detectTenantServerOnly();
  const [blogsData, categories, siteSetting] = await Promise.all([
    blogService.getAllBlogs("all", 1, 11),
    fetchCategories(),
    fetchSiteSetting(tenant).catch(
      () =>
        ({
          siteTitle: "الموارد والرؤى",
          siteDescription: "أحدث أخبار الصناعة، المقالات، الإرشادات، والنصائح",
        }) as any,
    ),
  ]);

  return (
    <div className="w-full min-h-screen px-4 md:px-14 py-10 bg-white dark:bg-gray-900">
      {/* Top Section */}
      <header className="max-w-screen-xl mx-auto">
        <h1 className="text-right text-4xl font-bold text-gray-800 dark:text-gray-200">
          {siteSetting.siteTitle || "الموارد والرؤى"}
        </h1>
        <p className="mt-2 text-right text-gray-600 dark:text-gray-300">
          {siteSetting.siteDescription || ""}
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

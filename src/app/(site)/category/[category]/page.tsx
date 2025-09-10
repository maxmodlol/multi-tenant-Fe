// src/app/(site)/category/[category]/page.tsx
import type { Metadata } from "next";
import CategoryPageClient from "./CategoryPageClient";

export const revalidate = 60;
export const dynamic = "force-dynamic";

// Generate metadata per category
export async function generateMetadata(props: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const raw = decodeURIComponent(params.category);

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

  return <CategoryPageClient categoryName={categoryName} />;
}

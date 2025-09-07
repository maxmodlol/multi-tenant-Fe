"use client";

import dynamic from "next/dynamic";
import type { Blog } from "@explore/types/blogs";
import type { Category } from "@explore/types/category";
import { HomeHeroAd, HomeBelowHeroAd } from "@/src/components/TenantAdInjector";

// dynamically load & only on client
const FeaturedSlider = dynamic(() => import("@explore/components/FeaturedSlider"), {
  ssr: false,
  loading: () => null,
});
const BlogsList = dynamic(() => import("@explore/components/BlogList"), {
  ssr: false,
  loading: () => null,
});

interface HomeClientProps {
  initialBlogs: Blog[];
  initialTotalPages: number;
  initialCategories: Category[];
}

export default function HomeClient({
  initialBlogs,
  initialTotalPages,
  initialCategories,
}: HomeClientProps) {
  return (
    <>
      {/* Hero Ad - Above the featured slider */}
      <HomeHeroAd tenantId="main" />

      <section className="">
        <FeaturedSlider
          initialBlogs={initialBlogs}
          initialTotalPages={initialTotalPages}
          initialTotalBlogs={initialBlogs.length}
        />
      </section>

      {/* Below Hero Ad - Between featured slider and blog list */}
      <HomeBelowHeroAd tenantId="main" />

      <section>
        <BlogsList
          initialBlogs={initialBlogs}
          initialTotalPages={initialTotalPages}
          initialCategories={initialCategories}
        />
      </section>
    </>
  );
}

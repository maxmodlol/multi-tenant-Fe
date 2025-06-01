// src/app/(site)/HomeClient.tsx
"use client";

import dynamic from "next/dynamic";
import type { Blog } from "@explore/types/blogs";
import type { Category } from "@explore/types/category";

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
      <section className="max-w-screen-lg mx-auto">
        <FeaturedSlider
          initialBlogs={initialBlogs}
          initialTotalPages={initialTotalPages}
          initialTotalBlogs={initialBlogs.length}
        />
      </section>
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

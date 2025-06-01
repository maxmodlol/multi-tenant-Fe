// components/BlogPages.tsx
"use client";

import type { BlogPage } from "@explore/types/blogs";

type Props = { pages: BlogPage[]; currentPage: number };

export default function BlogPages({ pages, currentPage }: Props) {
  const page = pages[currentPage - 1];
  if (!page) return null;

  return (
    <article className="prose dark:prose-invert max-w-none py-6">
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
    </article>
  );
}

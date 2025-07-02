"use client";

import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAdSettings } from "@/src/hooks/dashboard/useAdSetting";
import { Placement } from "@/src/types/ads";
import { Blog } from "@explore/types/blogs";
import BlogHero from "@explore/components/BlogHero";
import BlogFooterMeta from "@explore/components/BlogFooterMeta";
import PaginationBar from "@explore/components/PaginationBar";
import RelatedBlogs from "@explore/components/RelatedBlogs";

/**
 * Renders one ad snippet as raw HTML.
 */
function AdSlot({ snippet }: { snippet: string }) {
  return (
    <div
      className="my-6 w-full flex justify-center"
      dangerouslySetInnerHTML={{ __html: snippet }}
    />
  );
}

export default function BlogDetailClient({ blog }: { blog: Blog }) {
  const [page, setPage] = useState(1);
  const total = blog.pages.length;
  const qc = useQueryClient();

  // Fetch ads for this blogId:
  const {
    data: adSettings,
    isLoading: adsLoading,
    error: adsError,
    refetch,
  } = useAdSettings(blog.id);

  // Re-fetch ads whenever `page` changes:
  useEffect(() => {
    refetch();
  }, [page, refetch]);

  // Prepare ABOVE_TAGS and UNDER_DATE for BlogHero:
  const aboveTagsAds = adSettings
    ? adSettings
        .filter((ad) => ad.isEnabled && ad.placement === Placement.ABOVE_TAGS)
        .map((ad) => ad.codeSnippet)
    : [];

  const underDateAds = adSettings
    ? adSettings
        .filter((ad) => ad.isEnabled && ad.placement === Placement.UNDER_DATE)
        .map((ad) => ad.codeSnippet)
    : [];

  // INLINE ad injection into page content:
  const [contentWithInlineAds, setContentWithInlineAds] = useState<string[]>([]);

  useEffect(() => {
    if (!adSettings || adsLoading) {
      // If still loading or no ads, use original content
      setContentWithInlineAds(blog.pages.map((p) => p.content));
      return;
    }

    const inlineAds = adSettings.filter((ad) => ad.isEnabled && ad.placement === Placement.INLINE);
    if (inlineAds.length === 0) {
      setContentWithInlineAds(blog.pages.map((p) => p.content));
      return;
    }

    // Only handle the first INLINE ad for simplicity:
    const firstInline = inlineAds[0];
    const offset = firstInline.positionOffset || 0;

    // Split first page content into words:
    const firstWords = blog.pages[0].content.split(" ");
    if (offset >= firstWords.length) {
      firstWords.push(firstInline.codeSnippet);
    } else {
      firstWords.splice(offset, 0, firstInline.codeSnippet);
    }

    const newPages = [firstWords.join(" "), ...blog.pages.slice(1).map((p) => p.content)];
    setContentWithInlineAds(newPages);
  }, [adSettings, adsLoading, blog.pages]);

  if (adsError) {
    console.error("Error loading ad settings:", adsError);
  }
  const isSingle = total === 1;
  return (
    <div className="bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      {/* ─── Hero including ABOVE_TAGS & UNDER_DATE ─── */}
      <BlogHero blog={blog} aboveTagsAds={aboveTagsAds} underDateAds={underDateAds} />

      <div className="max-w-3xl mx-auto px-4">
        {/* ─── Pagination (Top) ─── */}
        {!isSingle && (
          <PaginationBar
            currentPage={page}
            totalPages={total}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}

        {/* ─── Page Content with INLINE ─── */}
        <div className="space-y-8 py-6">
          <article className="prose dark:prose-invert max-w-none">
            <div
              dangerouslySetInnerHTML={{
                __html:
                  contentWithInlineAds.length > 0
                    ? contentWithInlineAds[page - 1]
                    : blog.pages[page - 1].content,
              }}
            />
          </article>

          {/* ─── UNDER_SHARE_1 Ad ─── */}
          {adSettings
            ?.filter((ad) => ad.isEnabled && ad.placement === Placement.UNDER_SHARE_1)
            .map((ad) => <AdSlot key={ad.id} snippet={ad.codeSnippet} />)}

          {/* ─── UNDER_SHARE_2 Ad ─── */}
          {adSettings
            ?.filter((ad) => ad.isEnabled && ad.placement === Placement.UNDER_SHARE_2)
            .map((ad) => <AdSlot key={ad.id} snippet={ad.codeSnippet} />)}
        </div>

        {/* ─── Pagination (Bottom) ─── */}
        {!isSingle && (
          <PaginationBar
            currentPage={page}
            totalPages={total}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}

        {/* ─── Footer Meta ─── */}
        <BlogFooterMeta
          url={typeof window !== "undefined" ? window.location.href : ""}
          author={blog.author}
          createdAt={blog.createdAt}
        />

        {/* ─── Optional Bottom UNDER_DATE Ad ─── */}
        {adSettings
          ?.filter((ad) => ad.isEnabled && ad.placement === Placement.UNDER_DATE)
          .map((ad) => <AdSlot key={`${ad.id}-bottom`} snippet={ad.codeSnippet} />)}
      </div>

      {/* ─── Related Blogs ─── */}
      <RelatedBlogs currentBlog={blog} />
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";

// Declare adsbygoogle for TypeScript
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import {
  UnderDateAd,
  UnderHeroAd,
  AboveShareableAd,
  UnderShareableAd,
} from "@/src/components/TenantAdInjector";
import { useInlineAds, injectInlineAdsIntoContent } from "@/src/utils/inlineAdInjector";
import { useTenantAds } from "@/src/hooks/public/useTenantAds";
import { useCurrentTenant } from "@/src/hooks/public/useCurrentTenant";
import { TenantAdPlacement } from "@/src/types/tenantAds";
import { Blog } from "@explore/types/blogs";
import BlogHero from "@explore/components/BlogHero";
import BlogFooterMeta from "@explore/components/BlogFooterMeta";
import PaginationBar from "@explore/components/PaginationBar";
import RelatedBlogs from "@explore/components/RelatedBlogs";

// AdSlot component removed - now using unified TenantAdInjector system

export default function BlogDetailClient({
  blog,
  initialPage = 1,
}: {
  blog: Blog;
  initialPage?: number;
}) {
  const searchParams = useSearchParams();
  const urlPage = parseInt(searchParams.get("page") || "1", 10);
  const [page, setPage] = useState(urlPage || initialPage);
  const qc = useQueryClient();
  const router = useRouter();

  // Get current tenant
  const currentTenant = useCurrentTenant();

  // Get inline ads for this blog
  const inlineAds = useInlineAds(blog.id);

  // Get all blog ads for this blog
  const { data: blogAdsData } = useTenantAds(
    "blog",
    [
      "ABOVE_TAGS",
      "UNDER_DATE",
      "UNDER_HERO",
      "UNDER_HERO_IMAGE",
      "ABOVE_SHAREABLE",
      "UNDER_SHAREABLE",
    ],
    currentTenant,
    blog.id,
  );

  const aboveTagsAds = blogAdsData?.["ABOVE_TAGS"] || [];
  const underDateAds = blogAdsData?.["UNDER_DATE"] || [];

  // Debug logging
  console.log("BlogDetailClient Debug:", {
    currentTenant,
    blogAdsData,
    aboveTagsAds,
    underDateAds,
    blogId: blog.id,
  });

  // Sync page state with URL parameters
  useEffect(() => {
    setPage(urlPage || 1);
  }, [urlPage]);

  // Ensure pages are sorted by pageNumber and inject inline ads into content
  const sortedPages = blog.pages.sort((a, b) => a.pageNumber - b.pageNumber);
  const total = sortedPages.length;
  const contentWithInlineAds = sortedPages.map((pageContent) =>
    injectInlineAdsIntoContent(pageContent.content, inlineAds),
  );

  // Process inline ads through AdManager after content is rendered
  useEffect(() => {
    if (inlineAds.length > 0) {
      const processInlineAds = async () => {
        // Find all inline ad containers and process them through AdManager
        const inlineAdContainers = document.querySelectorAll(".inline-ad-container");
        console.log(`🔍 Found ${inlineAdContainers.length} inline ad containers`);

        // Import AdManager dynamically
        const { adManager } = await import("@/src/utils/adManager");

        inlineAdContainers.forEach(async (container, index) => {
          const htmlContent = container.innerHTML;

          // Check if this container has AdSense or GPT ads
          const hasAdSense = htmlContent.includes("adsbygoogle");
          const hasGPT = htmlContent.includes("googletag") || htmlContent.includes("div-gpt-ad-");

          if (hasAdSense || hasGPT) {
            try {
              console.log(`🔍 Processing inline ad container ${index + 1}:`, {
                hasAdSense,
                hasGPT,
                contentLength: htmlContent.length,
              });

              // Clear the container first
              container.innerHTML = "";

              // Process through AdManager
              if (hasAdSense) {
                await adManager.handleAdSenseAd(
                  `inline-ad-${index}`,
                  container as HTMLElement,
                  htmlContent,
                );
              } else if (hasGPT) {
                await adManager.handleGPTDisplayAd(
                  `inline-ad-${index}`,
                  container as HTMLElement,
                  htmlContent,
                );
              }

              console.log(`✅ Inline ad container ${index + 1} processed successfully`);
            } catch (error) {
              console.error(`❌ Error processing inline ad container ${index + 1}:`, error);
              // Restore original content if processing fails
              container.innerHTML = htmlContent;
            }
          }
        });
      };

      // Execute after a short delay to ensure DOM is updated
      const timeoutId = setTimeout(processInlineAds, 500);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [inlineAds, page]);

  // Old ad error handling removed - now using unified system
  const isSingle = total === 1;
  return (
    <div className="bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      {/* ─── Hero including ABOVE_TAGS & UNDER_DATE ─── */}
      <BlogHero
        blog={blog}
        aboveTagsAds={aboveTagsAds.map((ad) => ad.codeSnippet).filter(Boolean)}
        underDateAds={underDateAds.map((ad) => ad.codeSnippet).filter(Boolean)}
      />

      {/* ─── UNDER_HERO Ad ─── */}
      <UnderHeroAd blogId={blog.id} />

      <div className="max-w-4xl mx-auto px-4 md:px-6 -mt-2 md:mt-0">
        {/* ─── Pagination (Top) ─── */}
        {!isSingle && (
          <div className="mb-2">
            <PaginationBar
              currentPage={page}
              totalPages={total}
              onPageChange={(newPage) => {
                router.push(`/blogs/${blog.id}?page=${newPage}`);
              }}
            />
          </div>
        )}

        {/* ─── Page Content with INLINE ─── */}
        <div className="space-y-3 py-1">
          <article className="prose dark:prose-invert max-w-none prose-lg leading-relaxed">
            <div
              dangerouslySetInnerHTML={{
                __html:
                  contentWithInlineAds.length > 0
                    ? contentWithInlineAds[page - 1]
                    : sortedPages[page - 1].content,
              }}
            />
          </article>
        </div>

        {/* ─── Pagination (Bottom) ─── */}
        {!isSingle && (
          <div className="mt-2">
            <PaginationBar
              currentPage={page}
              totalPages={total}
              onPageChange={(newPage) => {
                router.push(`/blogs/${blog.id}?page=${newPage}`);
              }}
            />
          </div>
        )}

        {/* ─── ABOVE_SHAREABLE Ad ─── */}
        <AboveShareableAd blogId={blog.id} />

        {/* ─── Footer Meta (Shareable Links) ─── */}
        <div className="mt-6">
          <BlogFooterMeta
            url={typeof window !== "undefined" ? window.location.href : ""}
            author={blog.author}
            createdAt={blog.createdAt}
          />
        </div>

        {/* ─── UNDER_SHAREABLE Ad ─── */}
        <UnderShareableAd blogId={blog.id} />
      </div>

      {/* ─── Related Blogs ─── */}
      <div className="mt-8">
        <RelatedBlogs currentBlog={blog} />
      </div>
    </div>
  );
}

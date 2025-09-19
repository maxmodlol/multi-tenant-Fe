"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { useTenantAds } from "@/src/hooks/public/useTenantAds";
import { useCurrentTenant } from "@/src/hooks/public/useCurrentTenant";
import { TenantAdPlacement } from "@/src/types/tenantAds";
import type { PageType } from "@/src/types/tenantAds";

// Declare adsbygoogle for TypeScript
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface TenantAdInjectorProps {
  placement: TenantAdPlacement;
  pageType: PageType;
  className?: string;
  tenantId?: string;
  blogId?: string;
}

function TenantAdInjector({
  placement,
  pageType,
  className = "",
  tenantId,
  blogId,
}: TenantAdInjectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentTenant = useCurrentTenant();
  const effectiveTenantId = tenantId || currentTenant;

  const {
    data: adsByPlacement,
    isLoading,
    error,
  } = useTenantAds(pageType, [placement], effectiveTenantId, blogId);

  // Debounced ad injection to prevent rapid re-renders
  const injectAds = useCallback(() => {
    if (!adsByPlacement || !containerRef.current) return;

    const ads = adsByPlacement[placement] || [];
    if (ads.length === 0) return;

    // Clear previous content
    containerRef.current.innerHTML = "";

    // Inject each ad
    ads.forEach((ad, index) => {
      if (ad.isEnabled && ad.codeSnippet) {
        const adContainer = document.createElement("div");
        adContainer.className = `tenant-ad ${className}`;
        adContainer.setAttribute("data-ad-id", ad.id);
        adContainer.setAttribute("data-ad-placement", ad.placement);
        adContainer.setAttribute("data-ad-appearance", ad.appearance);
        adContainer.setAttribute("data-ad-index", index.toString());

        // Apply appearance classes and add close button for popup/sticky
        switch (ad.appearance) {
          case "FULL_WIDTH":
            adContainer.className += " w-full";
            break;
          case "LEFT_ALIGNED":
            adContainer.className += " text-left";
            break;
          case "RIGHT_ALIGNED":
            adContainer.className += " text-right";
            break;
          case "CENTERED":
            adContainer.className += " text-center mx-auto";
            break;
          case "STICKY":
            adContainer.className += " sticky top-0 z-10 relative";
            break;
          case "POPUP":
            adContainer.className +=
              " fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white p-4 rounded-lg shadow-2xl";
            break;
        }

        // Inject the ad code
        adContainer.innerHTML = ad.codeSnippet;

        // Add close button for popup and sticky ads
        if (ad.appearance === "POPUP" || ad.appearance === "STICKY") {
          const closeButton = document.createElement("button");
          closeButton.innerHTML = "×";
          closeButton.className =
            "absolute top-2 right-2 w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-lg font-bold cursor-pointer z-10";
          closeButton.style.cssText =
            "position: absolute; top: 8px; right: 8px; width: 24px; height: 24px; background: #e5e7eb; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: bold; cursor: pointer; z-index: 10; border: none;";
          closeButton.onclick = () => {
            adContainer.style.display = "none";
          };
          adContainer.appendChild(closeButton);
        }

        containerRef.current!.appendChild(adContainer);

        // Handle script execution with proper AdSense support
        const scripts = adContainer.querySelectorAll("script");
        scripts.forEach((script, scriptIndex) => {
          const newScript = document.createElement("script");

          if (script.src) {
            newScript.src = script.src;
          } else if (script.textContent) {
            // Check if this is an AdSense script
            const isAdSense =
              script.textContent.includes("adsbygoogle") ||
              adContainer.innerHTML.includes("adsbygoogle");

            if (isAdSense) {
              // For AdSense, execute directly but handle the push carefully
              newScript.textContent = script.textContent;
            } else {
              // For other scripts, wrap in IIFE to avoid variable conflicts
              const wrappedScript = `
                (function() {
                  try {
                    ${script.textContent}
                  } catch (error) {
                    console.warn('Ad script error:', error);
                  }
                })();
              `;
              newScript.textContent = wrappedScript;
            }
          }

          // Add unique attributes to prevent conflicts
          newScript.setAttribute("data-ad-script", `${ad.id}-${scriptIndex}`);
          newScript.setAttribute("data-ad-placement", ad.placement);
          newScript.setAttribute("data-ad-type", "injected");

          // Append to document head for better script execution
          document.head.appendChild(newScript);
        });

        // Handle AdSense push after script injection
        const isAdSense = adContainer.innerHTML.includes("adsbygoogle");
        if (isAdSense && window.adsbygoogle) {
          setTimeout(() => {
            try {
              // Get all ins elements in this specific ad container
              const insElements = adContainer.querySelectorAll("ins.adsbygoogle");

              if (insElements.length > 0) {
                // Check if any ins elements don't have ads yet
                let needsPush = false;
                insElements.forEach((ins: any) => {
                  if (!ins.dataset.adsbygoogleStatus) {
                    needsPush = true;
                  }
                });

                if (needsPush) {
                  // Only push for unfilled ads
                  (window.adsbygoogle = window.adsbygoogle || []).push({});
                } else {
                  console.log(`AdSense: Ad ${ad.id} already has ads, skipping push`);
                }
              }
            } catch (error) {
              console.error("AdSense push error:", error);
            }
          }, 200); // Delay to ensure proper initialization
        }
      }
    });
  }, [adsByPlacement, placement, className]);

  // Use debounced injection to prevent rapid re-renders
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      injectAds();
    }, 100); // 100ms debounce

    return () => clearTimeout(timeoutId);
  }, [injectAds]);

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      if (containerRef.current) {
        // Remove all injected scripts for this placement
        const scripts = document.head.querySelectorAll(`script[data-ad-placement="${placement}"]`);
        scripts.forEach((script) => script.remove());

        containerRef.current.innerHTML = "";
      }
    };
  }, [placement]);

  // Don't show loading spinner - just return empty container
  if (isLoading) {
    return <div ref={containerRef} className={`tenant-ad-container ${className}`} />;
  }

  // Show error state
  if (error) {
    console.error(`Error loading ads for ${placement}:`, error);
    return (
      <div className={`tenant-ad-error ${className}`}>
        <div className="text-center p-4 text-sm text-gray-400">
          {/* Silent error - don't show error message to users */}
        </div>
      </div>
    );
  }

  // Show ads container
  return <div ref={containerRef} className={`tenant-ad-container ${className}`} />;
}

// Export the main component as default
export default TenantAdInjector;

// Export specialized components for different placements
export function HeaderAd({ pageType, tenantId }: { pageType: PageType; tenantId?: string }) {
  return (
    <TenantAdInjector
      placement={TenantAdPlacement.HEADER}
      pageType={pageType}
      tenantId={tenantId}
      className="header-ad"
    />
  );
}

export function FooterAd({ pageType, tenantId }: { pageType: PageType; tenantId?: string }) {
  return (
    <TenantAdInjector
      placement={TenantAdPlacement.FOOTER}
      pageType={pageType}
      tenantId={tenantId}
      className="footer-ad"
    />
  );
}

export function HomeHeroAd({ tenantId }: { tenantId?: string }) {
  return (
    <TenantAdInjector
      placement={TenantAdPlacement.HOME_HERO}
      pageType="home"
      tenantId={tenantId}
      className="home-hero-ad"
    />
  );
}

export function HomeBelowHeroAd({ tenantId }: { tenantId?: string }) {
  return (
    <TenantAdInjector
      placement={TenantAdPlacement.HOME_BELOW_HERO}
      pageType="home"
      tenantId={tenantId}
      className="home-below-hero-ad"
    />
  );
}

export function CategoryTopAd({ pageType, tenantId }: { pageType: PageType; tenantId?: string }) {
  return (
    <TenantAdInjector
      placement={TenantAdPlacement.CATEGORY_TOP}
      pageType={pageType}
      tenantId={tenantId}
      className="category-top-ad"
    />
  );
}

export function CategoryBottomAd({
  pageType,
  tenantId,
}: {
  pageType: PageType;
  tenantId?: string;
}) {
  return (
    <TenantAdInjector
      placement={TenantAdPlacement.CATEGORY_BOTTOM}
      pageType={pageType}
      tenantId={tenantId}
      className="category-bottom-ad"
    />
  );
}

export function SearchTopAd({ tenantId }: { tenantId?: string }) {
  return (
    <TenantAdInjector
      placement={TenantAdPlacement.SEARCH_TOP}
      pageType="search"
      tenantId={tenantId}
      className="search-top-ad"
    />
  );
}

export function SearchBottomAd({ tenantId }: { tenantId?: string }) {
  return (
    <TenantAdInjector
      placement={TenantAdPlacement.SEARCH_BOTTOM}
      pageType="search"
      tenantId={tenantId}
      className="search-bottom-ad"
    />
  );
}

export function BlogListTopAd({ tenantId }: { tenantId?: string }) {
  return (
    <TenantAdInjector
      placement={TenantAdPlacement.BLOG_LIST_TOP}
      pageType="blog-list"
      tenantId={tenantId}
      className="blog-list-top-ad"
    />
  );
}

export function BlogListBottomAd({ tenantId }: { tenantId?: string }) {
  return (
    <TenantAdInjector
      placement={TenantAdPlacement.BLOG_LIST_BOTTOM}
      pageType="blog-list"
      tenantId={tenantId}
      className="blog-list-bottom-ad"
    />
  );
}

// Blog-specific ad components
export function AboveTagsAd({ blogId }: { blogId?: string }) {
  return (
    <TenantAdInjector
      placement={TenantAdPlacement.ABOVE_TAGS}
      pageType="blog"
      className="above-tags-ad"
      blogId={blogId}
    />
  );
}

export function UnderDateAd({ blogId }: { blogId?: string }) {
  return (
    <TenantAdInjector
      placement={TenantAdPlacement.UNDER_DATE}
      pageType="blog"
      className="under-date-ad"
      blogId={blogId}
    />
  );
}

export function UnderHeroAd({ blogId }: { blogId?: string }) {
  return (
    <TenantAdInjector
      placement={TenantAdPlacement.UNDER_HERO}
      pageType="blog"
      className="under-hero-ad"
      blogId={blogId}
    />
  );
}

export function UnderHeroImageAd({ blogId }: { blogId?: string }) {
  return (
    <TenantAdInjector
      placement={TenantAdPlacement.UNDER_HERO_IMAGE}
      pageType="blog"
      className="under-hero-image-ad"
      blogId={blogId}
    />
  );
}

export function AboveShareableAd({ blogId }: { blogId?: string }) {
  return (
    <TenantAdInjector
      placement={TenantAdPlacement.ABOVE_SHAREABLE}
      pageType="blog"
      className="above-shareable-ad"
      blogId={blogId}
    />
  );
}

export function UnderShareableAd({ blogId }: { blogId?: string }) {
  return (
    <TenantAdInjector
      placement={TenantAdPlacement.UNDER_SHAREABLE}
      pageType="blog"
      className="under-shareable-ad"
      blogId={blogId}
    />
  );
}

export function InlineAd({ blogId }: { blogId?: string }) {
  return (
    <TenantAdInjector
      placement={TenantAdPlacement.INLINE}
      pageType="blog"
      className="inline-ad"
      blogId={blogId}
    />
  );
}

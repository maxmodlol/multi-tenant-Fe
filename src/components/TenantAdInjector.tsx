"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { useTenantAds } from "@/src/hooks/public/useTenantAds";
import { useCurrentTenant } from "@/src/hooks/public/useCurrentTenant";
import { TenantAdPlacement } from "@/src/types/tenantAds";
import type { PageType } from "@/src/types/tenantAds";

interface TenantAdInjectorProps {
  placement: TenantAdPlacement;
  pageType: PageType;
  className?: string;
  tenantId?: string;
}

function TenantAdInjector({
  placement,
  pageType,
  className = "",
  tenantId,
}: TenantAdInjectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentTenant = useCurrentTenant();
  const effectiveTenantId = tenantId || currentTenant;

  const {
    data: adsByPlacement,
    isLoading,
    error,
  } = useTenantAds(pageType, [placement], effectiveTenantId);

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

        // Apply appearance classes
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
            adContainer.className += " sticky top-0 z-10";
            break;
        }

        // Inject the ad code
        adContainer.innerHTML = ad.codeSnippet;
        containerRef.current!.appendChild(adContainer);

        // Execute any scripts in the ad code with proper scoping
        const scripts = adContainer.querySelectorAll("script");
        scripts.forEach((script, scriptIndex) => {
          const newScript = document.createElement("script");

          if (script.src) {
            newScript.src = script.src;
          } else if (script.textContent) {
            // Wrap the script content in an IIFE to avoid variable conflicts
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

          // Add unique attributes to prevent conflicts
          newScript.setAttribute("data-ad-script", `${ad.id}-${scriptIndex}`);
          adContainer.appendChild(newScript);
        });
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
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

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

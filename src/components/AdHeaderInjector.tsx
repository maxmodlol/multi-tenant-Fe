"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useTenantAds } from "@/src/hooks/public/useTenantAds";
import { useCurrentTenant } from "@/src/hooks/public/useCurrentTenant";
import { TenantAdPlacement } from "@/src/types/tenantAds";
import { adManager } from "@/src/utils/adManager";

/**
 * This component takes tenant-specific header ads and injects them into document.head
 * Header ads are global scripts (Google Analytics, AdSense setup, etc.) that should
 * run on all pages regardless of page type (home, blog, category, etc.)
 * It uses the new tenant-specific ad system instead of the old global AdHeaderSetting
 */
export default function AdHeaderInjector() {
  const pathname = usePathname();
  const currentTenant = useCurrentTenant();

  // Fetch tenant-specific header ads (should work on all page types)
  // We'll fetch for "home" page type as it typically contains global ads
  const { data: headerAdsData, isLoading } = useTenantAds(
    "home",
    [TenantAdPlacement.HEADER],
    currentTenant,
  );

  const nodesRef = useRef<Node[]>([]);

  // Get all enabled header ads
  const allHeaderAds = (headerAdsData?.HEADER || []).filter((ad) => ad.isEnabled && ad.codeSnippet);

  // Initialize AdManager
  useEffect(() => {
    adManager.initialize();
  }, []);

  useEffect(() => {
    // Always remove any previously inserted nodes before deciding what to do
    if (nodesRef.current.length > 0) {
      nodesRef.current.forEach((n) => {
        if (n.parentNode === document.head) {
          document.head.removeChild(n);
        }
      });
      nodesRef.current = [];
    }

    // Don't inject ads on dashboard, auth, or admin pages
    if (
      pathname?.startsWith("/dashboard") ||
      pathname?.startsWith("/login") ||
      pathname?.startsWith("/forgot-password") ||
      pathname?.startsWith("/reset-password") ||
      pathname?.startsWith("/auth") ||
      pathname?.startsWith("/search")
    ) {
      console.log("🚫 AdHeaderInjector: Skipping ad injection for admin page:", pathname);
      return;
    }

    if (isLoading || allHeaderAds.length === 0) return;

    console.log("🚀 AdHeaderInjector: Injecting tenant-specific header ads:", {
      tenantId: currentTenant,
      adCount: allHeaderAds.length,
      ads: allHeaderAds.map((ad) => ({ id: ad.id, title: ad.title, enabled: ad.isEnabled })),
    });

    // Process each tenant-specific header ad
    allHeaderAds.forEach((headerAd) => {
      if (headerAd.isEnabled && headerAd.codeSnippet) {
        const snippetHtml = headerAd.codeSnippet;

        // 1) Parse the HTML string into a DocumentFragment
        const template = document.createElement("template");
        template.innerHTML = snippetHtml.trim();
        const fragment = template.content;

        // 2) We'll keep track of inserted nodes so we can clean them up later
        const insertedNodes: Node[] = [];

        // 3) Iterate over each top-level node in the fragment:
        fragment.childNodes.forEach((node) => {
          if (node.nodeName.toLowerCase() === "script") {
            // This is a <script>…</script> node. We need to re-create it.
            const oldScript = node as HTMLScriptElement;
            const newScript = document.createElement("script");

            // Copy all attributes (src, async, data-*, etc.)
            for (let i = 0; i < oldScript.attributes.length; i++) {
              const { name, value } = oldScript.attributes[i];
              newScript.setAttribute(name, value);
            }

            // If there's inline code (innerHTML), copy it as textContent
            if (oldScript.textContent) {
              // Check if this is a Google Analytics script
              const isGoogleAnalytics =
                oldScript.textContent.includes("gtag") &&
                oldScript.textContent.includes("dataLayer");

              // Check if this is an AdSense script
              const isAdSense =
                oldScript.textContent.includes("adsbygoogle") &&
                oldScript.textContent.includes("push");

              // Check if this is a GPT script
              const isGPT =
                oldScript.textContent.includes("googletag") &&
                (oldScript.textContent.includes("defineSlot") ||
                  oldScript.textContent.includes("display"));

              if (isGoogleAnalytics) {
                // For Google Analytics, wrap in a function that waits for gtag to be available
                newScript.textContent = `
                  (function() {
                    // Wait for gtag to be available
                    function waitForGtag() {
                      if (typeof gtag !== 'undefined') {
                        ${oldScript.textContent}
                      } else {
                        setTimeout(waitForGtag, 50);
                      }
                    }
                    waitForGtag();
                  })();
                `;
              } else if (isAdSense) {
                // For AdSense, wrap in a function that waits for adsbygoogle to be available
                newScript.textContent = `
                  (function() {
                    // Wait for adsbygoogle to be available
                    function waitForAdSense() {
                      if (typeof adsbygoogle !== 'undefined') {
                        ${oldScript.textContent}
                      } else {
                        setTimeout(waitForAdSense, 100);
                      }
                    }
                    waitForAdSense();
                  })();
                `;
              } else if (isGPT) {
                // For GPT scripts, wrap in a function that waits for googletag to be available
                newScript.textContent = `
                  (function() {
                    // Wait for googletag to be available
                    function waitForGPT() {
                      if (typeof googletag !== 'undefined' && googletag.pubads) {
                        ${oldScript.textContent}
                      } else {
                        setTimeout(waitForGPT, 100);
                      }
                    }
                    waitForGPT();
                  })();
                `;
              } else {
                newScript.textContent = oldScript.textContent;
              }
            }

            // Append the fresh <script> into <head>; it will execute
            document.head.appendChild(newScript);
            insertedNodes.push(newScript);
          } else {
            // Some other node (e.g., <meta>, <link>, <style>, or plain text)
            // Move it directly into <head>.
            const clone = node.cloneNode(true);
            document.head.appendChild(clone);
            insertedNodes.push(clone);
          }
        });

        // Track nodes globally for route changes and unmount cleanup
        nodesRef.current = insertedNodes;

        // 4) Cleanup: when this component unmounts or headerData changes, remove those nodes
        return () => {
          insertedNodes.forEach((n) => {
            if (n.parentNode === document.head) {
              document.head.removeChild(n);
            }
          });
          nodesRef.current = [];
        };
      }
    });
  }, [isLoading, allHeaderAds, pathname, currentTenant]);

  return null;
}

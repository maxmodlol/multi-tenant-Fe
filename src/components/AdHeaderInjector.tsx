"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAdHeader } from "@/src/hooks/dashboard/useAdHeader";
import type { AdHeaderSetting } from "@/src/types/ads";
import { adManager } from "@/src/utils/adManager";

/**
 * This component takes the raw HTML/JS string from headerData.headerSnippet
 * (which may contain <script> tags, <meta> tags, <style> tags, etc.)
 * and injects it into document.head so that all <script> nodes actually execute.
 */
export default function AdHeaderInjector() {
  const pathname = usePathname();
  const { data: headerData, isLoading, error } = useAdHeader();
  const nodesRef = useRef<Node[]>([]);

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

    if (isLoading || error || !headerData) return;

    if (headerData.isEnabled && headerData.headerSnippet) {
      const snippetHtml = headerData.headerSnippet;

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
              oldScript.textContent.includes("gtag") && oldScript.textContent.includes("dataLayer");

            // Check if this is an AdSense script
            const isAdSense =
              oldScript.textContent.includes("adsbygoogle") &&
              oldScript.textContent.includes("push");

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
  }, [isLoading, error, headerData, pathname]);

  return null;
}

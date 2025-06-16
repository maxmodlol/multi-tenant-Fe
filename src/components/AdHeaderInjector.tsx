"use client";

import { useEffect } from "react";
import { useAdHeader } from "@/src/hooks/dashboard/useAdHeader";
import type { AdHeaderSetting } from "@/src/types/ads";

/**
 * This component takes the raw HTML/JS string from headerData.headerSnippet
 * (which may contain <script> tags, <meta> tags, <style> tags, etc.)
 * and injects it into document.head so that all <script> nodes actually execute.
 */
export default function AdHeaderInjector() {
  const { data: headerData, isLoading, error } = useAdHeader();

  useEffect(() => {
    if (isLoading || error || !headerData) {
      return;
    }

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
            newScript.textContent = oldScript.textContent;
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

      // 4) Cleanup: when this component unmounts or headerData changes, remove those nodes
      return () => {
        insertedNodes.forEach((n) => {
          if (n.parentNode === document.head) {
            document.head.removeChild(n);
          }
        });
      };
    }
  }, [isLoading, error, headerData]);

  return null;
}

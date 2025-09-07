"use client";

import { useEffect } from "react";

interface TenantStyleInjectorProps {
  cssVars: string;
  tenantId: string;
}

export default function TenantStyleInjector({ cssVars, tenantId }: TenantStyleInjectorProps) {
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    try {
      // Check if style element already exists
      let styleElement = document.getElementById("tenant-vars") as HTMLStyleElement;

      if (!styleElement) {
        // Create new style element
        styleElement = document.createElement("style");
        styleElement.id = "tenant-vars";
        styleElement.setAttribute("data-tenant", tenantId);
        styleElement.setAttribute("data-purpose", "tenant-customization");
        styleElement.setAttribute("data-injected-by", "TenantStyleInjector");
        document.head.appendChild(styleElement);
      }

      // Update the style content
      const cssContent = cssVars ? `:root { ${cssVars} }` : "/* No tenant variables */";
      styleElement.textContent = cssContent;
      styleElement.setAttribute("data-tenant", tenantId);
      styleElement.setAttribute("data-last-updated", Date.now().toString());
    } catch (error) {
      console.warn("Failed to inject tenant styles:", error);
    }

    // Cleanup function
    return () => {
      // Don't remove the style element on unmount as it should persist
      // across route changes within the same tenant
    };
  }, [cssVars, tenantId]);

  return null; // This component doesn't render anything
}

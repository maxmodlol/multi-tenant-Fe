"use client";

import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface ConditionalAdWrapperProps {
  children: ReactNode;
}

export default function ConditionalAdWrapper({ children }: ConditionalAdWrapperProps) {
  const pathname = usePathname();

  // Don't render ads on dashboard, auth, or admin pages
  const isAdminPage =
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/forgot-password") ||
    pathname?.startsWith("/reset-password") ||
    pathname?.startsWith("/auth");

  useEffect(() => {
    if (isAdminPage) {
      console.log("🚫 ConditionalAdWrapper: Admin page detected, disabling ads:", pathname);
      // Remove any existing ad scripts from the head
      const adScripts = document.querySelectorAll(
        'script[src*="adsbygoogle"], script[src*="googlesyndication"]',
      );
      adScripts.forEach((script) => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    } else {
      console.log("✅ ConditionalAdWrapper: Public page detected, allowing ads:", pathname);
    }
  }, [pathname, isAdminPage]);

  if (isAdminPage) {
    return null;
  }

  return <>{children}</>;
}

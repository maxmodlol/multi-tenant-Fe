// hooks/public/useCurrentTenant.ts

import { useEffect, useState } from "react";
import { parseTenant } from "@/src/lib/tenant";

export function useCurrentTenant(): string {
  const [tenantId, setTenantId] = useState<string>("main");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark as client-side
    setIsClient(true);

    // Get tenant from hostname
    const hostname = window.location.hostname;
    const currentTenant = parseTenant(hostname);
    setTenantId(currentTenant);
  }, []);

  // Return "main" during SSR to prevent hydration mismatch
  if (!isClient) {
    return "main";
  }

  return tenantId;
}

import { Metadata } from "next";
import UnifiedAdsClient from "./UnifiedAdsClient";

export const metadata: Metadata = {
  title: "Unified Ads Management",
  description: "Manage all ads across your multi-tenant blog platform",
};

export default function UnifiedAdsPage() {
  return <UnifiedAdsClient />;
}



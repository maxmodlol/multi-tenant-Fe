// app/(dashboard)/dashboard/settings/tenant-ads/page.tsx

import { Metadata } from "next";
import TenantAdsClient from "./TenantAdsClient";

export const metadata: Metadata = {
  title: "إعدادات الإعلانات العامة",
  description: "إدارة الإعلانات العامة للموقع",
};

export default function TenantAdsPage() {
  return <TenantAdsClient />;
}




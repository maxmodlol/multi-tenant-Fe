"use client";

import React from "react";
import TenantAdInjector from "./TenantAdInjector";
import { TenantAdPlacement } from "@/src/types/tenantAds";

interface TenantAdDemoProps {
  tenantId?: string;
  pageType?: string;
}

export default function TenantAdDemo({ tenantId = "main", pageType = "home" }: TenantAdDemoProps) {
  return (
    <div className="space-y-6 p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">🧪 Tenant Ads Demo</h2>
        <p className="text-gray-600">
          Testing ads for tenant: {tenantId} on page: {pageType}
        </p>
      </div>

      {/* Header Ad */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold mb-2">📱 Header Ad</h3>
        <TenantAdInjector
          placement={TenantAdPlacement.HEADER}
          pageType={pageType as any}
          tenantId={tenantId}
          className="header-ad"
        />
      </div>

      {/* Sidebar Ad */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold mb-2">📋 Sidebar Ad</h3>
        <TenantAdInjector
          placement={TenantAdPlacement.SIDEBAR}
          pageType={pageType as any}
          tenantId={tenantId}
          className="sidebar-ad"
        />
      </div>

      {/* Footer Ad */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold mb-2">📱 Footer Ad</h3>
        <TenantAdInjector
          placement={TenantAdPlacement.FOOTER}
          pageType={pageType as any}
          tenantId={tenantId}
          className="footer-ad"
        />
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">🎯 How to Test:</h4>
        <ul className="text-blue-700 space-y-1 text-sm">
          <li>• Click buttons in ads to see interactions</li>
          <li>• Watch progress bars and animations</li>
          <li>• See notifications appear</li>
          <li>• Toggle hidden content</li>
          <li>• Change colors dynamically</li>
        </ul>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import TenantAdInjector from "./TenantAdInjector";
import { TenantAdPlacement } from "@/src/types/tenantAds";

export default function HomepageAdsDemo() {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">🧪 Homepage Ads Test</h2>
        <p className="text-gray-600">Testing tenant ads on the homepage</p>
      </div>

      {/* Header Ad */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold mb-2">📱 Header Ad</h3>
        <TenantAdInjector
          placement={TenantAdPlacement.HEADER}
          pageType="home"
          tenantId="main"
          className="header-ad"
        />
      </div>

      {/* Hero Ad */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold mb-2">🌟 Hero Ad</h3>
        <TenantAdInjector
          placement={TenantAdPlacement.HOME_HERO}
          pageType="home"
          tenantId="main"
          className="home-hero-ad"
        />
      </div>

      {/* Footer Ad */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold mb-2">📱 Footer Ad</h3>
        <TenantAdInjector
          placement={TenantAdPlacement.FOOTER}
          pageType="home"
          tenantId="main"
          className="footer-ad"
        />
      </div>

      {/* Debug Info */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-900 mb-2">🐛 Debug Info:</h4>
        <ul className="text-yellow-700 text-sm space-y-1">
          <li>• Make sure backend server is running</li>
          <li>• Check browser console for errors</li>
          <li>• Verify tenantId="main" exists in database</li>
          <li>• Check network tab for API calls</li>
        </ul>
      </div>
    </div>
  );
}




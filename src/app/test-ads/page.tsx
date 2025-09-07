"use client";

import React from "react";
import TenantAdInjector from "@/src/components/TenantAdInjector";
import { TenantAdPlacement } from "@/src/types/tenantAds";

export default function TestAdsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🧪 Tenant Ads Test Page</h1>
          <p className="text-lg text-gray-600">
            This page demonstrates how tenant ads work with different placements and interactions
          </p>
        </div>

        {/* Header Ad */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">📱 Header Ad</h2>
          <TenantAdInjector
            placement={TenantAdPlacement.HEADER}
            pageType="home"
            tenantId="main"
            className="header-ad"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">📋 Sidebar</h2>
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <h3 className="font-semibold mb-2">Navigation</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-blue-600 hover:underline">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:underline">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:underline">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:underline">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Sidebar Ad */}
            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">Sidebar Ad</h3>
              <TenantAdInjector
                placement={TenantAdPlacement.SIDEBAR}
                pageType="blog-list"
                tenantId="main"
                className="sidebar-ad"
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Hero Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Our Blog</h2>
              <p className="text-gray-600 mb-6">
                This is a test page to demonstrate how tenant ads work with different placements.
                You can see ads appearing in various locations with interactive features.
              </p>

              {/* Home Hero Ad */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">Hero Ad</h3>
                <TenantAdInjector
                  placement={TenantAdPlacement.HOME_HERO}
                  pageType="home"
                  tenantId="main"
                  className="home-hero-ad"
                />
              </div>
            </div>

            {/* Category Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Category: Technology</h2>

              {/* Category Top Ad */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">Category Top Ad</h3>
                <TenantAdInjector
                  placement={TenantAdPlacement.CATEGORY_TOP}
                  pageType="category"
                  tenantId="main"
                  className="category-top-ad"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Article 1</h3>
                  <p className="text-gray-600 text-sm">
                    This is a sample article about technology trends.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="text-2xl font-semibold mb-2">Article 2</h3>
                  <p className="text-gray-600 text-sm">
                    Another interesting article about AI and machine learning.
                  </p>
                </div>
              </div>
            </div>

            {/* Blog List Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Blog Posts</h2>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="font-semibold mb-2">Getting Started with React</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Learn the basics of React development...
                  </p>
                  <span className="text-xs text-gray-500">Published: 2 days ago</span>
                </div>
                <div className="border-b pb-4">
                  <h3 className="font-semibold mb-2">CSS Grid Layout Guide</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Master CSS Grid for modern layouts...
                  </p>
                  <span className="text-xs text-gray-500">Published: 1 week ago</span>
                </div>
                <div className="border-b pb-4">
                  <h3 className="font-semibold mb-2">TypeScript Best Practices</h3>
                  <p className="text-gray-600 text-sm mb-2">Write better TypeScript code...</p>
                  <span className="text-xs text-gray-500">Published: 2 weeks ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Ad */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">📱 Footer Ad</h2>
          <TenantAdInjector
            placement={TenantAdPlacement.FOOTER}
            pageType="home"
            tenantId="main"
            className="footer-ad"
          />
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-900 mb-4">🧪 How to Test the Ads</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Interactive Features:</h4>
              <ul className="text-blue-700 space-y-1 text-sm">
                <li>• Click buttons in ads to see interactions</li>
                <li>• Watch progress bars animate</li>
                <li>• See notifications appear</li>
                <li>• Toggle hidden content</li>
                <li>• Change colors dynamically</li>
              </ul>
            </div>
            <div>
              <h4 className="text-2xl font-semibold text-blue-800 mb-2">Ad Placements:</h4>
              <ul className="text-blue-700 space-y-1 text-sm">
                <li>• Header: Top of page</li>
                <li>• Sidebar: Right side navigation</li>
                <li>• Hero: Above main content</li>
                <li>• Category: Top of category section</li>
                <li>• Footer: Bottom of page</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { adManager } from "@/src/utils/adManager";
import { isDebugEnabled } from "@/src/config/adConfig";

interface AdStats {
  totalAds: number;
  loadedAds: number;
  failedAds: number;
  adSenseAds: number;
  gptAds: number;
  customAds: number;
}

export default function AdDebugger() {
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState<AdStats>({
    totalAds: 0,
    loadedAds: 0,
    failedAds: 0,
    adSenseAds: 0,
    gptAds: 0,
    customAds: 0,
  });

  // Only show in development or when debug is enabled
  if (!isDebugEnabled()) {
    return null;
  }

  // Update stats periodically
  useEffect(() => {
    const updateStats = () => {
      setStats(adManager.getStats());
    };

    updateStats();
    const interval = setInterval(updateStats, 2000);

    return () => clearInterval(interval);
  }, []);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const cleanupAllAds = () => {
    adManager.cleanup();
    setStats(adManager.getStats());
  };

  return (
    <>
      {/* Debug Toggle Button */}
      <button
        onClick={toggleVisibility}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium transition-colors"
        title="Ad Debugger"
      >
        🐛 Ads ({stats.totalAds})
      </button>

      {/* Debug Panel */}
      {isVisible && (
        <div className="fixed bottom-16 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-xl p-4 w-80 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Ad Debugger</h3>
            <button
              onClick={toggleVisibility}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>

          {/* Stats */}
          <div className="space-y-2 mb-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-green-50 p-2 rounded">
                <div className="font-medium text-green-800">Loaded</div>
                <div className="text-green-600">{stats.loadedAds}</div>
              </div>
              <div className="bg-red-50 p-2 rounded">
                <div className="font-medium text-red-800">Failed</div>
                <div className="text-red-600">{stats.failedAds}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-blue-50 p-2 rounded">
                <div className="font-medium text-blue-800">AdSense</div>
                <div className="text-blue-600">{stats.adSenseAds}</div>
              </div>
              <div className="bg-purple-50 p-2 rounded">
                <div className="font-medium text-purple-800">GPT</div>
                <div className="text-purple-600">{stats.gptAds}</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="font-medium text-gray-800">Custom</div>
                <div className="text-gray-600">{stats.customAds}</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button
              onClick={cleanupAllAds}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm transition-colors"
            >
              Cleanup All Ads
            </button>

            <div className="text-xs text-gray-500">
              <div>Total: {stats.totalAds} ads</div>
              <div>
                Success Rate:{" "}
                {stats.totalAds > 0 ? Math.round((stats.loadedAds / stats.totalAds) * 100) : 0}%
              </div>
            </div>
          </div>

          {/* Console Helpers */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-600 mb-2">Console Helpers:</div>
            <div className="text-xs font-mono bg-gray-100 p-2 rounded">
              <div>window.adManager.getStats()</div>
              <div>window.adManager.cleanup()</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

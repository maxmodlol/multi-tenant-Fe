/**
 * Comprehensive Ad Management Utility
 * Handles Google Analytics, AdSense, and Google Ad Manager integration
 * with proper conflict prevention and timing controls
 */

import { adConfig, isDebugEnabled } from "../config/adConfig";

// Global type declarations
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    adsbygoogle: any[];
    googletag: any;
  }
}

interface AdSlot {
  id: string;
  element: HTMLElement;
  isLoaded: boolean;
  adType: "adsense" | "gpt" | "custom";
}

interface AdManagerConfig {
  googleAnalyticsId?: string;
  adSenseClientId?: string;
  enableDebug?: boolean;
}

class AdManager {
  private static instance: AdManager;
  private config: AdManagerConfig;
  private loadedSlots: Map<string, AdSlot> = new Map();
  private adSensePushes: Set<string> = new Set();
  private gptSlots: Map<string, any> = new Map();
  private isInitialized = false;

  private constructor(config: AdManagerConfig = {}) {
    this.config = {
      googleAnalyticsId: adConfig.googleAnalytics.measurementId,
      adSenseClientId: adConfig.googleAdSense.clientId,
      enableDebug: isDebugEnabled(),
      ...config,
    };
  }

  public static getInstance(config?: AdManagerConfig): AdManager {
    if (!AdManager.instance) {
      AdManager.instance = new AdManager(config);
    }
    return AdManager.instance;
  }

  /**
   * Initialize the ad manager
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    this.log("🚀 Initializing Ad Manager...");

    // Wait for all libraries to be available
    await this.waitForLibraries();

    // Initialize Google Analytics
    this.initializeGoogleAnalytics();

    // Initialize Google Ad Manager
    this.initializeGoogleAdManager();

    this.isInitialized = true;
    this.log("✅ Ad Manager initialized successfully");
  }

  /**
   * Wait for all required libraries to be available
   */
  private async waitForLibraries(): Promise<void> {
    const maxWaitTime = 10000; // 10 seconds
    const checkInterval = 100; // 100ms
    let elapsed = 0;

    while (elapsed < maxWaitTime) {
      const gtagReady = typeof window.gtag !== "undefined";
      const adsenseReady = typeof window.adsbygoogle !== "undefined";
      const gptReady = typeof window.googletag !== "undefined";

      if (gtagReady && adsenseReady && gptReady) {
        this.log("📚 All ad libraries loaded");
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, checkInterval));
      elapsed += checkInterval;
    }

    this.log("⚠️ Some ad libraries failed to load within timeout");
  }

  /**
   * Wait for GPT to be fully ready with pubads service
   */
  private async waitForGPTReady(): Promise<void> {
    const maxWaitTime = 5000; // 5 seconds
    const checkInterval = 100; // 100ms
    let elapsed = 0;

    while (elapsed < maxWaitTime) {
      try {
        if (
          window.googletag &&
          window.googletag.pubads &&
          typeof window.googletag.pubads === "function"
        ) {
          const pubads = window.googletag.pubads();
          if (pubads && typeof pubads.enableSingleRequest === "function") {
            this.log("📚 GPT pubads service ready");
            return;
          }
        }
      } catch (error) {
        // Continue waiting if pubads is not ready
      }

      await new Promise((resolve) => setTimeout(resolve, checkInterval));
      elapsed += checkInterval;
    }

    this.log("⚠️ GPT pubads service not ready within timeout");
  }

  /**
   * Wait for AdSense to be fully ready
   */
  private async waitForAdSenseReady(): Promise<void> {
    const maxWaitTime = 3000; // 3 seconds
    const checkInterval = 100; // 100ms
    let elapsed = 0;

    while (elapsed < maxWaitTime) {
      try {
        if (
          window.adsbygoogle &&
          Array.isArray(window.adsbygoogle) &&
          typeof window.adsbygoogle.push === "function"
        ) {
          this.log("📚 AdSense service ready");
          return;
        }
      } catch (error) {
        // Continue waiting if AdSense is not ready
      }

      await new Promise((resolve) => setTimeout(resolve, checkInterval));
      elapsed += checkInterval;
    }

    this.log("⚠️ AdSense service not ready within timeout");
  }

  /**
   * Initialize Google Analytics
   */
  private initializeGoogleAnalytics(): void {
    if (typeof window.gtag === "undefined") {
      this.log("❌ Google Analytics not available");
      return;
    }

    try {
      // Configure Google Analytics
      window.gtag("config", this.config.googleAnalyticsId, {
        page_title: document.title,
        page_location: window.location.href,
        custom_map: {
          custom_parameter_1: "ad_placement",
          custom_parameter_2: "ad_type",
        },
      });

      this.log("✅ Google Analytics initialized");
    } catch (error) {
      this.log("❌ Google Analytics initialization failed:", error);
    }
  }

  /**
   * Initialize Google Ad Manager
   */
  private initializeGoogleAdManager(): void {
    if (typeof window.googletag === "undefined") {
      this.log("❌ Google Ad Manager not available");
      return;
    }

    try {
      window.googletag.cmd.push(() => {
        // Configure GPT settings
        window.googletag.pubads().enableSingleRequest();
        window.googletag.pubads().collapseEmptyDivs();
        window.googletag.pubads().enableLazyLoad({
          fetchMarginPercent: 500,
          renderMarginPercent: 200,
          mobileScaling: 2.0,
        });
        window.googletag.enableServices();

        this.log("✅ Google Ad Manager initialized");
      });
    } catch (error) {
      this.log("❌ Google Ad Manager initialization failed:", error);
    }
  }

  /**
   * Handle AdSense ad with proper conflict prevention and fallback
   */
  public async handleAdSenseAd(
    adId: string,
    container: HTMLElement,
    adCode: string,
  ): Promise<void> {
    if (this.loadedSlots.has(adId)) {
      this.log(`⚠️ AdSense ad ${adId} already loaded, skipping`);
      return;
    }

    // Check if adsbygoogle is available
    if (typeof window.adsbygoogle === "undefined") {
      this.log(`❌ AdSense not available for ad ${adId}`);
      this.showAdFallback(container, adId, "AdSense not available");
      return;
    }

    // Wait for AdSense to be fully ready
    await this.waitForAdSenseReady();

    try {
      // Inject the ad code
      container.innerHTML = adCode;

      // Find all AdSense ins elements in this container
      const insElements = container.querySelectorAll("ins.adsbygoogle");

      if (insElements.length === 0) {
        this.log(`⚠️ No AdSense ins elements found in ad ${adId}`);
        this.showAdFallback(container, adId, "No AdSense elements found");
        return;
      }

      // Check if any ins elements need to be pushed
      let needsPush = false;
      insElements.forEach((ins: any) => {
        if (!ins.dataset.adsbygoogleStatus) {
          needsPush = true;
        }
      });

      if (needsPush) {
        // Create a unique push identifier
        const pushId = `${adId}-${Date.now()}`;

        if (!this.adSensePushes.has(pushId)) {
          this.adSensePushes.add(pushId);

          // Push the ad
          (window.adsbygoogle = window.adsbygoogle || []).push({});

          this.log(`✅ AdSense ad ${adId} pushed successfully`);

          // Set up monitoring for ad loading
          this.monitorAdLoading(container, adId, "adsense");

          // Track the ad
          this.loadedSlots.set(adId, {
            id: adId,
            element: container,
            isLoaded: true,
            adType: "adsense",
          });

          // Track in Google Analytics
          this.trackAdEvent("adsense_load", adId, "success");
        } else {
          this.log(`⚠️ AdSense push ${pushId} already executed`);
        }
      } else {
        this.log(`ℹ️ AdSense ad ${adId} already has ads loaded`);
      }
    } catch (error) {
      this.log(`❌ AdSense ad ${adId} failed:`, error);
      this.showAdFallback(container, adId, "AdSense loading failed");
      this.trackAdEvent("adsense_load", adId, "error");
    }
  }

  /**
   * Handle Google Ad Manager (GPT) ad with slot conflict prevention
   */
  public async handleGPTAd(adId: string, container: HTMLElement, adCode: string): Promise<void> {
    if (this.loadedSlots.has(adId)) {
      this.log(`⚠️ GPT ad ${adId} already loaded, skipping`);
      return;
    }

    // Check if googletag is available
    if (typeof window.googletag === "undefined") {
      this.log(`❌ Google Ad Manager not available for ad ${adId}`);
      return;
    }

    // Wait for GPT to be fully initialized
    await this.waitForGPTReady();

    // Process GPT ad normally - no conflict detection needed since production setup doesn't define slots

    try {
      // Inject the ad code
      container.innerHTML = adCode;

      // Find all GPT div elements in this container
      const gptDivs = container.querySelectorAll('[id*="div-gpt-ad-"]');

      if (gptDivs.length === 0) {
        this.log(`⚠️ No GPT div elements found in ad ${adId}`);
        return;
      }

      // Process each GPT div
      gptDivs.forEach((div: any) => {
        const slotId = div.id;

        // Check if slot already exists
        if (this.gptSlots.has(slotId)) {
          this.log(`⚠️ GPT slot ${slotId} already exists, skipping`);
          return;
        }

        // Execute GPT commands
        window.googletag.cmd.push(() => {
          try {
            // Check if slot is already defined
            const existingSlots = window.googletag.pubads().getSlots();
            const slotExists = existingSlots.some(
              (slot: any) => slot.getSlotElementId() === slotId,
            );

            if (slotExists) {
              this.log(`⚠️ GPT slot ${slotId} already defined, skipping`);
              return;
            }

            // Execute the GPT script content with proper error handling
            const scripts = div.querySelectorAll("script");
            scripts.forEach((script: HTMLScriptElement) => {
              if (script.textContent) {
                try {
                  // Wrap the script execution in a try-catch to handle pubads errors
                  const wrappedScript = `
                    try {
                      ${script.textContent}
                    } catch (error) {
                      console.warn('GPT script execution failed:', error);
                    }
                  `;
                  const func = new Function(wrappedScript);
                  func();
                } catch (error) {
                  this.log(`❌ Failed to execute GPT script for slot ${slotId}:`, error);
                }
              }
            });

            // Track the slot
            this.gptSlots.set(slotId, {
              id: slotId,
              element: div,
              adId: adId,
            });

            this.log(`✅ GPT slot ${slotId} processed successfully`);
          } catch (error) {
            this.log(`❌ GPT slot ${slotId} failed:`, error);
          }
        });
      });

      // Track the ad
      this.loadedSlots.set(adId, {
        id: adId,
        element: container,
        isLoaded: true,
        adType: "gpt",
      });

      // Set up monitoring for ad loading
      this.monitorAdLoading(container, adId, "gpt");

      // Track in Google Analytics
      this.trackAdEvent("gpt_load", adId, "success");
    } catch (error) {
      this.log(`❌ GPT ad ${adId} failed:`, error);
      this.showAdFallback(container, adId, "GPT loading failed");
      this.trackAdEvent("gpt_load", adId, "error");
    }
  }

  /**
   * Monitor ad loading and show fallback if no content appears
   */
  private monitorAdLoading(container: HTMLElement, adId: string, adType: string): void {
    const checkInterval = 1000; // Check every 1 second
    const maxChecks = 10; // Check for 10 seconds
    let checkCount = 0;

    const checkForContent = () => {
      checkCount++;

      // Check if ad has actual content (not just empty space)
      const hasContent = this.hasAdContent(container);

      if (hasContent) {
        this.log(`✅ Ad ${adId} loaded successfully with content`);
        return;
      }

      if (checkCount >= maxChecks) {
        this.log(`⚠️ Ad ${adId} failed to load content after ${maxChecks} seconds`);
        this.showAdFallback(container, adId, `No content loaded after ${maxChecks}s`);
        return;
      }

      // Continue monitoring
      setTimeout(checkForContent, checkInterval);
    };

    // Start monitoring after a short delay
    setTimeout(checkForContent, checkInterval);
  }

  /**
   * Check if ad container has actual content
   */
  private hasAdContent(container: HTMLElement): boolean {
    // Check for various ad content indicators
    const hasIframe = container.querySelector("iframe");
    const hasImg = container.querySelector("img");
    const hasAdContent = container.querySelector('[class*="ad"], [id*="ad"]');
    const hasVisibleContent = container.offsetHeight > 50; // At least 50px height

    // Check for AdSense specific content
    const adsenseContent = container.querySelector(
      'ins.adsbygoogle[data-adsbygoogle-status="done"]',
    );

    // Check for GPT specific content
    const gptContent = container.querySelector(
      '[id^="div-gpt-ad-"] iframe, [id^="div-gpt-ad-"] img',
    );

    return !!(
      hasIframe ||
      hasImg ||
      hasAdContent ||
      hasVisibleContent ||
      adsenseContent ||
      gptContent
    );
  }

  /**
   * Show fallback content when ad fails to load
   */
  private showAdFallback(container: HTMLElement, adId: string, reason: string): void {
    // Don't show fallback if debug is disabled
    if (!isDebugEnabled()) {
      container.style.display = "none";
      return;
    }

    // Show debug fallback
    container.innerHTML = `
      <div style="
        padding: 20px;
        background: #f8f9fa;
        border: 2px dashed #dee2e6;
        text-align: center;
        color: #6c757d;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        border-radius: 8px;
        min-height: 100px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      ">
        <div style="margin-bottom: 8px;">
          <strong>Ad Space</strong>
        </div>
        <div style="font-size: 12px; opacity: 0.8;">
          ID: ${adId}
        </div>
        <div style="font-size: 12px; opacity: 0.8; margin-top: 4px;">
          Reason: ${reason}
        </div>
        <div style="font-size: 11px; opacity: 0.6; margin-top: 8px;">
          (Debug mode - hidden in production)
        </div>
      </div>
    `;

    this.log(`🔄 Showing fallback for ad ${adId}: ${reason}`);
  }

  /**
   * Handle GPT display-only ads (ads that only call googletag.display)
   */
  public async handleGPTDisplayAd(
    adId: string,
    container: HTMLElement,
    adCode: string,
  ): Promise<void> {
    if (this.loadedSlots.has(adId)) {
      this.log(`⚠️ GPT display ad ${adId} already loaded, skipping`);
      return;
    }

    // Wait for GPT to be ready
    await this.waitForGPTReady();

    try {
      // Inject the ad code
      container.innerHTML = adCode;

      // Find the GPT div in the injected content
      const gptDiv = container.querySelector('[id^="div-gpt-ad-"]') as HTMLElement;
      if (!gptDiv) {
        this.log(`⚠️ No GPT div found in display ad ${adId}`);
        return;
      }

      const slotId = gptDiv.id;
      this.log(`🎯 Processing GPT display ad ${adId} for slot: ${slotId}`);

      // Wait for the slot to be defined (it should be defined by global header)
      let retryCount = 0;
      const maxRetries = 10;
      const retryDelay = 500; // 500ms

      const tryDisplay = () => {
        try {
          const existingSlots = window.googletag.pubads().getSlots();
          const slotExists = existingSlots.some((slot: any) => slot.getSlotElementId() === slotId);

          if (slotExists) {
            this.log(`✅ GPT slot ${slotId} is defined, displaying...`);
            window.googletag.display(slotId);

            // Track the ad
            this.loadedSlots.set(adId, {
              id: adId,
              element: container,
              isLoaded: true,
              adType: "gpt",
            });

            this.log(`✅ GPT display ad ${adId} loaded successfully`);

            // Set up monitoring for ad loading
            this.monitorAdLoading(container, adId, "gpt_display");
          } else if (retryCount < maxRetries) {
            retryCount++;
            this.log(`⏳ GPT slot ${slotId} not defined yet, retry ${retryCount}/${maxRetries}...`);
            setTimeout(tryDisplay, retryDelay);
          } else {
            this.log(`❌ GPT slot ${slotId} not defined after ${maxRetries} retries`);
            this.showAdFallback(container, adId, "GPT slot not defined");
          }
        } catch (error) {
          this.log(`❌ GPT display error for ad ${adId}:`, error);
        }
      };

      // Start the display process
      tryDisplay();
    } catch (error) {
      this.log(`❌ GPT display ad ${adId} failed:`, error);
    }
  }

  /**
   * Handle production GPT ads (for existing production setup)
   */
  public async handleProductionGPTAd(
    adId: string,
    container: HTMLElement,
    elementId: string,
  ): Promise<void> {
    if (this.loadedSlots.has(adId)) {
      this.log(`⚠️ Production GPT ad ${adId} already loaded, skipping`);
      return;
    }

    // Check if googletag is available
    if (typeof window.googletag === "undefined") {
      this.log(`❌ Google Ad Manager not available for production ad ${adId}`);
      return;
    }

    // Wait for GPT to be fully ready
    await this.waitForGPTReady();

    try {
      // Create the div element
      const div = document.createElement("div");
      div.id = elementId;
      div.style.minWidth = "300px";
      div.style.minHeight = "250px";
      container.appendChild(div);

      // Execute GPT display command
      window.googletag.cmd.push(() => {
        try {
          // Just display the ad - slot should already be defined in production setup
          window.googletag.display(elementId);

          this.log(`✅ Production GPT ad ${adId} (${elementId}) displayed successfully`);
        } catch (error) {
          this.log(`❌ Production GPT ad ${adId} (${elementId}) failed:`, error);
        }
      });

      // Track the ad
      this.loadedSlots.set(adId, {
        id: adId,
        element: container,
        isLoaded: true,
        adType: "gpt",
      });

      // Track in Google Analytics
      this.trackAdEvent("gpt_load", adId, "success");
    } catch (error) {
      this.log(`❌ Production GPT ad ${adId} failed:`, error);
      this.trackAdEvent("gpt_load", adId, "error");
    }
  }

  /**
   * Handle custom ad with proper isolation
   */
  public async handleCustomAd(adId: string, container: HTMLElement, adCode: string): Promise<void> {
    if (this.loadedSlots.has(adId)) {
      this.log(`⚠️ Custom ad ${adId} already loaded, skipping`);
      return;
    }

    try {
      // Inject the ad code
      container.innerHTML = adCode;

      // Execute any scripts in isolation
      const scripts = container.querySelectorAll("script");
      scripts.forEach((script, index) => {
        if (script.textContent) {
          try {
            // Wrap in IIFE to prevent variable conflicts
            const wrappedScript = `
              (function() {
                try {
                  ${script.textContent}
                } catch (error) {
                  console.warn('Custom ad script error:', error);
                }
              })();
            `;

            const newScript = document.createElement("script");
            newScript.textContent = wrappedScript;
            newScript.setAttribute("data-ad-id", adId);
            newScript.setAttribute("data-script-index", index.toString());

            document.head.appendChild(newScript);
          } catch (error) {
            this.log(`❌ Custom ad script ${index} failed:`, error);
          }
        }
      });

      // Track the ad
      this.loadedSlots.set(adId, {
        id: adId,
        element: container,
        isLoaded: true,
        adType: "custom",
      });

      this.log(`✅ Custom ad ${adId} processed successfully`);
      this.trackAdEvent("custom_load", adId, "success");
    } catch (error) {
      this.log(`❌ Custom ad ${adId} failed:`, error);
      this.trackAdEvent("custom_load", adId, "error");
    }
  }

  /**
   * Track ad events in Google Analytics
   */
  private trackAdEvent(eventName: string, adId: string, status: string): void {
    if (typeof window.gtag === "undefined") return;

    try {
      window.gtag("event", eventName, {
        event_category: "ad_management",
        event_label: adId,
        custom_parameter_1: adId,
        custom_parameter_2: status,
        value: status === "success" ? 1 : 0,
      });
    } catch (error) {
      this.log("❌ Google Analytics tracking failed:", error);
    }
  }

  /**
   * Get ad loading statistics
   */
  public getStats(): {
    totalAds: number;
    loadedAds: number;
    failedAds: number;
    adSenseAds: number;
    gptAds: number;
    customAds: number;
  } {
    const ads = Array.from(this.loadedSlots.values());
    const loadedAds = ads.filter((ad) => ad.isLoaded);
    const failedAds = ads.filter((ad) => !ad.isLoaded);

    return {
      totalAds: ads.length,
      loadedAds: loadedAds.length,
      failedAds: failedAds.length,
      adSenseAds: ads.filter((ad) => ad.adType === "adsense").length,
      gptAds: ads.filter((ad) => ad.adType === "gpt").length,
      customAds: ads.filter((ad) => ad.adType === "custom").length,
    };
  }

  /**
   * Clean up ads for a specific placement or all ads
   */
  public cleanup(adId?: string): void {
    if (adId) {
      // Clean up specific ad
      const ad = this.loadedSlots.get(adId);
      if (ad) {
        // Remove scripts
        const scripts = document.head.querySelectorAll(`script[data-ad-id="${adId}"]`);
        scripts.forEach((script) => script.remove());

        // Clear container
        ad.element.innerHTML = "";

        // Remove from tracking
        this.loadedSlots.delete(adId);

        this.log(`🧹 Cleaned up ad ${adId}`);
      }
    } else {
      // Clean up all ads
      this.loadedSlots.forEach((ad, id) => {
        const scripts = document.head.querySelectorAll(`script[data-ad-id="${id}"]`);
        scripts.forEach((script) => script.remove());
        ad.element.innerHTML = "";
      });

      this.loadedSlots.clear();
      this.adSensePushes.clear();
      this.gptSlots.clear();

      this.log("🧹 Cleaned up all ads");
    }
  }

  /**
   * Debug logging
   */

  private log(...args: any[]): void {
    if (this.config.enableDebug) {
      console.log("[AdManager]", ...args);
    }
  }
}

// Export singleton instance
export const adManager = AdManager.getInstance();

// Make AdManager available globally for debugging
if (typeof window !== "undefined") {
  (window as any).adManager = adManager;
}

// Export types
export type { AdManagerConfig, AdSlot };

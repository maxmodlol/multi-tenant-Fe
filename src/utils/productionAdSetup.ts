/**
 * Production Ad Setup
 * Handles the existing production ad configuration to ensure backward compatibility
 */

// Your production slot definitions
const PRODUCTION_SLOTS = [
  {
    path: "/23282436620/lsektor.comStickyAds",
    sizes: [300, 250],
    elementId: "div-gpt-ad-1756916838274-0",
  },
  {
    path: "/23282436620/AboveArticleAd",
    sizes: [
      [300, 250],
      [320, 50],
      [336, 280],
      [320, 100],
    ],
    elementId: "div-gpt-ad-1756916923084-0",
  },
  {
    path: "/23282436620/BelowArticleTitleAd",
    sizes: [
      [320, 100],
      [300, 250],
      [336, 280],
      [320, 50],
    ],
    elementId: "div-gpt-ad-1756917063845-0",
  },
  {
    path: "/23282436620/ArticleInlineAd1",
    sizes: [
      [320, 100],
      [336, 280],
      [300, 250],
      [320, 50],
    ],
    elementId: "div-gpt-ad-1756917167350-0",
  },
  {
    path: "/23282436620/ArticleInlineAd2",
    sizes: [
      [300, 250],
      [320, 100],
      [336, 280],
      [320, 50],
    ],
    elementId: "div-gpt-ad-1756917211452-0",
  },
  {
    path: "/23282436620/ArticleInlineAd3",
    sizes: [
      [300, 250],
      [320, 50],
      [336, 280],
      [320, 100],
    ],
    elementId: "div-gpt-ad-1756917425896-0",
  },
  {
    path: "/23282436620/ArticleInlineAd4",
    sizes: [
      [320, 50],
      [320, 100],
      [300, 250],
      [336, 280],
    ],
    elementId: "div-gpt-ad-1756917451647-0",
  },
  {
    path: "/23282436620/ArticleInlineAd5",
    sizes: [
      [300, 250],
      [336, 280],
      [320, 50],
      [320, 100],
    ],
    elementId: "div-gpt-ad-1756917481824-0",
  },
  {
    path: "/23282436620/BelowArticleAd",
    sizes: [
      [300, 250],
      [320, 100],
      [336, 280],
      [320, 50],
    ],
    elementId: "div-gpt-ad-1756917285961-0",
  },
  {
    path: "/23282436620/BelowCommentsAd",
    sizes: [
      [320, 100],
      [300, 250],
      [320, 50],
      [336, 280],
    ],
    elementId: "div-gpt-ad-1756917330438-0",
  },
];

/**
 * Initialize production Google Analytics
 */
export function initializeProductionGoogleAnalytics(): void {
  if (typeof window === "undefined") return;

  // Only initialize if not already done
  if (window.dataLayer && typeof window.gtag === "function") return;

  try {
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer!.push(args);
    }
    gtag("js", new Date());
    gtag("config", "G-QX3HEDWQ05");

    // Make gtag globally available
    window.gtag = gtag;

    console.log("✅ Production Google Analytics initialized");
  } catch (error) {
    console.error("❌ Production Google Analytics initialization failed:", error);
  }
}

/**
 * Initialize production Google Ad Manager with your existing slots
 */
export function initializeProductionGoogleAdManager(): void {
  if (typeof window === "undefined") return;

  // Only initialize if not already done
  if (window.googletag && typeof window.googletag.pubads === "function") return;

  try {
    window.googletag = window.googletag || { cmd: [] };

    window.googletag.cmd.push(function () {
      // Define all your production slots
      PRODUCTION_SLOTS.forEach((slot) => {
        try {
          window.googletag
            .defineSlot(slot.path, slot.sizes, slot.elementId)
            .addService(window.googletag.pubads());
        } catch (error) {
          console.warn(`⚠️ Failed to define slot ${slot.elementId}:`, error);
        }
      });

      // Enable services
      window.googletag.pubads().enableSingleRequest();
      window.googletag.enableServices();

      console.log(
        "✅ Production Google Ad Manager initialized with",
        PRODUCTION_SLOTS.length,
        "slots",
      );
    });
  } catch (error) {
    console.error("❌ Production Google Ad Manager initialization failed:", error);
  }
}

/**
 * Initialize production rewarded ads
 */
export function initializeProductionRewardedAds(): void {
  if (typeof window === "undefined") return;

  try {
    // Only initialize if googletag is available
    if (!window.googletag) {
      console.warn("⚠️ googletag not available for rewarded ads");
      return;
    }

    function loadRewardedAd() {
      window.googletag.cmd.push(() => {
        // Remove previous ads if they exist
        if ((window as any).rewardedSlot) {
          window.googletag.destroySlots([(window as any).rewardedSlot]);
        }

        // Define new ad
        (window as any).rewardedSlot = window.googletag
          .defineOutOfPageSlot(
            "/23282436620/lsektor.comRewardAds",
            window.googletag.enums.OutOfPageFormat.REWARDED,
          )
          .addService(window.googletag.pubads());

        window.googletag.enableServices();

        window.googletag.pubads().addEventListener("rewardedSlotReady", function (evt: any) {
          evt.makeRewardedVisible();
        });

        // Event handlers
        window.googletag.pubads().addEventListener("rewardedSlotGranted", function (evt: any) {
          console.log("Reward granted");
        });

        window.googletag.pubads().addEventListener("rewardedSlotClosed", function (evt: any) {
          console.log("Ad closed");
        });

        window.googletag.display((window as any).rewardedSlot);
      });
    }

    // Initial load
    loadRewardedAd();

    // Repeat every 60 seconds
    setInterval(loadRewardedAd, 60000);

    console.log("✅ Production rewarded ads initialized");
  } catch (error) {
    console.error("❌ Production rewarded ads initialization failed:", error);
  }
}

/**
 * Initialize all production ad systems
 */
export function initializeProductionAds(): void {
  if (typeof window === "undefined") return;

  console.log("🚀 Initializing production ad systems...");

  // Initialize Google Analytics
  initializeProductionGoogleAnalytics();

  // Initialize Google Ad Manager
  initializeProductionGoogleAdManager();

  // Initialize rewarded ads
  initializeProductionRewardedAds();

  console.log("✅ All production ad systems initialized");
}

/**
 * Check if we should use production setup (when no environment variables are set)
 */
export function shouldUseProductionSetup(): boolean {
  return (
    !process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID &&
    !process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID &&
    !process.env.NEXT_PUBLIC_GPT_ENABLED
  );
}

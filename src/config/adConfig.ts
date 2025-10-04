/**
 * Ad Configuration
 * Centralized configuration for all ad-related settings
 */

export interface AdConfig {
  googleAnalytics: {
    measurementId: string;
    enabled: boolean;
  };
  googleAdSense: {
    clientId: string;
    enabled: boolean;
  };
  googleAdManager: {
    enabled: boolean;
    networkCode?: string;
  };
  debug: {
    enabled: boolean;
    logLevel: "error" | "warn" | "info" | "debug";
  };
}

// Default configuration - Backward compatible with existing production setup
const defaultConfig: AdConfig = {
  googleAnalytics: {
    measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-QX3HEDWQ05", // Your production ID as fallback
    enabled: process.env.NEXT_PUBLIC_GA_ENABLED !== "false", // Default to enabled
  },
  googleAdSense: {
    clientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-5603341970726415",
    enabled: process.env.NEXT_PUBLIC_ADSENSE_ENABLED !== "false", // Default to enabled
  },
  googleAdManager: {
    enabled: process.env.NEXT_PUBLIC_GPT_ENABLED !== "false", // Default to enabled
    networkCode: process.env.NEXT_PUBLIC_GPT_NETWORK_CODE || "23282436620", // Your production network code
  },
  debug: {
    enabled: process.env.NODE_ENV === "development",
    logLevel: process.env.NODE_ENV === "development" ? "debug" : "error",
  },
};

// Export the configuration
export const adConfig = defaultConfig;

// Helper functions
export const isGoogleAnalyticsEnabled = (): boolean => {
  return (
    adConfig.googleAnalytics.enabled &&
    adConfig.googleAnalytics.measurementId !== "GA_MEASUREMENT_ID" &&
    adConfig.googleAnalytics.measurementId.startsWith("G-")
  );
};

export const isGoogleAdSenseEnabled = (): boolean => {
  return adConfig.googleAdSense.enabled && adConfig.googleAdSense.clientId !== "";
};

export const isGoogleAdManagerEnabled = (): boolean => {
  return adConfig.googleAdManager.enabled;
};

export const isDebugEnabled = (): boolean => {
  return adConfig.debug.enabled;
};

// Environment variable documentation
export const ENV_VARS = {
  NEXT_PUBLIC_GA_MEASUREMENT_ID: "Google Analytics Measurement ID (e.g., G-XXXXXXXXXX)",
  NEXT_PUBLIC_GA_ENABLED: "Enable Google Analytics (true/false)",
  NEXT_PUBLIC_ADSENSE_CLIENT_ID: "Google AdSense Client ID (e.g., ca-pub-XXXXXXXXXX)",
  NEXT_PUBLIC_ADSENSE_ENABLED: "Enable Google AdSense (true/false)",
  NEXT_PUBLIC_GPT_ENABLED: "Enable Google Ad Manager (true/false)",
  NEXT_PUBLIC_GPT_NETWORK_CODE: "Google Ad Manager Network Code",
} as const;

// Facebook configuration
export const FACEBOOK_CONFIG = {
  // Replace with your actual Facebook App ID
  APP_ID: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "YOUR_FACEBOOK_APP_ID",
  VERSION: "v18.0",
  LOCALE: "ar_AR",
};

// Facebook SDK initialization
export const initializeFacebookSDK = () => {
  if (typeof window !== "undefined" && window.FB) {
    window.FB.init({
      appId: FACEBOOK_CONFIG.APP_ID,
      cookie: true,
      xfbml: true,
      version: FACEBOOK_CONFIG.VERSION,
    });
  }
};

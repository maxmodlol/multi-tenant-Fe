// app/layout.tsx  (root)
import "./globals.css";
import Providers from "@explore/components/Providers";
import { Geist, Geist_Mono } from "next/font/google";
import { fetchSiteSetting } from "@explore/services/settingService";
import Script from "next/script";
import { detectTenantServerOnly } from "../lib/tenantFromServer";
import type { Metadata } from "next";
import TenantStyleInjector from "@/src/components/TenantStyleInjector";
import { validateFaviconUrl } from "../lib/utils";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Force dynamic rendering to avoid static generation issues
export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  /* build tenant CSS vars with consistent fallbacks */
  let cssVars = "";
  let tenantId = "";
  let siteIconUrl = "";

  try {
    const tenant = await detectTenantServerOnly();
    tenantId = tenant || "default";
    const s = await fetchSiteSetting(tenant);

    // Validate favicon URL before using it
    siteIconUrl = (await validateFaviconUrl(s.siteIconUrl)) || "";

    // Ensure consistent ordering of brand scale variables
    if (s.brandScale && typeof s.brandScale === "object") {
      const sortedEntries = Object.entries(s.brandScale).sort(([a], [b]) => {
        // Sort numerically to ensure consistent order
        const aNum = parseInt(a);
        const bNum = parseInt(b);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return aNum - bNum;
        }
        return a.localeCompare(b);
      });

      for (const [lvl, hsl] of sortedEntries) {
        if (hsl && typeof hsl === "string") {
          cssVars += `--brand-${lvl}: ${hsl}; `;
        }
      }
    }
  } catch (error) {
    // Ensure consistent fallback even on error
    console.warn("Failed to fetch tenant settings:", error);
    tenantId = "default";
  }

  // Always ensure we have a consistent structure, even if empty
  if (!cssVars.trim()) {
    cssVars = ""; // Empty string for consistent rendering
  }

  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable}`}
      data-tenant={tenantId}
      data-has-favicon={siteIconUrl ? "true" : "false"}
      suppressHydrationWarning
    >
      <head>
        {/* Prevent mobile zoom */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        {/* Dynamic favicon injection */}
        {siteIconUrl && (
          <>
            <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
            <meta httpEquiv="Pragma" content="no-cache" />
            <meta httpEquiv="Expires" content="0" />
            <link rel="icon" href={siteIconUrl} type="image/x-icon" />
            <link rel="shortcut icon" href={siteIconUrl} type="image/x-icon" />
            <link rel="apple-touch-icon" sizes="180x180" href={siteIconUrl} />
            <link rel="icon" type="image/png" sizes="32x32" href={siteIconUrl} />
            <link rel="icon" type="image/png" sizes="16x16" href={siteIconUrl} />
            <link rel="manifest" href="/manifest.json" />
            <meta name="msapplication-TileImage" content={siteIconUrl} />
            <meta name="msapplication-TileColor" content="#000000" />
            {/* Handle different image formats with proper MIME types */}
            {siteIconUrl.endsWith(".ico") ? (
              <link rel="icon" type="image/x-icon" href={siteIconUrl} />
            ) : siteIconUrl.endsWith(".png") ? (
              <link rel="icon" type="image/png" href={siteIconUrl} />
            ) : siteIconUrl.endsWith(".jpg") || siteIconUrl.endsWith(".jpeg") ? (
              <link rel="icon" type="image/jpeg" href={siteIconUrl} />
            ) : siteIconUrl.endsWith(".svg") ? (
              <link rel="icon" type="image/svg+xml" href={siteIconUrl} />
            ) : (
              <link rel="icon" href={siteIconUrl} />
            )}
          </>
        )}

        {/* Fallback favicon - only when no tenant favicon */}
        {!siteIconUrl && (
          <>
            <link rel="icon" href="/logo.svg" />
            <link rel="shortcut icon" href="/logo.svg" />
          </>
        )}

        {/* dark / light bootstrap */}
        <Script id="dark-picker" strategy="beforeInteractive">
          {`
            try {
              const t = localStorage.getItem('theme');
              document.documentElement.classList[t === 'dark' ? 'add' : 'remove']('dark');
            } catch {}
          `}
        </Script>

        {/* Force favicon refresh */}
        {siteIconUrl && (
          <Script id="favicon-refresh" strategy="afterInteractive">
            {`
              (function() {
                try {
                  // Favicon refresh script running
                  
                  // Test if the image can be loaded with proper error handling
                  const testImg = new Image();
                  // Remove crossOrigin to avoid CORS issues with S3
                  
                  testImg.onload = function() {
                    // Favicon image loaded successfully
                  };
                  
                  testImg.onerror = function() {
                    console.warn('Failed to load favicon image from:', this.src);
                    console.warn('This might be due to CORS, file permissions, or missing file');
                    
                    // Apply fallback to all favicon links
                    try {
                      const faviconLinks = document.querySelectorAll('link[rel*="icon"]');
                      faviconLinks.forEach(link => {
                        if (link.href && link.href.includes('${siteIconUrl}')) {
                          link.href = '/logo.svg';
                        }
                      });
                      
                      // Also update apple-touch-icon and other icon types
                      const appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
                      if (appleTouchIcon) {
                        appleTouchIcon.href = '/logo.svg';
                      }
                      
                      const msTileImage = document.querySelector('meta[name="msapplication-TileImage"]');
                      if (msTileImage) {
                        msTileImage.content = '/logo.svg';
                      }
                      
                      // Favicon fallback applied
                    } catch (fallbackError) {
                      console.warn('Error applying favicon fallback:', fallbackError);
                    }
                  };
                  
                  // Set a timeout for the image test to avoid hanging
                  const timeoutId = setTimeout(() => {
                    console.warn('Favicon test timed out, applying fallback');
                    testImg.onerror();
                  }, 5000);
                  
                  testImg.onload = function() {
                    clearTimeout(timeoutId);
                    // Favicon image loaded successfully
                  };
                  
                  testImg.src = '${siteIconUrl}';
                  
                  // Force refresh favicon by changing the href
                  try {
                    const favicon = document.querySelector('link[rel="icon"]');
                    if (favicon) {
                      const timestamp = Date.now();
                      favicon.href = '${siteIconUrl}?v=' + timestamp;
                      // Favicon updated
                    }
                  } catch (refreshError) {
                    console.warn('Error refreshing favicon:', refreshError);
                  }
                  
                } catch (error) {
                  console.warn('Error in favicon refresh script:', error);
                  // Don't throw the error to prevent breaking the page
                }
              })();
            `}
          </Script>
        )}

        {/* Google AdSense Script - Load conditionally (not on dashboard) */}
        <Script
          id="google-adsense-conditional"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Only load Google AdSense on non-dashboard pages
              if (!window.location.pathname.startsWith('/dashboard') && 
                  !window.location.pathname.startsWith('/login') &&
                  !window.location.pathname.startsWith('/forgot-password') &&
                  !window.location.pathname.startsWith('/reset-password') &&
                  !window.location.pathname.startsWith('/auth')) {
                const script = document.createElement('script');
                script.async = true;
                script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5603341970726415';
                script.crossOrigin = 'anonymous';
                document.head.appendChild(script);
              }
            `,
          }}
        />

        {/* Facebook SDK for Comments - Only load on HTTPS or localhost */}
        <Script
          id="facebook-sdk"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              // Only load Facebook SDK on HTTPS or localhost
              if (window.location.protocol === 'https:' || window.location.hostname === 'localhost') {
                const script = document.createElement('script');
                script.src = 'https://connect.facebook.net/ar_AR/sdk.js#xfbml=1&version=v18.0&appId=${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "YOUR_FACEBOOK_APP_ID"}';
                script.async = true;
                script.defer = true;
                script.crossOrigin = 'anonymous';
                document.head.appendChild(script);
              }
            `,
          }}
        />
      </head>

      <body>
        <TenantStyleInjector cssVars={cssVars} tenantId={tenantId} />
        <div id="modal-root"></div>
        <Providers>{children}</Providers>
        {/* Ad Debugger for development */}
        {process.env.NODE_ENV === "development" && (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                // Add GPT library for testing
                if (typeof googletag === 'undefined') {
                  window.googletag = window.googletag || {cmd: []};
                  const gptScript = document.createElement('script');
                  gptScript.async = true;
                  gptScript.src = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js';
                  document.head.appendChild(gptScript);
                }
              `,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}

// Global metadata including favicon so it overrides the default app/favicon.ico
export async function generateMetadata(): Promise<Metadata> {
  try {
    const tenant = await detectTenantServerOnly();
    const s = await fetchSiteSetting(tenant);

    // Validate favicon URL before using it in metadata
    const validatedFaviconUrl = await validateFaviconUrl(s.siteIconUrl);

    return {
      title: s.siteTitle || "مدونة الموقع",
      description: s.siteDescription || undefined,
      icons: validatedFaviconUrl
        ? {
            icon: [
              { url: validatedFaviconUrl, rel: "icon" },
              { url: validatedFaviconUrl, rel: "shortcut icon" },
            ],
            apple: [{ url: validatedFaviconUrl, sizes: "180x180" }],
          }
        : undefined,
    };
  } catch {
    return {};
  }
}

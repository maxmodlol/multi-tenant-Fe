// app/layout.tsx  (root)
import "./globals.css";
import Providers from "@explore/components/Providers";
import { Geist, Geist_Mono } from "next/font/google";
import { fetchSiteSetting } from "@explore/services/settingService";
import Script from "next/script";
import { detectTenantServerOnly } from "../lib/tenantFromServer";
import type { Metadata } from "next";
import TenantStyleInjector from "@/src/components/TenantStyleInjector";

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
    siteIconUrl = s.siteIconUrl || "";

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
        {/* Dynamic favicon injection */}
        {siteIconUrl && (
          <>
            <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
            <meta httpEquiv="Pragma" content="no-cache" />
            <meta httpEquiv="Expires" content="0" />
            <link rel="icon" href={siteIconUrl} />
            <link rel="shortcut icon" href={siteIconUrl} />
            <link rel="apple-touch-icon" sizes="180x180" href={siteIconUrl} />
            <link rel="icon" type="image/png" sizes="32x32" href={siteIconUrl} />
            <link rel="icon" type="image/png" sizes="16x16" href={siteIconUrl} />
            <link rel="manifest" href="/manifest.json" />
            <meta name="msapplication-TileImage" content={siteIconUrl} />
            <meta name="msapplication-TileColor" content="#000000" />
            {/* Additional favicon formats for better browser support */}
            <link rel="icon" type="image/x-icon" href={siteIconUrl} />
            <link rel="icon" type="image/jpeg" href={siteIconUrl} />
            {/* Handle JPEG images specifically */}
            {siteIconUrl.endsWith(".jpg") || siteIconUrl.endsWith(".jpeg") ? (
              <link rel="icon" type="image/jpeg" href={siteIconUrl} />
            ) : null}
            {/* Handle ICO images specifically */}
            {siteIconUrl.endsWith(".ico") ? (
              <link rel="icon" type="image/x-icon" href={siteIconUrl} />
            ) : null}
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
              try {
                console.log('Favicon refresh script running, URL: ${siteIconUrl}');
                console.log('Current favicon links:', document.querySelectorAll('link[rel*="icon"]').length);
                
                // Test if the image can be loaded
                const testImg = new Image();
                testImg.onload = function() {
                  console.log('Favicon image loaded successfully:', this.width, 'x', this.height);
                  console.log('Favicon URL:', this.src);
                };
                testImg.onerror = function() {
                  console.error('Failed to load favicon image from:', this.src);
                };
                testImg.src = '${siteIconUrl}';
                
                // Force refresh favicon by changing the href
                const favicon = document.querySelector('link[rel="icon"]');
                if (favicon) {
                  const timestamp = Date.now();
                  favicon.href = '${siteIconUrl}?v=' + timestamp;
                  console.log('Favicon updated to:', favicon.href);
                } else {
                  console.log('No favicon link found');
                }
                
                // Also update all icon links
                document.querySelectorAll('link[rel*="icon"]').forEach((link, index) => {
                  console.log('Icon link', index, ':', link.rel, link.href);
                });
                
                // Force browser to reload favicon
                setTimeout(() => {
                  const links = document.querySelectorAll('link[rel*="icon"]');
                  links.forEach(link => {
                    if (link.href.includes('${siteIconUrl}')) {
                      link.href = link.href + '?reload=' + Date.now();
                      console.log('Forced favicon reload:', link.href);
                    }
                  });
                }, 1000);
              } catch (error) {
                console.error('Error updating favicon:', error);
              }
            `}
          </Script>
        )}

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
      </body>
    </html>
  );
}

// Global metadata including favicon so it overrides the default app/favicon.ico
export async function generateMetadata(): Promise<Metadata> {
  try {
    const tenant = await detectTenantServerOnly();
    const s = await fetchSiteSetting(tenant);
    return {
      title: s.siteTitle || "مدونة الموقع",
      description: s.siteDescription || undefined,
      icons: s.siteIconUrl
        ? {
            icon: [
              { url: s.siteIconUrl, rel: "icon" },
              { url: s.siteIconUrl, rel: "shortcut icon" },
            ],
            apple: [{ url: s.siteIconUrl, sizes: "180x180" }],
          }
        : undefined,
    };
  } catch {
    return {};
  }
}

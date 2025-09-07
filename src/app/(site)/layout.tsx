// app/(site)/layout.tsx
import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import Header from "@explore/components/layout/header";
import Footer from "@explore/components/layout/footer";
import AdHeaderInjector from "@explore/components/AdHeaderInjector";
import { fetchSiteSetting } from "@explore/services/settingService";
import type { Metadata } from "next";
import { FooterAd } from "@/src/components/TenantAdInjector";

/* Dynamic tenant metadata */
export async function generateMetadata(): Promise<Metadata> {
  try {
    const s = await fetchSiteSetting();
    return {
      title: s.siteTitle || "مدونة الموقع",
      description: s.siteDescription || undefined,
      openGraph: {
        type: "website",
        siteName: s.siteTitle || "مدونة الموقع",
        title: s.siteTitle || "مدونة الموقع",
        description: s.siteDescription || undefined,
      },
      twitter: {
        card: "summary",
        title: s.siteTitle || "مدونة الموقع",
        description: s.siteDescription || undefined,
      },
    };
  } catch {
    return { title: "مدونة الموقع" };
  }
}

// Force dynamic rendering to avoid static generation issues
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  /* ---------- defaults that work even if API fails ---------- */
  let logoLight = "/logo.svg";
  let logoDark = "/logo.svg";
  let siteTitle = "مدونة الموقع";
  let siteDescription: string | undefined = "أحدث أخبار الصناعة، المقالات، الإرشادات، والنصائح.";
  let siteIconUrl: string | undefined = undefined;
  let headerStyle: "gradient" | "solid" = "gradient";
  let headerColor: string | undefined; // header tint (if set)
  let baseColor: string | undefined; // main brand color, always provided

  try {
    /* fetch + inline-fallback → keeps your original style */
    const s = await fetchSiteSetting().catch(() => ({
      siteTitle: "مدونة الموقع",
      siteDescription: null,
      siteIconUrl: null,
      logoLightUrl: "/logo.svg",
      logoDarkUrl: "/logo.svg",
      baseColor: "240 20% 50%",
      brandScale: {}, // satisfy the type
      headerStyle: "gradient" as const,
      headerColor: null,
    }));

    /* meta */
    siteTitle = s.siteTitle ?? siteTitle;
    siteDescription = s.siteDescription ?? siteDescription;
    siteIconUrl = s.siteIconUrl ?? undefined;

    /* logos */
    if (s.logoLightUrl) logoLight = s.logoLightUrl;
    if (s.logoDarkUrl) logoDark = s.logoDarkUrl;

    /* header style / colour */
    headerStyle = s.headerStyle;
    headerColor = s.headerColor ?? undefined;
    baseColor = s.baseColor;
  } catch {
    /* swallow → keep defaults */
  }

  return (
    <>
      <AdHeaderInjector />

      <Header
        logoLightUrl={logoLight}
        logoDarkUrl={logoDark}
        headerStyle={headerStyle}
        headerColor={headerColor}
      />

      <main className="mt-20">{children}</main>

      {/* Footer Ad - Above the footer */}
      <div className="w-full">
        <FooterAd pageType="home" tenantId="main" />
      </div>

      <Footer
        logoLightUrl={logoLight}
        logoDarkUrl={logoDark}
        headerStyle={headerStyle}
        headerColor={headerColor}
        baseColor={baseColor}
      />

      <Toaster position="bottom-center" toastOptions={{ duration: 3000 }} />
    </>
  );
}

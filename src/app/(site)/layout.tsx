// app/(site)/layout.tsx
import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import Header from "@explore/components/layout/header";
import Footer from "@explore/components/layout/footer";
import AdHeaderInjector from "@explore/components/AdHeaderInjector";
import { fetchSiteSetting } from "@explore/services/settingService";
import type { Metadata } from "next";

/* ───────────── static meta (unchanged) ───────────── */
export const metadata: Metadata = {
  title: "الموارد والرؤى — مدونة الموقع",
  description: "أحدث أخبار الصناعة، المقالات، الإرشادات، والنصائح.",
  alternates: { canonical: "https://yourdomain.com/" },
  openGraph: {
    type: "website",
    locale: "ar_AR",
    siteName: "مدونة الموقع",
    title: "الموارد والرؤى — مدونة الموقع",
    description: "أحدث أخبار الصناعة، المقالات، الإرشادات، والنصائح.",
    url: "https://yourdomain.com/",
    images: [
      {
        url: "https://yourdomain.com/path/to/first-blog-image.jpg",
        width: 1200,
        height: 600,
        alt: "صورة لموارد الموقع",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "الموارد والرؤى — مدونة الموقع",
    description: "أحدث أخبار الصناعة، المقالات، الإرشادات، والنصائح.",
    images: ["https://yourdomain.com/path/to/first-blog-image.jpg"],
  },
};

export default async function SiteLayout({ children }: { children: ReactNode }) {
  /* ---------- defaults that work even if API fails ---------- */
  let logoLight = "/logo.svg";
  let logoDark = "/logo.svg";
  let headerStyle: "gradient" | "solid" = "gradient";
  let headerColor: string | undefined; // only when solid

  try {
    /* fetch + inline-fallback → keeps your original style */
    const s = await fetchSiteSetting().catch(() => ({
      logoLightUrl: "/logo.svg",
      logoDarkUrl: "/logo.svg",
      baseColor: "240 20% 50%",
      brandScale: {}, // satisfy the type
      headerStyle: "gradient" as const,
      headerColor: null,
    }));

    /* logos */
    if (s.logoLightUrl) logoLight = s.logoLightUrl;
    if (s.logoDarkUrl) logoDark = s.logoDarkUrl;

    /* header style / colour */
    headerStyle = s.headerStyle;
    if (s.headerStyle === "solid") {
      headerColor = s.headerColor ?? s.baseColor;
    }
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

      <Footer logoLightUrl={logoLight} logoDarkUrl={logoDark} />

      <Toaster position="bottom-center" toastOptions={{ duration: 3000 }} />
    </>
  );
}

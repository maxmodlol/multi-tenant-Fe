// app/(site)/layout.tsx
import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import Header from "@explore/components/layout/header";
import Footer from "@explore/components/layout/footer";
import AdHeaderInjector from "@explore/components/AdHeaderInjector";
import { fetchSiteSetting } from "@explore/services/settingService";
import type { Metadata } from "next";

/** static tags merged for every page under (site) */
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
  let logoLight = "/logo.svg";
  let logoDark = "/logo.svg";

  try {
    const s = await fetchSiteSetting();
    if (s.logoLightUrl) logoLight = s.logoLightUrl;
    if (s.logoDarkUrl) logoDark = s.logoDarkUrl;
  } catch {}

  return (
    <>
      <AdHeaderInjector />
      <Header logoLightUrl={logoLight} logoDarkUrl={logoDark} />
      <main className="mt-20">{children}</main>
      <Footer logoLightUrl={logoLight} logoDarkUrl={logoDark} />
      <Toaster position="bottom-center" toastOptions={{ duration: 3000 }} />
    </>
  );
}

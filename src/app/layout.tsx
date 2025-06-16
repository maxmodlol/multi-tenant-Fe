// app/layout.tsx  (root)
import "./globals.css";
import Providers from "@explore/components/Providers";
import { Geist, Geist_Mono } from "next/font/google";
import { fetchSiteSetting } from "@explore/services/settingService";
import Script from "next/script";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  /* build tenant CSS vars */
  let cssVars = "";
  try {
    const s = await fetchSiteSetting();
    for (const [lvl, hsl] of Object.entries(s.brandScale ?? {})) {
      cssVars += `--brand-${lvl}: ${hsl}; `;
    }
  } catch {}

  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* tenant colour overrides */}
        {cssVars && <style id="tenant-vars">{`:root { ${cssVars} }`}</style>}

        {/* dark / light bootstrap */}
        <Script id="dark-picker" strategy="beforeInteractive">
          {`
            try {
              const t = localStorage.getItem('theme');
              document.documentElement.classList[t === 'dark' ? 'add' : 'remove']('dark');
            } catch {}
          `}
        </Script>
      </head>

      <body>
        <div id="modal-root"></div>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

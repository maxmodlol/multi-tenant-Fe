/* app/(auth)/layout.tsx ---------------------------------------- */
import "../globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { fetchSiteSetting } from "@/src/services/settingService";
import LogoImage from "@/src/components/LogoImage";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  // Fetch logo from tenant settings with fallback
  let logoUrl = "/logo.svg";

  try {
    const siteSetting = await fetchSiteSetting().catch(() => null);
    if (siteSetting?.logoLightUrl) {
      logoUrl = siteSetting.logoLightUrl;
    }
  } catch (error) {
    console.warn("Failed to fetch site settings for auth layout:", error);
  }

  return (
    <section
      className={`${geistSans.variable} ${geistMono.variable} relative flex min-h-screen flex-col items-center justify-center px-4`}
    >
      {/* decorative SVG (top-centre) */}
      <LogoImage src={logoUrl} alt="Logo" width={100} height={40} />

      {children}
      <Toaster position="bottom-center" toastOptions={{ duration: 3000 }} />
    </section>
  );
}

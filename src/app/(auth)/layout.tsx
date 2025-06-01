/* app/(auth)/layout.tsx ---------------------------------------- */
import "../globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section
      className={`${geistSans.variable} ${geistMono.variable} relative flex min-h-screen flex-col items-center justify-center px-4`}
    >
      {/* decorative SVG (top-centre) */}
      <Image src="/logo.svg" alt="Logo" width={100} height={40} />

      {children}
      <Toaster position="bottom-center" toastOptions={{ duration: 3000 }} />
    </section>
  );
}

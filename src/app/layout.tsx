import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import axios from "axios";
import QueryClientProvider from "@explore/config/react-query";
import Header from "@explore/components/layout/header";

import Footer from "@explore/components/layout/footer";
import { Toaster } from "react-hot-toast";

// ✅ Dynamically set API base URL
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || "https://api.example.com";

// ✅ Load fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-white dark:bg-gray-950 text-gray-950 dark:text-white">
        <QueryClientProvider>
          <Header />
          <main className="mt-20">{children}</main>
          <Footer />
          <Toaster position="bottom-center" toastOptions={{ duration: 3000 }} />
        </QueryClientProvider>
      </body>
    </html>
  );
}

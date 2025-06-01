"use client"; //  ← this is a client layout

import QueryClientProvider from "@explore/config/react-query";
import Header from "@explore/components/layout/header";
import Footer from "@explore/components/layout/footer";
import { Toaster } from "react-hot-toast";
import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || "https://api.example.com";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="mt-20">{children}</main>
      <Footer />
      <Toaster position="bottom-center" toastOptions={{ duration: 3000 }} />
    </>
  );
}

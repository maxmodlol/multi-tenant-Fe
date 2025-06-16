/* src/app/(dashboard)/layout.tsx */
import "../globals.css";
import { ReactNode } from "react";
import ClientProviders from "./_components/ClientProviders";

export const revalidate = 0; // avoid caching

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  // <ClientProviders> includes SessionProvider + AuthGuard
  return <ClientProviders>{children}</ClientProviders>;
}

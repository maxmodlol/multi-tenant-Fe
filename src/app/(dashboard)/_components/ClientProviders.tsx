// app/(dashboard)/_components/ClientProviders.tsx
"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import AuthGuard from "./AuthWrapper";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider
      refetchInterval={0} //  stop 5-min polling
      refetchOnWindowFocus={false}
    >
      <AuthGuard>{children}</AuthGuard>
    </SessionProvider>
  );
}

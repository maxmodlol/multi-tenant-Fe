/* src/components/Providers.tsx ----------------------------------- */
"use client";

import { SessionProvider } from "next-auth/react";
import QueryClientProvider from "@explore/config/react-query"; // ← you already have this
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider>{children}</QueryClientProvider>
    </SessionProvider>
  );
}

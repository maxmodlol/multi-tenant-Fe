"use client";

import QueryClientProvider from "@explore/config/react-query"; // ← you already have this
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return <QueryClientProvider>{children}</QueryClientProvider>;
}

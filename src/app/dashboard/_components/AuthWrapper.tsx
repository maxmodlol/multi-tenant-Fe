"use client";
import { usePathname, useRouter } from "next/navigation";

import { useSession } from "next-auth/react";
import { ReactNode } from "react";

export default function AuthWrapper({ children }: { children: ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const session = useSession();

  if (session.status === "unauthenticated") {
    router.replace(`/login?next=${encodeURIComponent(path)}`);
  }
  return <>{session.status === "authenticated" && <>{children}</>}</>;
}

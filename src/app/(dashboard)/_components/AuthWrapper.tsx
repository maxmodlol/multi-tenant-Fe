"use client";

import { useEffect, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Spinner } from "@/src/components/ui/spinner";

export default function AuthWrapper({ children }: { children: ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const { status } = useSession(); // "loading" | "authenticated" | "unauthenticated"

  /* side-effect AFTER the paint */
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/login?next=${encodeURIComponent(path)}`);
    }
  }, [status, path, router]); // ← safe, runs only after render

  /* graceful loading */
  if (status === "loading") {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return status === "authenticated" ? <>{children}</> : null;
}

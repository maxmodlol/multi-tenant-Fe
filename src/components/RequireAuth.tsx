// src/components/RequireAuth.tsx
"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.replace(`/login?next=${encodeURIComponent(path)}`);
  }, [path, router]);

  return <>{children}</>;
}

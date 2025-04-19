"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import clsx from "clsx";
import { Input } from "./ui/input";

export default function SearchOverlay({ onClose }: { onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const router = useRouter();

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();

    const handleOutsideClick = (e: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

  const handleSearch = () => {
    if (query.trim().length > 1) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center px-4">
      <div
        ref={overlayRef}
        className={clsx(
          "relative w-full max-w-2xl rounded-full px-4 py-3",
          " text-black shadow-md dark:bg-gray-900 dark:text-text-black",
        )}
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />

        <Input
          ref={inputRef}
          type="text"
          placeholder="Search"
          value={query}
          icon={"search"}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className={clsx(
            "w-full pl-10 pr-10 py-2 text-lg bg-transparent focus:outline-none",
            "text-black  placeholder-gray-400 dark:placeholder-gray-500",
          )}
        />
      </div>
    </div>
  );
}

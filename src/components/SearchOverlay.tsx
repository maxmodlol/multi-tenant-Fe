"use client";

import { useEffect, useRef, useState, KeyboardEvent, FocusEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";

export default function SearchOverlay({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown as any);
    return () => document.removeEventListener("keydown", onKeyDown as any);
  }, [onClose]);

  // close if click outside
  const handleClickOutside = (e: MouseEvent) => {
    if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
      onClose();
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const submit = () => {
    const q = query.trim();
    if (q.length > 1) {
      // Force a full page navigation to clear any previously injected third-party scripts
      const url = `/search?q=${encodeURIComponent(q)}`;
      if (typeof window !== "undefined") {
        window.location.assign(url);
      } else {
        router.push(url);
      }
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-label"
    >
      <div
        ref={overlayRef}
        className="relative w-full max-w-2xl rounded-full bg-white dark:bg-gray-900 px-4 py-3 shadow-lg flex items-center"
      >
        <label htmlFor="search-input" id="search-label" className="sr-only">
          بحث
        </label>
        <Input
          ref={inputRef}
          id="search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="ابحث في المدونة…"
          className="flex-1 bg-transparent outline-none text-lg text-black  dark:text-gray-900 placeholder-gray-400 dark:placeholder-gray-500"
        />
      </div>
    </div>
  );
}

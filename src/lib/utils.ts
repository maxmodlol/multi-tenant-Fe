import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind and conditional classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Checks if a given text contains Arabic characters.
 * @param text The string to check.
 * @returns Boolean indicating whether the text is Arabic.
 */
export const isArabic = (text: string): boolean => {
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/; // Arabic Unicode range
  return arabicRegex.test(text);
};

/**
 * Retrieves the current language from localStorage or defaults to English.
 * @returns "ar" for Arabic, "en" for English.
 */
export const getLanguage = (): "en" | "ar" => {
  if (typeof window !== "undefined") {
    const storedLang = localStorage.getItem("language");
    return storedLang === "ar" ? "ar" : "en"; // ✅ Ensure only "ar" or "en" is returned
  }
  return "en"; // ✅ Default to English
};

/**
 * Saves the selected language in localStorage.
 * @param lang "ar" for Arabic, "en" for English.
 */
export const setLanguage = (lang: "ar" | "en") => {
  if (typeof window !== "undefined") {
    localStorage.setItem("language", lang);
    setDirection(lang); // Update direction immediately
  }
};

/**
 * Sets the document direction (`dir="rtl"` or `dir="ltr"`) based on the selected language.
 * @param lang "ar" for Arabic, "en" for English.
 */
export const setDirection = (lang?: "ar" | "en") => {
  if (typeof window !== "undefined") {
    const html = document.documentElement;
    const language = lang || getLanguage(); // Use provided language or get from storage

    if (language === "ar") {
      html.setAttribute("dir", "rtl");
      html.setAttribute("lang", "ar");
    } else {
      html.setAttribute("dir", "ltr");
      html.setAttribute("lang", "en");
    }
  }
};

/**
 * Returns a boolean indicating if the app is currently in Arabic mode.
 * @returns True if Arabic, otherwise false.
 */
export const isRTL = (): boolean => {
  return getLanguage() === "ar";
};

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

// lib/utils.ts
export function getTagColorClass(index: number): string {
  const tagColors = [
    "bg-pink-100 text-pink-600 border border-pink-300",
    "bg-blue-100 text-blue-600 border border-blue-300",
    "bg-brand-100 text-brand-600 border border-brand-300",
  ];
  return tagColors[index % tagColors.length];
}

/**
 * Validates if a favicon URL is accessible and returns a fallback if needed.
 * @param faviconUrl The favicon URL to validate.
 * @returns The original URL if valid, or a fallback URL if invalid.
 */
export async function validateFaviconUrl(
  faviconUrl: string | null | undefined,
): Promise<string | null> {
  if (!faviconUrl) return null;

  try {
    // Basic URL validation
    const url = new URL(faviconUrl);
    if (!["http:", "https:"].includes(url.protocol)) {
      console.warn("Invalid favicon URL protocol:", faviconUrl);
      return null;
    }

    // For S3 URLs, we'll assume they're valid but add a cache-busting parameter
    if (url.hostname.includes("amazonaws.com") || url.hostname.includes("s3.")) {
      return faviconUrl;
    }

    // For other URLs, we could add more validation here
    return faviconUrl;
  } catch (error) {
    console.warn("Invalid favicon URL format:", faviconUrl, error);
    return null;
  }
}

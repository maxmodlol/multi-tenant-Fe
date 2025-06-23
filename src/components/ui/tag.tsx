"use client";

import React, { ReactNode } from "react";

export interface TagProps {
  children: ReactNode;
  variant?: "outline" | "solid" | "ghost" | "destructive";
  onClick?: () => void;
  isActive?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function Tag({
  children,
  variant = "solid",
  onClick,
  isActive = false,
  disabled = false,
  className = "",
}: TagProps) {
  // Base styles for every tag‐button
  const baseClasses =
    "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full transition-colors focus:outline-none ";

  // Pick variant or active style
  let variantClasses = "";
  if (isActive) {
    // Active always overrides to a solid indigo look
    variantClasses = "bg-brand-600 text-white border border-indigo-600";
  } else {
    switch (variant) {
      case "outline":
        variantClasses = "border border-gray-300 bg-transparent text-gray-800 hover:bg-gray-50";
        break;
      case "ghost":
        variantClasses = "bg-gray-100 text-gray-800 hover:bg-gray-200";
        break;
      case "destructive":
        variantClasses = "bg-red-100 text-red-800 hover:bg-red-200";
        break;
      case "solid":
      default:
        variantClasses = "bg-brand-100 text-brand-800 hover:bg-brand-200";
        break;
    }
  }

  // If `onClick` is provided, show pointer; if disabled, gray out
  const cursorClass = disabled
    ? "cursor-not-allowed opacity-50"
    : onClick
      ? "cursor-pointer"
      : "cursor-default";

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${cursorClass} ${className}`}
    >
      {children}
    </button>
  );
}

Tag.displayName = "Tag";

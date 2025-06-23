// components/ui/Spinner.tsx
import React from "react";

export function Spinner() {
  return (
    <div
      role="status"
      className="
        inline-block
        w-12 h-12
        border-4 border-gray-200
        border-t-indigo-500
        rounded-full
        animate-spin
      "
    />
  );
}

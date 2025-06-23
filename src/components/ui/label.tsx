// src/components/ui/label.tsx
import { ReactNode } from "react";

export function Label({ htmlFor, children }: { htmlFor?: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
      {children}
    </label>
  );
}

// optionally also keep default for backwards-compatibility
export default Label;

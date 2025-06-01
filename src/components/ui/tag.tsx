import { ReactNode } from "react";

export interface TagProps {
  children: ReactNode;
  variant?: "outline" | "solid" | "ghost" | "destructive";
  onClick?: () => void;
  className?: string;
}

export default function Tag({ children, variant = "solid" }: TagProps) {
  const base = "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full";
  let styles = "";

  switch (variant) {
    case "outline":
      styles = "border border-gray-300 bg-transparent text-gray-800";
      break;
    case "ghost":
      styles = "bg-gray-100 text-gray-800";
      break;
    case "destructive":
      styles = "bg-red-100 text-red-800";
      break;
    case "solid":
    default:
      styles = "bg-indigo-100 text-indigo-800";
  }

  return <span className={`${base} ${styles}`}>{children}</span>;
}

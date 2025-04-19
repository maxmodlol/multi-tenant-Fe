import * as React from "react";
import { cn } from "@explore/lib/utils";
import { Search, Eye, EyeOff } from "lucide-react";
import { Button } from "./button";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: "search" | "password" | "email" | null;
  error?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, icon, error, helperText, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === "password" && icon === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
        )}

        <div className="relative">
          {icon === "search" && (
            <Search className="absolute left-3 top-1/2 -translate-y-1/2  size-5" />
          )}

          {isPassword && (
            <Button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 "
            >
              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </Button>
          )}

          <input
            type={inputType}
            ref={ref}
            className={cn(
              // Layout
              "flex h-10 w-full items-center rounded-full px-3 py-2 text-sm",
              // Default look
              "text-text-primary placeholder-text-placeholder",
              // Focus state
              "border-0 border-transparent", // default border
              "focus:outline-none focus:border-2 focus:ring-0 focus:ring-offset-0", // kill ring
              "focus:border-border-brand dark:border-border-primary", // apply your brand color
              // Disabled
              "disabled:cursor-not-allowed disabled:opacity-50",

              // Icon padding
              icon === "search" ? "pl-10" : "",
              isPassword ? "pr-10" : "",
              // Error override
              error &&
                "border-error-500 text-error-500 placeholder-error-500 focus:border-error-500",
              className,
            )}
            {...props}
          />
        </div>

        {error ? (
          <p className="text-sm text-text-error-primary mt-1">{error}</p>
        ) : helperText ? (
          <p className="text-sm text-text-tertiary mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
export { Input };

import React, { ReactNode } from "react";
import { cn } from "@/src/lib/utils";

interface ToggleItemProps {
  value: string;
  isSelected?: boolean;
  onClick?: () => void;
  children: ReactNode;
  icon?: ReactNode;
  badge?: string | number;
}

export function ToggleGroup({
  value,
  onValueChange,
  children,
  className,
}: {
  value: string;
  onValueChange: (val: string) => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full max-w-full overflow-x-auto tab-scrollbar",
        "bg-background-secondary/50 backdrop-blur-enhanced",
        "border border-border-secondary/60",
        "rounded-2xl p-1.5 shadow-soft dark:shadow-soft-dark",
        "dark:bg-background-secondary/80",
        className,
      )}
    >
      <div className="flex items-center gap-1 min-w-max sm:gap-1.5">
        {React.Children.map(children, (child) => {
          // ensure this is our ToggleGroupItem
          if (React.isValidElement<ToggleItemProps>(child)) {
            return React.cloneElement<ToggleItemProps>(child, {
              isSelected: child.props.value === value,
              onClick: () => onValueChange(child.props.value),
            });
          }
          return child;
        })}
      </div>
    </div>
  );
}

export function ToggleGroupItem({ isSelected, onClick, children, icon, badge }: ToggleItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-2 px-3 py-2.5 sm:px-4 rounded-xl",
        "text-sm font-medium transition-all duration-300 ease-out",
        "min-w-max whitespace-nowrap tab-focus",
        "button-hover-lift",

        // Light mode styles
        "bg-white/80 border border-transparent",
        "text-text-secondary hover:text-text-primary",
        "hover:bg-background-primary/80 hover:border-border-secondary/50",
        "shadow-sm hover:shadow-md hover:shadow-black/5",

        // Dark mode styles
        "dark:bg-gray-800/80 dark:border-transparent",
        "dark:text-text-secondary dark:hover:text-text-primary",
        "dark:hover:bg-background-tertiary/80 dark:hover:border-border-secondary/50",
        "dark:shadow-sm dark:hover:shadow-md dark:hover:shadow-black/20",

        // Selected state
        isSelected && [
          "bg-brand-500 text-white border-brand-400",
          "shadow-lg shadow-brand-500/25 scale-[1.02]",
          "dark:bg-brand-600 dark:border-brand-500 dark:shadow-brand-600/25",
          "hover:bg-brand-600 hover:border-brand-500",
          "dark:hover:bg-brand-700 dark:hover:border-brand-600",
        ],

        // Disabled state
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
      )}
    >
      {/* Background glow effect for selected state */}
      {isSelected && (
        <div
          className={cn(
            "absolute inset-0 rounded-xl",
            "bg-gradient-to-r from-brand-500/20 to-brand-600/20",
            "dark:from-brand-400/20 dark:to-brand-500/20",
            "animate-pulse",
          )}
        />
      )}

      {/* Content */}
      <div className="relative flex items-center gap-1.5 sm:gap-2">
        {icon && (
          <span
            className={cn(
              "text-sm sm:text-base transition-colors duration-200",
              isSelected ? "text-white" : "text-text-tertiary",
            )}
          >
            {icon}
          </span>
        )}

        <span className="relative z-10 text-sm">{children}</span>

        {badge && (
          <span
            className={cn(
              "px-1.5 sm:px-2 py-0.5 text-xs font-semibold rounded-full transition-all duration-200",
              "min-w-[1.25rem] h-4 sm:h-5 flex items-center justify-center",
              isSelected
                ? "bg-white/20 text-white"
                : "bg-background-tertiary text-text-secondary dark:bg-background-quaternary",
            )}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Ripple effect on click */}
      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-white/10 scale-0 rounded-full transition-transform duration-300 ease-out group-active:scale-150" />
      </div>
    </button>
  );
}

import React, { ReactNode } from "react";

interface ToggleItemProps {
  value: string;
  isSelected?: boolean;
  onClick?: () => void;
  children: ReactNode;
}

export function ToggleGroup({
  value,
  onValueChange,
  children,
}: {
  value: string;
  onValueChange: (val: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="inline-flex border border-gray-300 dark:border-gray-600 rounded-md ">
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
  );
}

export function ToggleGroupItem({ isSelected, onClick, children }: ToggleItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        px-3 py-2 text-sm
        ${isSelected ? "bg-gray-100 dark:bg-gray-700" : "bg-white dark:bg-gray-800"}
        border-r border-gray-300 dark:border-gray-600
        last:border-r-0
      `}
    >
      {children}
    </button>
  );
}

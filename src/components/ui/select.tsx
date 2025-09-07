"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface SelectProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  children: React.ReactNode;
}
interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> & {
  Item: React.FC<SelectItemProps>;
} = ({ value, onChange, className = "", placeholder = "Select…", disabled = false, children }) => {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // close on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (
        btnRef.current &&
        !btnRef.current.contains(e.target as Node) &&
        listRef.current &&
        !listRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // find label
  let label = "";
  React.Children.forEach(children, (c) => {
    if (React.isValidElement<SelectItemProps>(c) && c.props.value === value) {
      label = typeof c.props.children === "string" ? c.props.children : String(c.props.children);
    }
  });

  // flatten items
  const items = React.Children.toArray(children).filter(
    (c): c is React.ReactElement<SelectItemProps> => React.isValidElement<SelectItemProps>(c),
  );

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="
          flex items-center justify-between w-full h-10
          bg-white dark:bg-gray-800
          border border-gray-300 dark:border-gray-600
          rounded-full px-4 text-sm
          text-gray-700 dark:text-gray-200
          hover:bg-gray-50 dark:hover:bg-gray-700
          focus:outline-none focus:ring-2 focus:ring-indigo-500
        "
        disabled={disabled}
      >
        <span className="truncate">
          {label || <span className="text-gray-400">{placeholder}</span>}
        </span>
        <ChevronDown className="ml-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
      </button>

      {open && (
        <ul
          ref={listRef}
          className="
            absolute left-0 right-0 z-50 mt-1
            bg-gray-100 dark:bg-gray-800
            
            border border-gray-300 dark:border-gray-600
            rounded-md shadow-lg py-1
            max-h-60 overflow-auto
          "
        >
          {items.map((c) => (
            <li
              key={c.props.value}
              onClick={() => {
                onChange(c.props.value);
                setOpen(false);
              }}
              className={`
                cursor-pointer px-4 py-2 text-sm
                text-gray-700 dark:text-gray-200
                hover:bg-gray-300 dark:hover:bg-gray-700
                ${c.props.value === value ? "bg-indigo-50 dark:bg-indigo-900 font-semibold" : ""}
              `}
            >
              {c.props.children}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const SelectItem = ({ children }: SelectItemProps) => <>{children}</>;
SelectItem.displayName = "SelectItem";
Select.Item = SelectItem;
Select.displayName = "Select";

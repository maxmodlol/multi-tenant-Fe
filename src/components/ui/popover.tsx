import React, { useState, useRef, useEffect, ReactNode } from "react";

interface PopoverProps {
  trigger: ReactNode; // anything renderable: a <button>, <div>, etc.
  children: ReactNode;
  side?: "bottom" | "top" | "left" | "right";
}

export const Popover: React.FC<PopoverProps> = ({ trigger, children, side = "bottom" }) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // click-outside to close
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        contentRef.current &&
        !contentRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // positioning shortcuts
  const posClass = {
    bottom: "mt-2 left-0",
    top: "mb-2 bottom-full left-0",
    left: "mr-2 right-full top-0",
    right: "ml-2 left-full top-0",
  }[side];

  return (
    <div className="relative inline-block">
      {/* wrap the trigger in a div instead of a button */}
      <div
        ref={triggerRef}
        onClick={() => setOpen((o) => !o)}
        className="inline-block cursor-pointer"
      >
        {trigger}
      </div>

      {open && (
        <div ref={contentRef} className={`absolute z-10 rounded bg-white p-2 shadow ${posClass}`}>
          {children}
        </div>
      )}
    </div>
  );
};

// components/ui/dropdown-menu.tsx
import clsx from "clsx";
import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  ReactNode,
  ReactElement,
} from "react";

interface DropdownContext {
  open: boolean;
  setOpen: (open: boolean) => void;
}
const DropdownContext = createContext<DropdownContext | null>(null);

export function DropdownMenu({
  open: controlledOpen,
  onOpenChange,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined && !!onOpenChange;
  const open = isControlled ? controlledOpen! : uncontrolledOpen;
  const setOpen = isControlled ? onOpenChange! : setUncontrolledOpen;

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [setOpen]);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={ref} className="relative w-full">
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

// 👇 Here’s the updated signature:
export function DropdownMenuTrigger({
  children,
}: {
  // Tell TS this is “some element that can accept onClick”
  children: ReactElement<any>;
}) {
  const ctx = useContext(DropdownContext)!;
  // Now TS knows `children` can take `onClick`
  return React.cloneElement(children, {
    onClick: () => ctx.setOpen(!ctx.open),
  });
}

// components/ui/dropdown-menu.tsx

export function DropdownMenuContent(props: React.HTMLAttributes<HTMLDivElement>) {
  const ctx = useContext(DropdownContext)!;
  if (!ctx.open) return null;
  return (
    <div
      {...props}
      className={clsx(
        "absolute left-2 top-10", // pin just below/offset from the trigger
        "w-40",
        "bg-white dark:bg-gray-800",
        "border border-gray-200 dark:border-gray-700",
        "rounded shadow-md",
        "z-50", // make sure it sits above everything
      )}
    />
  );
}

export function DropdownMenuItem(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
      {...props}
    />
  );
}

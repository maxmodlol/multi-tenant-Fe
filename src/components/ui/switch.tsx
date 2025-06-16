// components/ui/switch.tsx
"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

export const Switch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={`
      relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full
      bg-gray-300 transition-colors duration-300 ease-in-out
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
      data-[state=checked]:bg-brand-600
      ${className || ""}
    `}
    {...props}
  >
    <SwitchPrimitive.Thumb
      className={`
        block h-4 w-4 translate-x-1 transform rounded-full bg-white shadow
        transition-transform duration-300 ease-in-out
        data-[state=checked]:translate-x-6
      `}
    />
  </SwitchPrimitive.Root>
));
Switch.displayName = SwitchPrimitive.Root.displayName;

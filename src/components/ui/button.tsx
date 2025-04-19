import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@explore/services/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:shrink-0 [&_svg]:size-5",
  {
    variants: {
      variant: {
        primary:
          "bg-background-brand-solid text-text-primary-on-brand hover:bg-background-brand-solid-hover",

        secondaryGray:
          "bg-background-secondary text-text-secondary hover:bg-background-secondary-hover border border-border-primary",

        secondaryColor:
          "bg-background-brand-primary text-text-brand-primary hover:bg-background-brand-solid border border-border-brand",

        tertiaryGray: "bg-transparent text-text-tertiary hover:text-text-tertiary-hover",

        tertiaryColor:
          "bg-transparent text-text-brand-tertiary hover:text-text-brand-tertiary-hover",

        linkGray: "bg-transparent text-text-tertiary underline-offset-4 hover:underline",

        linkColor: "bg-transparent text-text-brand-tertiary underline-offset-4 hover:underline",

        ghost: "bg-transparent text-text-primary hover:bg-background-secondary-hover",

        outline:
          "bg-transparent border border-border-primary text-text-primary hover:bg-background-secondary-hover",

        white:
          "bg-white text-gray-900 shadow-sm border border-gray-300 hover:bg-gray-100 dark:bg-[#0f0f11] dark:text-white dark:border-[#2d2d2d] dark:hover:bg-[#1a1a1a]",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-6 text-base",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 border-[3px] px-5 py-3 font-pixel text-[10px] uppercase leading-relaxed tracking-[0.08em] transition-[color,background-color,box-shadow,transform] duration-100 disabled:pointer-events-none disabled:opacity-40 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
  {
    variants: {
      variant: {
        primary: "border-[#b8ffd2] bg-primary text-[#02130a] shadow-[4px_4px_0_#167b45] hover:bg-[#82ffae]",
        secondary: "border-blue bg-[#0c2443] text-[#cde9ff] shadow-[4px_4px_0_#061225] hover:bg-[#12365e]",
        yellow: "border-[#fff1a1] bg-yellow text-[#171000] shadow-[4px_4px_0_#8a6c00] hover:bg-[#ffe873]",
        danger: "border-[#ffabb3] bg-red text-[#190105] shadow-[4px_4px_0_#731722] hover:bg-[#ff7380]",
        ghost: "border-border bg-transparent text-foreground shadow-[4px_4px_0_#000510] hover:border-blue hover:text-blue",
      },
      size: {
        default: "min-h-12",
        sm: "min-h-11 px-4 py-2 text-[9px]",
        lg: "min-h-14 px-7 py-4 text-[11px]",
        icon: "size-12 p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export interface PixelButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export function PixelButton({ className, variant, size, type = "button", ...props }: PixelButtonProps) {
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };

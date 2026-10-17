import * as React from "react";
import { cn } from "@/lib/utils";

export const PixelInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn("min-h-12 w-full border-[3px] border-border bg-[#030815] px-4 py-2 text-xl text-foreground caret-primary shadow-inner placeholder:text-[#617395] hover:border-[#466795] focus:border-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-50", className)}
      {...props}
    />
  ),
);
PixelInput.displayName = "PixelInput";

export const PixelTextarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn("w-full resize-y border-[3px] border-border bg-[#030815] px-4 py-3 text-lg leading-relaxed text-foreground caret-primary shadow-inner placeholder:text-[#617395] hover:border-[#466795] focus:border-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-50", className)}
      {...props}
    />
  ),
);
PixelTextarea.displayName = "PixelTextarea";

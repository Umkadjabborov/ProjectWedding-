"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary" | "link" | "gold";
  size?: "default" | "sm" | "lg" | "icon";
  loading?: boolean;
}

const variantClasses: Record<string, string> = {
  default:
    "bg-gradient-to-br from-gold to-gold-dark text-white shadow-gold hover:shadow-gold-lg hover:-translate-y-0.5 active:translate-y-0",
  gold:
    "bg-gradient-to-br from-gold to-gold-dark text-white shadow-gold hover:shadow-gold-lg hover:-translate-y-0.5 active:translate-y-0",
  outline:
    "border-2 border-gold/40 bg-transparent text-foreground hover:border-gold hover:bg-gold/5 hover:text-gold",
  ghost:
    "bg-transparent hover:bg-muted text-foreground hover:text-foreground",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  link:
    "text-primary underline-offset-4 hover:underline p-0 h-auto",
};

const sizeClasses: Record<string, string> = {
  default: "h-11 px-5 py-2.5 text-sm",
  sm: "h-9 px-4 py-2 text-xs rounded-lg",
  lg: "h-12 px-8 py-3 text-base",
  icon: "h-10 w-10",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", loading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium",
        "ring-offset-background transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
);
Button.displayName = "Button";

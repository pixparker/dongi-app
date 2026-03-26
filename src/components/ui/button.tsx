"use client";

import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  full?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-accent text-bg font-bold hover:brightness-110",
  secondary: "bg-card text-text-primary border border-border hover:bg-card-hover",
  ghost: "bg-transparent text-accent hover:bg-accent-soft",
  danger: "bg-danger-soft text-danger hover:brightness-110",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3.5 py-2 text-xs rounded-[10px]",
  md: "px-6 py-3 text-sm rounded-[14px]",
  lg: "px-7 py-4 text-base rounded-[16px]",
};

export function Button({
  variant = "primary",
  size = "md",
  full = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "cursor-pointer tracking-wide transition-all active:scale-[0.98]",
        variantStyles[variant],
        sizeStyles[size],
        full && "w-full",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

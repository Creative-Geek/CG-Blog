import React from "react";
import { cn } from "~/lib/utils";

interface SectionDividerProps {
  variant?: "default" | "gradient" | "dots" | "wave";
  className?: string;
}

export function SectionDivider({ 
  variant = "default", 
  className 
}: SectionDividerProps) {
  const baseClasses = "w-full my-16 flex items-center justify-center";

  switch (variant) {
    case "gradient":
      return (
        <div className={cn(baseClasses, className)}>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
      );

    case "dots":
      return (
        <div className={cn(baseClasses, className)}>
          <div className="flex space-x-2">
            <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
            <div className="w-2 h-2 rounded-full bg-muted-foreground/50" />
            <div className="w-2 h-2 rounded-full bg-accent-primary" />
            <div className="w-2 h-2 rounded-full bg-muted-foreground/50" />
            <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
          </div>
        </div>
      );

    case "wave":
      return (
        <div className={cn(baseClasses, className)}>
          <svg
            width="100"
            height="20"
            viewBox="0 0 100 20"
            fill="none"
            className="text-accent-primary"
          >
            <path
              d="M0 10 Q25 0 50 10 T100 10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              opacity="0.6"
            />
          </svg>
        </div>
      );

    default:
      return (
        <div className={cn(baseClasses, className)}>
          <div className="flex items-center w-full max-w-md">
            <div className="flex-1 h-px bg-border" />
            <div className="mx-4">
              <div className="w-3 h-3 rounded-full bg-accent-primary/20 border-2 border-accent-primary/40" />
            </div>
            <div className="flex-1 h-px bg-border" />
          </div>
        </div>
      );
  }
}

// Alternative decorative divider with more visual interest
export function DecorativeDivider({ className }: { className?: string }) {
  return (
    <div className={cn("w-full my-20 flex items-center justify-center", className)}>
      <div className="relative">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-accent-primary/10 blur-xl rounded-full w-32 h-8" />
        
        {/* Main decorative element */}
        <div className="relative flex items-center space-x-3">
          <div className="w-8 h-px bg-gradient-to-r from-transparent to-accent-primary/50" />
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-primary/40" />
            <div className="w-2 h-2 rounded-full bg-accent-primary/60" />
            <div className="w-3 h-3 rounded-full bg-accent-primary" />
            <div className="w-2 h-2 rounded-full bg-accent-primary/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-accent-primary/40" />
          </div>
          <div className="w-8 h-px bg-gradient-to-l from-transparent to-accent-primary/50" />
        </div>
      </div>
    </div>
  );
}

// Simple but elegant divider for minimal designs
export function MinimalDivider({ className }: { className?: string }) {
  return (
    <div className={cn("w-full my-16", className)}>
      <div className="w-24 h-px bg-accent-primary/30 mx-auto" />
    </div>
  );
}

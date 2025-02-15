import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import React from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function startsWithArabic(text: string): boolean {
  if (!text) return false;
  // Arabic Unicode range: \u0600-\u06FF
  const arabicPattern = /^[\u0600-\u06FF]/;
  return arabicPattern.test(text.trim());
}

// Recursive helper function to check for Arabic characters in any nested text.
export function containsArabic(node: React.ReactNode): boolean {
  const arabicPattern = /[\u0600-\u06FF]/;
  let found = false;

  React.Children.forEach(node, (child) => {
    if (typeof child === "string") {
      if (arabicPattern.test(child)) {
        found = true;
      }
      // @ts-ignore
    } else if (React.isValidElement(child) && child.props.children) {
      // @ts-ignore
      if (containsArabic(child.props.children)) {
        found = true;
      }
    }
  });

  return found;
}

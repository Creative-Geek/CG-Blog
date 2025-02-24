import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import React from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper to extract text from React nodes
export function extractText(node: React.ReactNode): string {
  let result = "";
  React.Children.forEach(node, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      result += child;
    } else if (React.isValidElement(child)) {
      const element = child as React.ReactElement<any>; // Add <any> to specify the type of props
      result += extractText(element.props.children);
    }
  });
  return result;
}

// Updated startsWithArabic to ignore non-lingual characters
export function startsWithArabic(text: string): boolean {
  if (!text) return false;
  const trimmedText = text.trim();
  // Find the first Unicode letter in the string.
  const firstLetterMatch = trimmedText.match(/\p{L}/u);
  if (!firstLetterMatch) return false;
  const firstLetter = firstLetterMatch[0];
  // Arabic Unicode range: \u0600-\u06FF
  const arabicPattern = /^[\u0600-\u06FF]/;
  return arabicPattern.test(firstLetter);
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

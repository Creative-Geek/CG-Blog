import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function startsWithArabic(text: string): boolean {
  if (!text) return false;
  // text = text.replace(/^(#|##|###|####|#####|\*\*|\*|>|\d+\.|-|`|\[|!)/g, "");
  // console.log(text);
  // Arabic Unicode range: \u0600-\u06FF
  const arabicPattern = /^[\u0600-\u06FF]/;
  return arabicPattern.test(text.trim());
}

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const focusInput = [
  // base
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  // ring color
  "focus-visible:ring-ring",
];

export const focusRing = [
  // base
  "outline outline-offset-2 outline-0 focus-visible:outline-2",
  // outline color
  "outline-ring",
];

export const hasErrorInput = [
  // base
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  // ring color
  "focus-visible:ring-destructive",
];

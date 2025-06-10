import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines and merges multiple class names using clsx and tailwind-merge
 * Useful for conditional and dynamic class names in components
 *
 * @example
 * cn('text-red-500', true && 'bg-blue-500', false && 'text-sm')
 * // returns 'text-red-500 bg-blue-500'
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

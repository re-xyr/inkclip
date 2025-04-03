import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function showNumber(n: number): string {
  return String(n).replace('-', '−').replace('Infinity', '∞').replace('NaN', '⁇')
}

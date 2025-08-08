import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function getRiskColor(risk: string): string {
  switch (risk.toLowerCase()) {
    case 'high':
      return 'text-red-500'
    case 'medium':
      return 'text-yellow-500'
    case 'low':
      return 'text-green-500'
    default:
      return 'text-gray-500'
  }
}

export function getRiskBadgeColor(risk: string): string {
  switch (risk.toLowerCase()) {
    case 'high':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'low':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

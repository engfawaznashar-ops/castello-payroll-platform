import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format number as currency in SAR with English numerals
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('SAR', 'ر.س')
}

/**
 * Format number as compact currency (e.g., 1.5K, 2.3M) with English numerals
 */
export function formatCompactCurrency(amount: number): string {
  const formattedAmount = amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}م ر.س`
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}ألف ر.س`
  }
  return `${formattedAmount} ر.س`
}

/**
 * Format number as percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Format date in Arabic locale with English numerals
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const formatted = new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    numberingSystem: 'latn', // Use Latin (English) numerals
  }).format(dateObj)
  return formatted
}

/**
 * Format date as relative time (e.g., "منذ 5 دقائق")
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'منذ لحظات'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `منذ ${diffInMinutes} ${diffInMinutes === 1 ? 'دقيقة' : 'دقائق'}`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `منذ ${diffInHours} ${diffInHours === 1 ? 'ساعة' : 'ساعات'}`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `منذ ${diffInDays} ${diffInDays === 1 ? 'يوم' : 'أيام'}`
  }

  return formatDate(dateObj)
}

/**
 * Convert Arabic numerals to English numerals
 */
export function toEnglishNumbers(str: string): string {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
  const englishNumerals = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  
  return str.replace(/[٠-٩]/g, (match) => {
    const index = arabicNumerals.indexOf(match)
    return englishNumerals[index]
  })
}

/**
 * Generate avatar URL from name
 */
export function generateAvatarUrl(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=eab308&color=fff&size=200&font-size=0.4&bold=true`
}

/**
 * Calculate XP level from total XP
 */
export function calculateLevel(xp: number): { level: number; currentLevelXP: number; nextLevelXP: number; progress: number } {
  // Each level requires 1000 XP
  const xpPerLevel = 1000
  const level = Math.floor(xp / xpPerLevel) + 1
  const currentLevelXP = xp % xpPerLevel
  const nextLevelXP = xpPerLevel
  const progress = (currentLevelXP / nextLevelXP) * 100

  return { level, currentLevelXP, nextLevelXP, progress }
}

/**
 * Get color based on completion percentage
 */
export function getCompletionColor(percentage: number): string {
  if (percentage >= 90) return 'text-green-600'
  if (percentage >= 70) return 'text-castello-gold-600'
  if (percentage >= 50) return 'text-yellow-600'
  return 'text-castello-red-600'
}

/**
 * Get quality score color
 */
export function getQualityColor(score: number): { color: string; bgColor: string; borderColor: string } {
  if (score >= 80) {
    return {
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300',
    }
  }
  if (score >= 60) {
    return {
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-300',
    }
  }
  return {
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
  }
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

/**
 * Delay function for simulating async operations
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Export data to CSV
 */
export function exportToCSV(data: any[], filename: string): void {
  if (!data || data.length === 0) return

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const value = row[header]
      return typeof value === 'string' && value.includes(',') ? `"${value}"` : value
    }).join(','))
  ].join('\n')

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
}


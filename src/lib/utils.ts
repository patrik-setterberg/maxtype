import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import payload from 'payload'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fetchGlobalData = async (slug: string) => {
  const response = await fetch(`/api/globals/${slug}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch global data for ${slug}`)
  }
  return response.json()
}


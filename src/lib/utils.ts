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

// Check for existing username
export const checkUsernameAvailable = async (username: string): Promise<boolean> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/check-username`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username }),
  })

  const data = await response.json()

  if (data.docs.length > 0) {
    return false
  }

  return true
}

// Check for existing username
export const checkEmailAvailable = async (email: string): Promise<boolean> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/check-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })

  const data = await response.json()

  if (data.docs.length > 0) {
    return false
  }

  return true
}

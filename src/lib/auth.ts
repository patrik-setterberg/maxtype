import React from 'react'
import { User } from '@/payload-types'

/**
 * Check if user is authenticated by calling PayloadCMS /api/users/me
 * This works because PayloadCMS automatically includes HTTP-only cookies
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/users/me`, {
      method: 'GET',
      credentials: 'include', // Include HTTP-only cookies
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      const data = await response.json()
      return data.user || null
    }
    
    return null
  } catch (error) {
    console.error('Error checking auth status:', error)
    return null
  }
}

/**
 * Logout user using PayloadCMS built-in logout
 */
export async function logoutUser(): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/users/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return response.ok
  } catch (error) {
    console.error('Error logging out:', error)
    return false
  }
}

/**
 * Client-side hook to get current user state
 * Use this in React components
 */
export function useAuth() {
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    getCurrentUser().then((user) => {
      setUser(user)
      setLoading(false)
    })
  }, [])

  const logout = async () => {
    const success = await logoutUser()
    if (success) {
      setUser(null)
      // Redirect to login or home page
      window.location.href = '/login'
    }
    return success
  }

  return { user, loading, logout, isAuthenticated: !!user }
}
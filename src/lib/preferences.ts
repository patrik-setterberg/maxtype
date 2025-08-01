import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './auth'
import { PreferenceSchema, type UserPreferences } from './validation'
import { User } from '@/payload-types'

const STORAGE_KEY = 'maxtype-preferences'

/**
 * Default user preferences matching the database schema
 */
const DEFAULT_PREFERENCES: UserPreferences = {
  language: 'en',
  keyboardLayout: 'qwerty',
  testDuration: '30',
  showKeyboard: true,
  theme: 'system',
}

/**
 * Utility class for managing preference storage operations
 */
export class PreferenceStorage {
  /**
   * Save preferences to localStorage for guest users
   */
  static saveToLocalStorage(preferences: UserPreferences): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
    } catch (error) {
      console.warn('Failed to save preferences to localStorage:', error)
    }
  }

  /**
   * Load preferences from localStorage for guest users
   * Returns null if no preferences found or if parsing fails
   */
  static loadFromLocalStorage(): UserPreferences | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return null

      const parsed = JSON.parse(stored)

      // Validate the stored preferences
      if (this.isValidPreferences(parsed)) {
        return parsed
      }

      // If stored preferences are invalid, clear them
      this.clearLocalStorage()
      return null
    } catch (error) {
      console.warn('Failed to load preferences from localStorage:', error)
      this.clearLocalStorage()
      return null
    }
  }

  /**
   * Clear preferences from localStorage
   */
  static clearLocalStorage(): void {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.warn('Failed to clear preferences from localStorage:', error)
    }
  }

  /**
   * Get default preferences
   */
  static getDefaults(): UserPreferences {
    return { ...DEFAULT_PREFERENCES }
  }

  /**
   * Validate if an object matches the preferences schema
   */
  static isValidPreferences(obj: unknown): obj is UserPreferences {
    try {
      PreferenceSchema.parse(obj)
      return true
    } catch {
      return false
    }
  }

  /**
   * Check if preferences are the default values
   * Used to determine if guest preferences should be migrated to new users
   */
  static areDefaultPreferences(preferences: UserPreferences): boolean {
    return (
      preferences.language === DEFAULT_PREFERENCES.language &&
      preferences.keyboardLayout === DEFAULT_PREFERENCES.keyboardLayout &&
      preferences.testDuration === DEFAULT_PREFERENCES.testDuration &&
      preferences.showKeyboard === DEFAULT_PREFERENCES.showKeyboard &&
      preferences.theme === DEFAULT_PREFERENCES.theme
    )
  }
}

/**
 * Hook for managing user preferences with automatic guest/authenticated user handling
 */
export function usePreferences() {
  const { user, loading: authLoading } = useAuth()
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [initialized, setInitialized] = useState<boolean>(false)
  const isGuest = !user

  // Initialize preferences when auth state is determined
  useEffect(() => {
    if (authLoading) return

    if (user) {
      // Authenticated user - use database preferences
      setPreferences(user.preferences)

      // Check for guest preferences to migrate
      const guestPreferences = PreferenceStorage.loadFromLocalStorage()
      if (guestPreferences && PreferenceStorage.areDefaultPreferences(user.preferences)) {
        // User has default preferences but guest has custom ones - migrate
        migrateGuestPreferences(user, guestPreferences)
      } else {
        // Clear any existing guest preferences
        PreferenceStorage.clearLocalStorage()
      }
    } else {
      // Guest user - load from localStorage or use defaults
      const storedPreferences = PreferenceStorage.loadFromLocalStorage()
      setPreferences(storedPreferences || DEFAULT_PREFERENCES)
    }

    setInitialized(true)
  }, [user, authLoading])

  /**
   * Migrate guest preferences to authenticated user
   */
  const migrateGuestPreferences = async (authenticatedUser: User, guestPrefs: UserPreferences) => {
    try {
      setLoading(true)

      // Update user preferences in database
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CMS_URL || ''}/api/users/${authenticatedUser.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            preferences: guestPrefs,
          }),
        },
      )

      if (!response.ok) {
        throw new Error(`Failed to migrate preferences: ${response.status}`)
      }

      const { doc: updatedUser } = await response.json()

      // Update local state with migrated preferences
      setPreferences(updatedUser.preferences)

      // Clear guest preferences
      PreferenceStorage.clearLocalStorage()
    } catch (error) {
      console.error('Failed to migrate guest preferences:', error)
      // On migration failure, still clear localStorage to avoid confusion
      PreferenceStorage.clearLocalStorage()
      // Keep the user's original database preferences on migration failure
    } finally {
      setLoading(false)
    }
  }

  /**
   * Update preferences (handles both guest and authenticated users)
   */
  const updatePreferences = useCallback(
    async (newPreferences: UserPreferences) => {
      // Validate preferences first - this will throw if invalid
      const validatedPreferences = PreferenceSchema.parse(newPreferences)

      try {
        setLoading(true)

        if (user) {
          // Authenticated user - update via PayloadCMS API using standard REST endpoint
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_CMS_URL || ''}/api/users/${user.id}`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                preferences: validatedPreferences,
              }),
            },
          )

          if (!response.ok) {
            throw new Error(`Failed to update preferences: ${response.status}`)
          }

          const responseData = await response.json()

          // PayloadCMS might return the user directly or wrapped in { doc }
          const updatedUser = responseData.doc || responseData

          setPreferences(updatedUser.preferences)
        } else {
          // Guest user - save to localStorage
          PreferenceStorage.saveToLocalStorage(validatedPreferences)
          setPreferences(validatedPreferences)
        }
      } catch (error) {
        console.error('Failed to update preferences:', error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [user],
  )

  /**
   * Reset preferences to defaults
   */
  const resetPreferences = useCallback(async () => {
    await updatePreferences(DEFAULT_PREFERENCES)
  }, [updatePreferences])

  return {
    preferences: preferences || DEFAULT_PREFERENCES,
    isGuest,
    loading: authLoading || loading,
    initialized,
    updatePreferences,
    resetPreferences,
    defaults: DEFAULT_PREFERENCES,
  }
}

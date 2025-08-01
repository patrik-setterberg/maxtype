'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePreferences } from './preferences'

/**
 * Possible theme values
 */
export type Theme = 'light' | 'dark' | 'system'

/**
 * Current applied theme (resolved from system if needed)
 */
export type ResolvedTheme = 'light' | 'dark'

/**
 * Get the current system theme preference
 */
function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'dark' // SSR fallback
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * Resolve a theme preference to an actual theme
 */
function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme === 'system') {
    return getSystemTheme()
  }
  return theme
}

/**
 * Get current theme applied to document (for hydration sync)
 */
function getCurrentAppliedTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'dark'

  const root = window.document.documentElement
  if (root.classList.contains('light')) return 'light'
  if (root.classList.contains('dark')) return 'dark'

  // Fallback to system theme if no class found
  return getSystemTheme()
}

/**
 * Apply theme to document with smooth transitions
 */
function applyTheme(resolvedTheme: ResolvedTheme): void {
  if (typeof window === 'undefined') return

  const root = window.document.documentElement
  const body = window.document.body

  // Add transitioning class for smooth theme change
  body.classList.add('theme-transitioning')

  // Remove existing theme classes
  root.classList.remove('light', 'dark')

  // Add the resolved theme class
  root.classList.add(resolvedTheme)

  // Remove transitioning class after transition completes
  setTimeout(() => {
    body.classList.remove('theme-transitioning')
  }, 200) // 150ms transition + 50ms buffer
}

/**
 * Hook for managing application theme
 * Integrates with user preferences and handles system theme detection
 */
export function useTheme() {
  const {
    preferences,
    updatePreferences,
    loading: preferencesLoading,
    initialized,
  } = usePreferences()

  // Initialize with a consistent value to prevent hydration mismatch
  // The actual theme will be set by the useEffect after hydration
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark')

  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>('dark')

  // Initialize theme from preferences or initial load
  useEffect(() => {
    if (!initialized) return

    // Get current system theme
    const currentSystemTheme = getSystemTheme()
    setSystemTheme(currentSystemTheme)

    // Resolve the user's theme preference
    const resolved = resolveTheme(preferences.theme)

    // For the initial application after hydration, apply theme without transitions
    const currentApplied = getCurrentAppliedTheme()
    if (resolved !== currentApplied) {
      // Use simple class change for initial hydration (no transitions)
      const root = window.document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(resolved)
    }

    setResolvedTheme(resolved)
  }, [preferences.theme, initialized])

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) => {
      const newSystemTheme = e.matches ? 'dark' : 'light'
      setSystemTheme(newSystemTheme)

      // If user has system theme selected, update resolved theme
      if (preferences.theme === 'system') {
        setResolvedTheme(newSystemTheme)
        applyTheme(newSystemTheme)
      }
    }

    // Add listener for system theme changes
    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [preferences.theme])

  /**
   * Set theme preference
   */
  const setTheme = useCallback(
    async (theme: Theme) => {
      try {
        // Apply theme immediately with transitions for user-initiated changes
        const resolved = resolveTheme(theme)
        applyTheme(resolved)
        setResolvedTheme(resolved)

        // Update preferences (this will trigger the useEffect above)
        await updatePreferences({
          ...preferences,
          theme,
        })
      } catch (error) {
        console.error('Failed to update theme preference:', error)
        throw error
      }
    },
    [preferences, updatePreferences],
  )

  return {
    /** Current theme preference ('light' | 'dark' | 'system') */
    theme: preferences.theme,
    /** Currently applied theme ('light' | 'dark') */
    resolvedTheme,
    /** Current system theme preference */
    systemTheme,
    /** Whether theme data is loading */
    loading: preferencesLoading || !initialized,
    /** Set theme preference */
    setTheme,
  }
}

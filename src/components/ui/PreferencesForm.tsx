'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

import { usePreferences } from '@/lib/preferences'
import { type UserPreferences } from '@/lib/validation'
import { PreferenceFormFields } from './PreferenceFormFields'

export function PreferencesForm() {
  const { preferences, updatePreferences, isGuest, loading: hookLoading, resetPreferences, initialized } = usePreferences()
  const [isSubmitting, setIsSubmitting] = useState(false)


  const onSubmit = async (data: UserPreferences) => {
    try {
      setIsSubmitting(true)
      await updatePreferences(data)
    } catch (error) {
      console.error('Failed to update preferences:', error)
      // Form will show validation errors if any
    } finally {
      setIsSubmitting(false)
    }
  }

  const onReset = async () => {
    try {
      setIsSubmitting(true)
      await resetPreferences()
    } catch (error) {
      console.error('Failed to reset preferences:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLoading = hookLoading || isSubmitting

  // Show loading state while auth is being determined or preferences are loading
  if (hookLoading || !initialized) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Preferences</h2>
            <p className="text-muted-foreground">
              Loading your preferences...
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading...
          </div>
        </div>
        <div className="space-y-4 animate-pulse">
          <div className="h-20 bg-muted rounded-lg"></div>
          <div className="h-20 bg-muted rounded-lg"></div>
          <div className="h-20 bg-muted rounded-lg"></div>
          <div className="h-16 bg-muted rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with status indicator */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Preferences</h2>
          <p className="text-muted-foreground">
            Customize your typing test experience
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {isGuest ? (
            <>
              <div className="h-2 w-2 rounded-full bg-orange-500"></div>
              Stored locally
            </>
          ) : (
            <>
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              Synced to account
            </>
          )}
        </div>
      </div>

      {/* Guest user notice */}
      {isGuest && (
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-950">
          <div className="flex items-start gap-3">
            <div className="h-5 w-5 rounded-full bg-orange-500 mt-0.5 flex-shrink-0"></div>
            <div>
              <h3 className="font-medium text-orange-900 dark:text-orange-100">
                Guest Mode
              </h3>
              <p className="text-sm text-orange-700 dark:text-orange-200 mt-1">
                Your preferences are saved locally in your browser. 
                <strong> Sign up or log in</strong> to sync them across devices.
              </p>
            </div>
          </div>
        </div>
      )}

      <PreferenceFormFields
        preferences={preferences}
        onSubmit={onSubmit}
        onReset={onReset}
        isLoading={isLoading}
      />
    </div>
  )
}
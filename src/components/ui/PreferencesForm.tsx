'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

import { usePreferences } from '@/lib/preferences'
import { type UserPreferences } from '@/lib/validation'
import { PreferenceFormFields } from './PreferenceFormFields'
import { MessageAlert } from '@/components/ui/MessageAlert'

export function PreferencesForm() {
  const {
    preferences,
    updatePreferences,
    isGuest,
    loading: hookLoading,
    resetPreferences,
    initialized,
  } = usePreferences()
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
            <p className="text-muted-foreground">Loading your preferences...</p>
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
          <p className="text-muted-foreground">Customize your typing test experience</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {isGuest ? (
            <>
              <div className="h-2 w-2 rounded-full bg-warning"></div>
              Stored locally
            </>
          ) : (
            <>
              <div className="h-2 w-2 rounded-full bg-success"></div>
              Synced to account
            </>
          )}
        </div>
      </div>

      {/* Guest user notice */}
      {isGuest && (
        <MessageAlert
          message="Your preferences are saved locally in your browser. Sign up or log in to sync them across devices."
          type="warning"
        />
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

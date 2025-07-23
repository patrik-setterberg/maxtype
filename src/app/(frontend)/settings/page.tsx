'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth'
import { Settings } from 'lucide-react'

export default function SettingsPage() {
  const { user, loading, isAuthenticated } = useAuth()

  if (loading) {
    return (
      <div className={cn('container mx-auto px-4 py-8')}>
        <div className={cn('text-center')}>
          <p className={cn('text-muted-foreground')}>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('container mx-auto px-4 py-8')}>
      <div className={cn('max-w-2xl mx-auto')}>
        {/* Header */}
        <div className={cn('flex items-center space-x-4 mb-8')}>
          <div className={cn('flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full')}>
            <Settings size={32} className={cn('text-primary')} />
          </div>
          <div>
            <h1 className={cn('text-3xl font-bold')}>Settings</h1>
            <p className={cn('text-muted-foreground')}>
              {isAuthenticated 
                ? 'Your typing test preferences' 
                : 'Configure your typing test preferences (login to save)'
              }
            </p>
          </div>
        </div>

        {/* Authentication Status */}
        {!isAuthenticated && (
          <div className={cn('bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6')}>
            <p className={cn('text-sm text-yellow-800 dark:text-yellow-200')}>
              <strong>Note:</strong> You're not logged in. Changes will be stored locally and won't sync across devices.{' '}
              <a href="/login" className={cn('underline hover:no-underline')}>Log in</a> to save your preferences.
            </p>
          </div>
        )}

        {/* Current Preferences */}
        {isAuthenticated && user?.preferences && (
          <div className={cn('bg-card border rounded-lg p-6 mb-6')}>
            <h2 className={cn('text-xl font-semibold mb-4')}>Current Preferences</h2>
            
            <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-6')}>
              <div>
                <label className={cn('text-sm font-medium text-muted-foreground')}>Language</label>
                <p className={cn('text-lg font-medium capitalize')}>{user.preferences.language}</p>
              </div>
              
              <div>
                <label className={cn('text-sm font-medium text-muted-foreground')}>Keyboard Layout</label>
                <p className={cn('text-lg font-medium uppercase')}>{user.preferences.keyboardLayout}</p>
              </div>
              
              <div>
                <label className={cn('text-sm font-medium text-muted-foreground')}>Test Duration</label>
                <p className={cn('text-lg font-medium')}>{user.preferences.testDuration} seconds</p>
              </div>
              
              <div>
                <label className={cn('text-sm font-medium text-muted-foreground')}>Show Keyboard</label>
                <p className={cn('text-lg font-medium')}>{user.preferences.showKeyboard ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Guest Mode Default Settings */}
        {!isAuthenticated && (
          <div className={cn('bg-card border rounded-lg p-6 mb-6')}>
            <h2 className={cn('text-xl font-semibold mb-4')}>Default Settings</h2>
            <p className={cn('text-muted-foreground mb-4')}>
              These are the default settings for guests. Sign up to customize and save your preferences!
            </p>
            
            <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-6')}>
              <div>
                <label className={cn('text-sm font-medium text-muted-foreground')}>Language</label>
                <p className={cn('text-lg font-medium')}>English</p>
              </div>
              
              <div>
                <label className={cn('text-sm font-medium text-muted-foreground')}>Keyboard Layout</label>
                <p className={cn('text-lg font-medium')}>QWERTY</p>
              </div>
              
              <div>
                <label className={cn('text-sm font-medium text-muted-foreground')}>Test Duration</label>
                <p className={cn('text-lg font-medium')}>30 seconds</p>
              </div>
              
              <div>
                <label className={cn('text-sm font-medium text-muted-foreground')}>Show Keyboard</label>
                <p className={cn('text-lg font-medium')}>Yes</p>
              </div>
            </div>
          </div>
        )}

        {/* Coming Soon Section */}
        <div className={cn('bg-muted/50 border rounded-lg p-6')}>
          <h2 className={cn('text-xl font-semibold mb-2')}>Coming Soon</h2>
          <ul className={cn('text-muted-foreground space-y-1')}>
            <li>• Interactive preference editor</li>
            <li>• Theme customization</li>
            <li>• Sound effects toggle</li>
            <li>• Custom word lists</li>
            <li>• Difficulty settings</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
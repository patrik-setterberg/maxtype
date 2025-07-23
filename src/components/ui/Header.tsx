'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth'

const Header: React.FC = () => {
  const { user, loading, logout, isAuthenticated } = useAuth()
  return (
    <header
      className={cn(
        'border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
      )}
    >
      <div className={cn('max-w-screen-2xl w-full mx-auto flex h-16 items-center px-4')}>
        {/* Logo/Brand */}
        <div className={cn('flex items-center space-x-2')}>
          <a
            href="/"
            className={cn(
              'flex items-center space-x-2 text-2xl font-bold text-primary hover:text-primary/80 transition-colors',
            )}
          >
            <div
              className={cn(
                'flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-lg font-mono text-sm',
              )}
            >
              MT
            </div>
            <span>MaxType</span>
          </a>
        </div>

        {/* Navigation */}
        <nav className={cn('flex items-center space-x-6 ml-auto')}>
          {loading ? (
            // Show loading state
            <div className={cn('text-sm text-muted-foreground')}>Loading...</div>
          ) : isAuthenticated ? (
            // Logged in user navigation
            <>
              <span className={cn('text-sm text-muted-foreground')}>Welcome, {user?.username}</span>
              <a
                href="/profile"
                className={cn(
                  'text-sm font-medium text-muted-foreground hover:text-foreground transition-colors',
                )}
              >
                Profile
              </a>
              <button
                onClick={logout}
                className={cn(
                  'inline-flex items-center justify-center rounded-md text-sm font-medium border border-secondary text-muted-foreground hover:bg-secondary hover:text-white h-9 px-4 py-2 transition-colors cursor-pointer',
                )}
              >
                Sign Out
              </button>
            </>
          ) : (
            // Logged out user navigation
            <>
              <a
                href="/login"
                className={cn(
                  'text-sm font-medium text-muted-foreground hover:text-foreground transition-colors',
                )}
              >
                Login
              </a>
              <a
                href="/signup"
                className={cn(
                  'inline-flex items-center justify-center rounded-md text-sm font-medium border border-primary text-primary hover:bg-secondary hover:text-white h-9 px-4 py-2 transition-colors',
                )}
              >
                Sign Up
              </a>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header

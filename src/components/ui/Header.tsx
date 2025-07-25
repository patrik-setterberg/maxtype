'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth'
import { CircleUserRound, Settings } from 'lucide-react'

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
          <Link
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
          </Link>
        </div>

        {/* Navigation */}
        <nav className={cn('flex items-center space-x-4 ml-auto')}>
          {loading ? (
            // Show loading state
            <div className={cn('text-sm text-muted-foreground')}>Loading...</div>
          ) : isAuthenticated ? (
            // Logged in user navigation
            <>
              <span className={cn('text-sm text-muted-foreground')}>Welcome, {user?.username}</span>
              <Link
                href="/profile"
                className={cn(
                  'flex items-center text-muted-foreground hover:text-foreground transition-colors',
                )}
                title="Profile"
              >
                <CircleUserRound size={20} />
              </Link>
              {/* Settings available to all users */}
              <Link
                href="/settings"
                className={cn(
                  'flex items-center text-muted-foreground hover:text-foreground transition-colors',
                )}
                title="Settings"
              >
                <Settings size={20} />
              </Link>
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
              {/* Settings available to all users */}
              <Link
                href="/settings"
                className={cn(
                  'flex items-center text-muted-foreground hover:text-foreground transition-colors',
                )}
                title="Settings"
              >
                <Settings size={20} />
              </Link>
              <Link
                href="/login"
                className={cn(
                  'text-sm font-medium text-muted-foreground hover:text-foreground transition-colors',
                )}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className={cn(
                  'inline-flex items-center justify-center rounded-md text-sm font-medium border border-primary text-primary hover:bg-secondary hover:text-white h-9 px-4 py-2 transition-colors',
                )}
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header

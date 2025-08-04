'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth'
import { CircleUserRound, LogIn, UserPlus, LogOut, ChartLine } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const UserMenu: React.FC = () => {
  const { user, loading, logout, isAuthenticated } = useAuth()
  const [open, setOpen] = useState(false)

  const handleLinkClick = () => {
    setOpen(false)
  }

  const handleLogout = async () => {
    setOpen(false)
    await logout()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          )}
          aria-label="User menu"
        >
          <CircleUserRound size={20} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0" align="end" sideOffset={8}>
        {loading ? (
          <div className={cn('py-4 px-4 text-sm text-muted-foreground text-center')}>
            Loading...
          </div>
        ) : isAuthenticated ? (
          // Authenticated user menu
          <div>
            {/* User info header */}
            <div className={cn('px-4 py-3 bg-muted/30 border-b border-border')}>
              <div className={cn('flex items-center space-x-3')}>
                <div
                  className={cn(
                    'flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-lg font-bold',
                  )}
                >
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <div className={cn('flex-1 min-w-0')}>
                  <div className={cn('font-medium text-sm truncate')}>{user?.username}</div>
                  <div className={cn('text-xs text-muted-foreground truncate')}>{user?.email}</div>
                </div>
              </div>
            </div>

            {/* Menu items */}
            <div className={cn('py-2')}>
              <Link
                href="/profile"
                onClick={handleLinkClick}
                className={cn(
                  'flex items-center space-x-3 px-4 py-2.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors',
                )}
              >
                <CircleUserRound size={16} className={cn('text-muted-foreground')} />
                <span>Profile</span>
              </Link>

              <Link
                href="/statistics"
                onClick={handleLinkClick}
                className={cn(
                  'flex items-center space-x-3 px-4 py-2.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors',
                )}
              >
                <ChartLine size={16} className={cn('text-muted-foreground')} />
                <span>Statistics</span>
              </Link>

              <div className={cn('border-t border-border mx-2 my-2')} />

              <button
                onClick={handleLogout}
                className={cn(
                  'flex items-center space-x-3 px-4 py-2.5 text-sm hover:bg-destructive/10 hover:text-destructive transition-colors w-full text-left text-destructive',
                )}
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          // Guest user menu
          <div>
            <div className={cn('px-4 py-3 bg-muted/30 border-b border-border')}>
              <div className={cn('text-xs text-muted-foreground mt-1')}>
                Track your progress and store your preferences.
              </div>
            </div>

            <div className={cn('py-2')}>
              <Link
                href="/login"
                onClick={handleLinkClick}
                className={cn(
                  'flex items-center space-x-3 px-4 py-2.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors',
                )}
              >
                <LogIn size={16} className={cn('text-muted-foreground')} />
                <span>Login</span>
              </Link>

              <Link
                href="/signup"
                onClick={handleLinkClick}
                className={cn(
                  'flex items-center space-x-3 px-4 py-2.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors font-medium text-primary',
                )}
              >
                <UserPlus size={16} />
                <span>Sign Up</span>
              </Link>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

export default UserMenu

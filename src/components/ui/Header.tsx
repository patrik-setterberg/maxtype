'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Settings } from 'lucide-react'
import ThemeSelect from './ThemeSelect'
import UserMenu from './UserMenu'

const Header: React.FC = () => {
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
              'flex items-center space-x-2 text-2xl font-bold text-primary hover:text-primary/80',
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
        <nav className={cn('flex items-center space-x-2 ml-auto')}>
          <ThemeSelect />
          <Link
            href="/settings"
            className={cn(
              'flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            )}
            title="Settings"
          >
            <Settings size={20} />
          </Link>
          <UserMenu />
        </nav>
      </div>
    </header>
  )
}

export default Header

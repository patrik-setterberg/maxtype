'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const Footer: React.FC = () => {
  return (
    <footer
      className={cn(
        'border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto',
      )}
    >
      <div
        className={cn(
          'max-w-screen-2xl w-full mx-auto flex items-center justify-between py-6 px-4',
        )}
      >
        {/* Left side - Brand */}
        <div className={cn('flex items-center space-x-2')}>
          <div
            className={cn(
              'flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded font-mono text-xs',
            )}
          >
            MT
          </div>
          <span className={cn('text-sm font-medium text-muted-foreground')}>MaxType</span>
        </div>

        {/* Right side - Links */}
        <div className={cn('flex items-center space-x-6')}>
          <Link
            href="/about"
            className={cn('text-sm text-muted-foreground hover:text-foreground transition-colors')}
          >
            About
          </Link>
          <Link
            href="/privacy"
            className={cn('text-sm text-muted-foreground hover:text-foreground transition-colors')}
          >
            Privacy
          </Link>
          <span className={cn('text-sm text-muted-foreground')}>© 2024 MaxType</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer

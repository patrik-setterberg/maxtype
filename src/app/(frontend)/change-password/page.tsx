'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth'
import ChangePasswordForm from '@/components/ui/ChangePasswordForm'

export default function ChangePasswordPage() {
  const { loading, isAuthenticated } = useAuth()

  if (loading) {
    return (
      <div className={cn('container mx-auto px-4 py-8')}>
        <div className={cn('text-center')}>
          <p className={cn('text-muted-foreground')}>Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className={cn('container mx-auto px-4 py-8')}>
        <div className={cn('text-center')}>
          <h1 className={cn('text-2xl font-bold mb-4')}>Access Denied</h1>
          <p className={cn('text-muted-foreground mb-6')}>
            You need to be logged in to change your password.
          </p>
          <Link
            href="/login"
            className={cn(
              'inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 transition-colors',
            )}
          >
            Log In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('container mx-auto px-4 py-8')}>
      <div className={cn('max-w-md mx-auto')}>
        <ChangePasswordForm />

        <div className={cn('text-center mt-6')}>
          <Link
            href="/profile"
            className="text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80"
          >
            ← Back to Profile
          </Link>
        </div>
      </div>
    </div>
  )
}

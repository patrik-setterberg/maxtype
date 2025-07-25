'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth'
import { CircleUserRound } from 'lucide-react'

export default function ProfilePage() {
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

  if (!isAuthenticated) {
    return (
      <div className={cn('container mx-auto px-4 py-8')}>
        <div className={cn('text-center')}>
          <h1 className={cn('text-2xl font-bold mb-4')}>Access Denied</h1>
          <p className={cn('text-muted-foreground mb-6')}>
            You need to be logged in to view your profile.
          </p>
          <Link 
            href="/login" 
            className={cn('inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 transition-colors')}
          >
            Log In
          </Link>
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
            <CircleUserRound size={32} className={cn('text-primary')} />
          </div>
          <div>
            <h1 className={cn('text-3xl font-bold')}>Profile</h1>
            <p className={cn('text-muted-foreground')}>Your MaxType account</p>
          </div>
        </div>

        {/* User Info */}
        <div className={cn('bg-card border rounded-lg p-6')}>
          <h2 className={cn('text-xl font-semibold mb-4')}>Account Information</h2>
          
          <div className={cn('space-y-4')}>
            <div>
              <label className={cn('text-sm font-medium text-muted-foreground')}>Username</label>
              <p className={cn('text-lg font-medium')}>{user?.username}</p>
            </div>
            
            <div>
              <label className={cn('text-sm font-medium text-muted-foreground')}>Email</label>
              <p className={cn('text-lg')}>{user?.email}</p>
            </div>
            
            <div>
              <label className={cn('text-sm font-medium text-muted-foreground')}>Member Since</label>
              <p className={cn('text-lg')}>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className={cn('bg-muted/50 border rounded-lg p-6 mt-6')}>
          <h2 className={cn('text-xl font-semibold mb-2')}>Coming Soon</h2>
          <ul className={cn('text-muted-foreground space-y-1')}>
            <li>• Typing test statistics</li>
            <li>• Performance analytics</li>
            <li>• Achievement badges</li>
            <li>• Progress tracking</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
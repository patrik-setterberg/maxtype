'use client'

import React, { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'

export default function DeleteAccountButton() {
  const { user } = useAuth()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDeleteAccount = async () => {
    if (!user?.id) {
      setError('User not found')
      return
    }

    setIsDeleting(true)
    setError(null)

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include auth cookies
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || 'Failed to delete account')
      }

      // Account deleted successfully
      // Since the user no longer exists, we can't call the normal logout API
      // Instead, we'll directly redirect and let the page refresh clear the auth state
      window.location.href = '/'

      // Optional: Show success message (though user won't see it after redirect)
      // You could store this in localStorage and show it on the home page
    } catch (err) {
      console.error('Error deleting account:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete account')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className={cn('text-sm w-40 py-2 cursor-pointer')}>
          <Trash2 className="w-4 h-4" />
          Delete Account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Account</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete your account? This action is permanent and cannot be
            undone.
            <br />
            <br />
            <strong>All your data will be permanently deleted, including:</strong>
            <br />
            • Your profile information
            <br />
            • Your typing test preferences
            <br />• Any future typing statistics (once implemented)
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <div className={cn('text-sm text-destructive bg-destructive/10 p-3 rounded-md')}>
            {error}
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Account'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

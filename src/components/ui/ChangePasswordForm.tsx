'use client'

import React, { useCallback, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import Link from 'next/link'

import { cn, getAuthErrorMessage } from '@/lib/utils'
import { ChangePasswordSchema, type ChangePasswordFormData } from '@/lib/validation'
import { useAuth } from '@/lib/auth'

import { Button } from '@/components/ui/Button'
import { Loader } from '@/components/ui/Loader'
import { MessageAlert } from '@/components/ui/MessageAlert'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const ChangePasswordForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)

  const { user } = useAuth()

  const defaultVals: ChangePasswordFormData = {
    currentPassword: '',
    newPassword: '',
    'newPassword-repeat': '',
  }

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: defaultVals,
  })

  const onSubmit = useCallback(
    async (data: ChangePasswordFormData) => {
      if (!user?.id) {
        setError('You must be logged in to change your password.')
        return
      }

      setError(null)
      setLoading(true)

      try {
        // Step 1: Verify current password by attempting to login
        const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/users/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            username: user.username,
            password: data.currentPassword,
          }),
        })

        if (!loginResponse.ok) {
          const loginErrorData = await loginResponse.json()
          const errorMessage = getAuthErrorMessage(
            loginResponse.status,
            loginErrorData,
            'change-password',
          )
          setError(errorMessage)
          setLoading(false)
          return
        }

        // Step 2: If current password is correct, update to new password
        const updateResponse = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_URL}/api/users/${user.id}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              password: data.newPassword,
            }),
          },
        )

        const updateResponseData = await updateResponse.json()

        if (!updateResponse.ok) {
          const errorMessage = getAuthErrorMessage(
            updateResponse.status,
            updateResponseData,
            'change-password',
          )
          setError(errorMessage)
          setLoading(false)
          return
        }

        setLoading(false)
        setSuccess(true)
      } catch (error) {
        console.error('Change password error:', error)
        setError('An unexpected error occurred. Please try again later.')
        setLoading(false)
      }
    },
    [user?.id, user?.username],
  )

  if (success) {
    return (
      <section className={cn('max-w-md mx-auto relative')}>
        <h1 className={cn('text-2xl font-semibold mb-2')}>Password Changed Successfully!</h1>

        <MessageAlert
          message="Your password has been changed successfully. You can now use your new password to log in."
          type="success"
        />

        <div className={cn('text-center mt-6')}>
          <Link
            href="/profile"
            className={cn(
              'inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 transition-colors',
            )}
          >
            Back to Profile
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className={cn('max-w-md mx-auto relative')}>
      <h1 className={cn('text-2xl font-semibold mb-2')}>Change Password</h1>
      <p>Enter your current password and choose a new password.</p>

      {error && <MessageAlert message={error} type="error" />}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={cn('grid gap-4 mt-8')}>
          {/* Current Password Field */}
          <FormField
            name="currentPassword"
            control={form.control}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className={cn('text-foreground!')}>Current Password</FormLabel>
                <FormControl>
                  <Input
                    {...formField}
                    type="password"
                    className="rounded-sm"
                    placeholder="Enter your current password"
                  />
                </FormControl>
                <FormMessage className="mt-0!" />
              </FormItem>
            )}
          />

          {/* New Password Field */}
          <FormField
            name="newPassword"
            control={form.control}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className={cn('text-foreground!')}>New Password</FormLabel>
                <FormControl>
                  <Input
                    {...formField}
                    type="password"
                    className="rounded-sm"
                    placeholder="Enter your new password"
                  />
                </FormControl>
                <FormMessage className="mt-0!" />
              </FormItem>
            )}
          />

          {/* Confirm New Password Field */}
          <FormField
            name="newPassword-repeat"
            control={form.control}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className={cn('text-foreground!')}>Confirm New Password</FormLabel>
                <FormControl>
                  <Input
                    {...formField}
                    type="password"
                    className="rounded-sm"
                    placeholder="Confirm your new password"
                  />
                </FormControl>
                <FormMessage className="mt-0!" />
              </FormItem>
            )}
          />

          <Button type="submit" className={cn('cursor-pointer mt-4')}>
            Change Password
          </Button>
        </form>
        <Loader show={loading} />
      </Form>
    </section>
  )
}

export default ChangePasswordForm

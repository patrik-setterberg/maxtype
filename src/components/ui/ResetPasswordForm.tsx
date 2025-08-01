'use client'

import React, { useCallback, useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'

import { cn, getAuthErrorMessage } from '@/lib/utils'
import { ResetPasswordSchema, type ResetPasswordFormData } from '@/lib/validation'

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

const ResetPasswordForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setTokenValid(false)
      setError('No reset token provided. Please request a new password reset.')
    } else {
      setTokenValid(true)
    }
  }, [token])

  const defaultVals: ResetPasswordFormData = {
    password: '',
    'password-repeat': '',
  }

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: defaultVals,
  })

  const onSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      if (!token) {
        setError('No reset token provided. Please request a new password reset.')
        return
      }

      setError(null)
      setSuccess(false)
      setLoading(true)

      try {
        // Use PayloadCMS built-in reset password endpoint
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_URL}/api/users/reset-password`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              token: token,
              password: data.password,
            }),
          },
        )

        const responseData = await response.json()

        if (!response.ok) {
          const errorMessage = getAuthErrorMessage(response.status, responseData, 'reset-password')
          setError(errorMessage)
          setLoading(false)
          return
        }

        setLoading(false)
        setSuccess(true)

        // Redirect to login page after 3 seconds
        setTimeout(() => {
          router.push('/login?reset=true')
        }, 3000)
      } catch (error) {
        console.error('Reset password error:', error)
        setError('An unexpected error occurred. Please try again later.')
        setSuccess(false)
        setLoading(false)
      }
    },
    [token, router],
  )

  // If token is invalid, show error state
  if (tokenValid === false) {
    return (
      <section className={cn('max-w-md mx-auto relative')}>
        <h1 className={cn('text-2xl font-semibold mb-2')}>Invalid Reset Link</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
          <div className="flex items-start space-x-3">
            <svg
              className="flex-shrink-0 h-5 w-5 text-red-400 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-sm text-red-700">
              <p>
                <strong>Invalid or missing reset token.</strong> This password reset link appears to
                be invalid or has expired.
              </p>
              <p className="mt-2">Please request a new password reset to continue.</p>
            </div>
          </div>
        </div>
        <div className={cn('text-center mt-6')}>
          <Link
            href="/forgot-password"
            className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
          >
            Request new password reset
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className={cn('max-w-md mx-auto relative')}>
      {success ? (
        <>
          <h1 className={cn('text-2xl font-semibold mb-2')}>Password Reset Successful!</h1>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <div className="flex items-start space-x-3">
              <svg
                className="flex-shrink-0 h-5 w-5 text-green-400 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="text-sm text-green-700">
                <p>
                  <strong>Your password has been reset successfully!</strong> You can now log in
                  with your new password.
                </p>
                <p className="mt-2">Redirecting you to the login page in a few seconds...</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <h1 className={cn('text-2xl font-semibold mb-2')}>Reset Your Password</h1>
          <p>Enter your new password below to complete the password reset process.</p>

          {error && <MessageAlert message={error} type="error" />}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={cn('grid gap-4 mt-8')}>
              {/* Password Field */}
              <FormField
                name="password"
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

              {/* Confirm Password Field */}
              <FormField
                name="password-repeat"
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
                Reset Password
              </Button>
            </form>
            <Loader show={loading} />
          </Form>

          <div className={cn('text-center mt-6')}>
            <p className="text-sm text-muted-foreground">
              Remember your password?{' '}
              <Link
                href="/login"
                className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
              >
                Back to login
              </Link>
            </p>
          </div>
        </>
      )}
    </section>
  )
}

export default ResetPasswordForm

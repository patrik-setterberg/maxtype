'use client'

import React, { useCallback, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import Link from 'next/link'

import { cn, isEmailInput, getAuthErrorMessage } from '@/lib/utils'
import { ForgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validation'

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

const ForgotPasswordForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const defaultVals: ForgotPasswordFormData = {
    usernameOrEmail: '',
  }

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: defaultVals,
  })

  const onSubmit = useCallback(async (data: ForgotPasswordFormData) => {
    setError(null)
    setSuccess(false)
    setLoading(true)

    const isEmail = isEmailInput(data.usernameOrEmail)
    const payload = isEmail ? { email: data.usernameOrEmail } : { username: data.usernameOrEmail }

    try {
      console.log('Forgot password request:', data)

      // Use PayloadCMS built-in forgot password endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/users/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const responseData = await response.json()

      console.log('Forgot password response:', {
        status: response.status,
        response: responseData,
      })

      if (!response.ok) {
        const errorMessage = getAuthErrorMessage(response.status, responseData, 'forgot-password')
        setError(errorMessage)
        setLoading(false)
        return
      }

      setLoading(false)
      setSuccess(true)
    } catch (error) {
      console.error('Forgot password error:', error)
      setError('An unexpected error occurred. Please try again later.')
      setSuccess(false)
      setLoading(false)
    }
  }, [])

  return (
    <section className={cn('max-w-md mx-auto relative')}>
      {success ? (
        <>
          <h1 className={cn('text-2xl font-semibold mb-2')}>Check Your Email</h1>
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
                  <strong>Password reset email sent!</strong> If an account with that username or
                  email exists, we&apos;ve sent a reset link to the registered email address.
                </p>
                <p className="mt-2">
                  Check your email and click the link to reset your password. The link will expire
                  in 1 hour.
                </p>
              </div>
            </div>
          </div>
          <div className={cn('text-center mt-6')}>
            <Link
              href="/login"
              className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
            >
              Return to login
            </Link>
          </div>
        </>
      ) : (
        <>
          <h1 className={cn('text-2xl font-semibold mb-2')}>Forgot Your Password?</h1>
          <p>
            Enter your username or email and we&apos;ll send a password reset link to your
            registered email address.
          </p>

          {error && <MessageAlert message={error} type="error" />}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={cn('grid gap-4 mt-8')}>
              {/* Username or Email Field */}
              <FormField
                name="usernameOrEmail"
                control={form.control}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel className={cn('text-foreground!')}>Username or Email</FormLabel>
                    <FormControl>
                      <Input
                        {...formField}
                        type="text"
                        className="rounded-sm"
                        placeholder="Enter your username or email"
                      />
                    </FormControl>
                    <FormMessage className="mt-0!" />
                  </FormItem>
                )}
              />

              <Button type="submit" className={cn('cursor-pointer mt-4')}>
                Send Reset Link
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

export default ForgotPasswordForm

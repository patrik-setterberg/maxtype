'use client'

import React, { useCallback, useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import { cn, getAuthErrorMessage } from '@/lib/utils'
import { LoginSchema, type LoginFormData } from '@/lib/validation'

import { Button } from '@/components/ui/Button'
import { Loader } from '@/components/ui/Loader'
import { ErrorAlert } from '@/components/ui/ErrorAlert'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const LoginForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [verificationSuccess, setVerificationSuccess] = useState<boolean>(false)
  const [passwordResetSuccess, setPasswordResetSuccess] = useState<boolean>(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if user just verified their email
    if (searchParams.get('verified') === 'true') {
      setVerificationSuccess(true)
    }
    // Check if user just reset their password
    if (searchParams.get('reset') === 'true') {
      setPasswordResetSuccess(true)
    }
  }, [searchParams])

  // Use our tested validation schema instead of dynamic generation
  const defaultVals: LoginFormData = {
    username: '',
    password: '',
  }

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: defaultVals,
  })

  const loginOnSubmit = useCallback(async (data: LoginFormData) => {
    setError(null)
    setSuccess(false)
    setLoading(true)

    try {
      // Simple username-only login
      const requestBody = {
        username: data.username,
        password: data.password,
      }

      // Debug logging
      console.log('Login attempt:', {
        username: data.username,
        requestBody,
      })

      // Use PayloadCMS built-in login endpoint
      const loginReq = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important: includes cookies in request
        body: JSON.stringify(requestBody),
      })

      const loginResponse = await loginReq.json()

      // Debug logging for response
      console.log('Login response:', {
        status: loginReq.status,
        response: loginResponse,
      })

      if (!loginReq.ok) {
        const errorMessage = getAuthErrorMessage(loginReq.status, loginResponse, 'login')
        setError(errorMessage)
        setLoading(false)
        return
      }

      setLoading(false)
      setSuccess(true)

      // PayloadCMS automatically sets HTTP-only cookies
      // Redirect to main app after successful login
      setTimeout(() => {
        window.location.href = '/'
      }, 2000)
    } catch (error) {
      console.error('Login error:', error)
      setError('An unexpected error occurred. Please try again later.')
      setSuccess(false)
      setLoading(false)
    }
  }, [])

  return (
    <section className={cn('max-w-md mx-auto relative')}>
      {success ? (
        <>
          <h1>Login Successful!</h1>
          <p>Welcome back! You are now logged in.</p>
        </>
      ) : (
        <>
          <h1 className={cn('text-2xl font-semibold mb-2')}>Log in</h1>
          <p>Enter your username or email and password to log in.</p>

          {verificationSuccess && (
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
                    <strong>Email verified successfully!</strong> You can now log in to your
                    account.
                  </p>
                </div>
              </div>
            </div>
          )}

          {passwordResetSuccess && (
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
                    <strong>Password reset successfully!</strong> You can now log in with your new password.
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <ErrorAlert error={error} />
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(loginOnSubmit)} className={cn('grid gap-4 mt-8')}>
              {/* Username Field */}
              <FormField
                name="username"
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

              {/* Password Field */}
              <FormField
                name="password"
                control={form.control}
                render={({ field: formField }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className={cn('text-foreground!')}>Password</FormLabel>
                      <Link
                        href="/forgot-password"
                        className="text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        {...formField}
                        type="password"
                        className="rounded-sm"
                        placeholder="Enter your password"
                      />
                    </FormControl>
                    <FormMessage className="mt-0!" />
                  </FormItem>
                )}
              />

              <Button type="submit" className={cn('cursor-pointer mt-4')}>
                Log In
              </Button>
            </form>
            <Loader show={loading} />
          </Form>
          <div className={cn('text-center mt-6')}>
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </>
      )}
    </section>
  )
}

export default LoginForm

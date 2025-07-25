'use client'

import React, { useCallback, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import Link from 'next/link'

import { cn } from '@/lib/utils'
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

  // Use our tested validation schema instead of dynamic generation
  const defaultVals: LoginFormData = {
    email: '',
    password: '',
  }

  const theform = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: defaultVals,
  })

  const loginOnSubmit = useCallback(
    async (data: LoginFormData) => {
      setError(null)
      setSuccess(false)
      setLoading(true)

      try {
        // Use PayloadCMS built-in login endpoint
        const loginReq = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/users/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Important: includes cookies in request
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        })

        const loginResponse = await loginReq.json()

        if (!loginReq.ok) {
          setError(loginResponse.message || 'Login failed. Please check your credentials.')
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
    },
    [],
  )

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
          <p>Enter your email address and password to log in.</p>
          {error && (
            <ErrorAlert error={'An error occurred. Review the fields below and try again.'} />
          )}
          <Form {...theform}>
            <form onSubmit={theform.handleSubmit(loginOnSubmit)} className={cn('grid gap-4 mt-8')}>
              {/* Email Field */}
              <FormField
                name="email"
                control={theform.control}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel className={cn('text-foreground!')}>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...formField}
                        type="email"
                        className="rounded-sm"
                        placeholder="Enter your email"
                      />
                    </FormControl>
                    <FormMessage className="mt-0!" />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                name="password"
                control={theform.control}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel className={cn('text-foreground!')}>Password</FormLabel>
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

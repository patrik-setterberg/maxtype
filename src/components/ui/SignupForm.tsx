'use client'

import React, { useCallback, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { SignupSchema, type SignupFormData } from '@/lib/validation'

import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/checkbox'
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

const SignupForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // Use our tested validation schema
  const defaultVals: SignupFormData = {
    username: '',
    email: '', 
    password: '',
    'password-repeat': '',
    consent: false,
  }

  const form = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema),
    defaultValues: defaultVals,
  })

  const signupOnSubmit = useCallback(
    async (data: SignupFormData) => {
      setError(null)
      setSuccess(false)
      setLoading(true)

      // Destructure for future use if needed
      // const { username, email } = data

      try {
        // Use PayloadCMS built-in user creation endpoint
        const newUserReq = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            username: data.username,
            email: data.email,
            password: data.password,
            preferences: {
              language: 'en',
              keyboardLayout: 'qwerty',
              testDuration: '30',
              showKeyboard: true,
            },
          }),
        })

        const response = await newUserReq.json()

        if (!newUserReq.ok) {
          
          // Handle PayloadCMS validation errors
          if (response.errors && Array.isArray(response.errors)) {
            let hasFieldErrors = false
            
            response.errors.forEach((error: any) => {
              // Check for nested validation errors in error.data.errors
              if (error.data && error.data.errors && Array.isArray(error.data.errors)) {
                error.data.errors.forEach((fieldError: { path: string; message: string }) => {
                  if (fieldError.path && fieldError.path in form.getValues()) {
                    let userFriendlyMessage = fieldError.message
                    
                    // Make error messages more user-friendly
                    if (fieldError.path === 'email' && fieldError.message.includes('already registered')) {
                      userFriendlyMessage = 'This email address is already registered. Please use a different email or try logging in.'
                    } else if (fieldError.path === 'username' && (fieldError.message.includes('unique') || fieldError.message.includes('already'))) {
                      userFriendlyMessage = 'This username is already taken. Please choose a different username.'
                    }
                    
                    form.setError(fieldError.path as keyof SignupFormData, {
                      type: 'manual',
                      message: userFriendlyMessage,
                    })
                    hasFieldErrors = true
                  }
                })
              }
              // Handle direct field errors (legacy format)
              else if (error.field && error.field in form.getValues()) {
                form.setError(error.field as keyof SignupFormData, {
                  type: 'manual',
                  message: error.message,
                })
                hasFieldErrors = true
              }
            })
            
            if (hasFieldErrors) {
              setError('Please check the fields below and try again.')
            } else {
              // If no field-specific errors, show general error
              setError(response.errors[0]?.message || response.message || 'An error occurred during signup.')
            }
          } else {
            // Handle single error messages (fallback)
            const errorMessage = response.message || 'An error occurred during signup.'
            setError(errorMessage)
          }
          setLoading(false)
          return
        }

        setLoading(false)
        setSuccess(true)
      } catch (error) {
        console.error('Error:', error)
        setError('An unexpected error occurred. Please try again later.')
        setSuccess(false)
        setLoading(false)
      }
    },
    [form],
  )

  return (
    <section className={cn('max-w-md mx-auto relative')}>
      {success ? (
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Check Your Email!</h1>
          <div className="space-y-2">
            <p className="text-gray-600">
              We've sent a verification email to your address. Please check your inbox and click the verification link to activate your account.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <div className="flex items-start space-x-3">
                <svg className="flex-shrink-0 h-5 w-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-blue-700">
                  <p><strong>Important:</strong> You won't be able to log in until you verify your email address. If you don't see the email, check your spam folder.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-4">
            <Link href="/" className="text-sm text-blue-600 hover:text-blue-500 underline">
              Return to homepage
            </Link>
          </div>
        </div>
      ) : (
        <>
          <h1 className={cn('text-2xl font-semibold mb-2')}>Create account</h1>
          <p>Fill out the form below to create an account.</p>
          {error && (
            <ErrorAlert error={'An error occurred. Review the fields below and try again.'} />
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(signupOnSubmit)} className={cn('grid gap-4 mt-8')}>
              {/* Username Field */}
              <FormField
                name="username"
                control={form.control}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel className={cn('text-foreground!')}>Username</FormLabel>
                    <FormControl>
                      <Input
                        {...formField}
                        type="text"
                        className="rounded-sm"
                        placeholder="Enter your username"
                      />
                    </FormControl>
                    <FormMessage className="mt-0!" />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                name="email"
                control={form.control}
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
                control={form.control}
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

              {/* Confirm Password Field */}
              <FormField
                name="password-repeat"
                control={form.control}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel className={cn('text-foreground!')}>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        {...formField}
                        type="password"
                        className="rounded-sm"
                        placeholder="Confirm your password"
                      />
                    </FormControl>
                    <FormMessage className="mt-0!" />
                  </FormItem>
                )}
              />

              {/* Consent Checkbox */}
              <FormField
                name="consent"
                control={form.control}
                render={({ field: formField, fieldState: { error } }) => (
                  <FormItem className="items-top flex flex-wrap space-x-2">
                    <Checkbox
                      checked={formField.value === true}
                      onCheckedChange={(checked) => formField.onChange(checked)}
                      className="cursor-pointer"
                      id="privacy-policy-consent"
                      aria-invalid={!!error}
                      name={formField.name}
                      onBlur={formField.onBlur}
                      ref={formField.ref}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="privacy-policy-consent"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I agree to the terms and privacy policy
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Read the{' '}
                        <Link className="underline underline-offset-2" href="/privacy">
                          privacy policy
                        </Link>
                      </p>
                    </div>
                    <FormMessage className="basis-full mt-0!" />
                  </FormItem>
                )}
              />

              <Button type="submit" className={cn('cursor-pointer mt-4')}>
                Create Account
              </Button>
            </form>
            <Loader show={loading} />
          </Form>
        </>
      )}
    </section>
  )
}

export default SignupForm

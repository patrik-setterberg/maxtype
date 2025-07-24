'use client'

import React, { useCallback, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { cn } from '@/lib/utils'
import { SignupSchema, type SignupFormData } from '@/lib/validation'

import { FormProps } from './DynamicForm'
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

const SignupForm: React.FC<FormProps> = ({ form }) => {
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

  const theform = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema),
    defaultValues: defaultVals,
  })

  const signupOnSubmit = useCallback(
    async (data: SignupFormData) => {
      setError(null)
      setSuccess(false)
      setLoading(true)

      const { username, email } = data

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
            response.errors.forEach((error: any) => {
              if (error.field) {
                theform.setError(error.field, {
                  type: 'manual',
                  message: error.message,
                })
              }
            })
            setError('Please check the fields below and try again.')
          } else {
            setError(response.message || 'An error occurred during signup.')
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
    [],
  )

  return (
    <section className={cn('max-w-md mx-auto relative')}>
      {success ? (
        <>
          <h1>Success!</h1>
          <p>Thanks for signing up. Proceed to LOGIN PAGE to login.</p>
        </>
      ) : (
        <>
          <h1 className={cn('text-2xl font-semibold mb-2')}>Create account</h1>
          <p>Fill out the form below to create an account.</p>
          {error && (
            <ErrorAlert error={'An error occurred. Review the fields below and try again.'} />
          )}
          <Form {...theform}>
            <form onSubmit={theform.handleSubmit(signupOnSubmit)} className={cn('grid gap-4 mt-8')}>
              {/* Username Field */}
              <FormField
                name="username"
                control={theform.control}
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

              {/* Confirm Password Field */}
              <FormField
                name="password-repeat"
                control={theform.control}
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
                control={theform.control}
                render={({ field: formField, fieldState: { error } }) => (
                  <FormItem className="items-top flex flex-wrap space-x-2">
                    <Checkbox
                      {...formField}
                      checked={formField.value === true}
                      onCheckedChange={(checked) => formField.onChange(checked)}
                      className="cursor-pointer"
                      id="privacy-policy-consent"
                      aria-invalid={!!error}
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
                        <a className="underline underline-offset-2" href="/privacy">
                          privacy policy
                        </a>
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

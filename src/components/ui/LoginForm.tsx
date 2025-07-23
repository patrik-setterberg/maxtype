'use client'

import React, { useCallback, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { cn } from '@/lib/utils'

import { FormProps } from './DynamicForm'
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

const LoginForm: React.FC<FormProps> = ({ form }) => {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const FormSchema = z.object(
    form.fields.reduce(
      (schema, field) => {
        let fieldSchema: z.ZodTypeAny

        if (field.name === 'email') {
          fieldSchema = z
            .string({
              required_error: `${field.label} is required.`,
            })
            .email({ message: 'Invalid email address.' })
        } else if (field.name === 'password') {
          fieldSchema = z
            .string({
              required_error: `${field.label} is required.`,
            })
            .min(6, { message: `${field.label} must be at least 6 characters.` })
            .max(50, { message: `${field.label} must be at most 50 characters.` })
        } else {
          fieldSchema = z.string()
        }

        schema[field.name] = fieldSchema

        return schema
      },
      {} as Record<string, z.ZodTypeAny>,
    ),
  )

  const defaultVals = form.fields.reduce(
    (values, field) => {
      values[field.name] = ''
      return values
    },
    {} as Record<string, string>,
  )

  const theform = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultVals,
  })

  const loginOnSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
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
              {form.fields.map((field) => {
                if (['text', 'email'].includes(field.blockType))
                  return (
                    <FormField
                      key={field.id}
                      name={field.name}
                      control={theform.control}
                      render={({ field: formField }) => (
                        <FormItem>
                          <FormLabel className={cn('text-foreground!')}>{field.label}</FormLabel>
                          <FormControl>
                            <Input
                              {...formField}
                              type={
                                field.blockType === 'email'
                                  ? 'email'
                                  : field.name === 'password'
                                    ? 'password'
                                    : 'text'
                              }
                              className="rounded-sm"
                            />
                          </FormControl>
                          <FormMessage className="mt-0!" />
                        </FormItem>
                      )}
                    />
                  )
              })}
              <Button type="submit" className={cn('cursor-pointer mt-4')}>
                {form.submitButtonLabel}
              </Button>
            </form>
            <Loader show={loading} />
          </Form>
          <div className={cn('text-center mt-6')}>
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <a 
                href="/signup" 
                className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
              >
                Sign up here
              </a>
            </p>
          </div>
        </>
      )}
    </section>
  )
}

export default LoginForm

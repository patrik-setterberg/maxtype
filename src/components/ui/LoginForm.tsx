'use client'

import React, { useCallback, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

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

      const { email } = data

      try {
        // Create new user
        const newUserReq = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/create-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: data.username,
            email: data.email,
            password: data.password,
          }),
        })

        if (!newUserReq.ok) {
          setError('An unexpected error occurred. Please try again later.')
          setLoading(false)
          throw new Error('Failed to create user')
        }

        // Create form submission
        const formSubmissionData = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/form-submissions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            form: form,
            submissionData: formSubmissionData,
          }),
        })

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
        <>
          <h1>Success!</h1>
          <p>Thanks for signing up. Proceed to LOGIN PAGE to login.</p>
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
        </>
      )}
    </section>
  )
}

export default LoginForm

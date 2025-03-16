'use client'

import React, { useCallback, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { cn, checkEmailAvailable, checkUsernameAvailable } from '@/lib/utils'

import { FormProps } from './DynamicForm'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/checkbox'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

// TODO: LOADER
const SignupForm: React.FC<FormProps> = ({ form }) => {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  const FormSchema = z
    .object(
      form.fields.reduce(
        (schema, field) => {
          let fieldSchema: z.ZodTypeAny

          if (field.name === 'username') {
            fieldSchema = z
              .string({
                required_error: `${field.label} is required.`,
              })
              .min(4, { message: `${field.label} must be at least 4 characters.` })
              .max(20, { message: `${field.label} must be at most 20 characters.` })
              .regex(/^[a-zA-Z0-9_-]+$/, {
                message: `${field.label} must contain only letters, numbers, dashes, or underscores.`,
              })
          } else if (field.name === 'email') {
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
          } else if (field.name === 'consent') {
            fieldSchema = z.boolean().refine((val) => val === true, {
              message: 'You must agree to the terms in the privacy policy.',
            })
          } else {
            fieldSchema = z.string()
          }

          schema[field.name] = fieldSchema

          return schema
        },
        {} as Record<string, z.ZodTypeAny>,
      ),
    )
    .refine((data) => data.password === data['password-repeat'], {
      message: 'Passwords do not match',
      path: ['password-repeat'],
    })

  const defaultVals = form.fields.reduce(
    (values, field) => {
      values[field.name] = field.blockType === 'checkbox' ? false : ''
      return values
    },
    {} as Record<string, string | boolean>,
  )

  const theform = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultVals,
  })

  const signupOnSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      setError(null)
      setSuccess(false)

      const { username, email } = data

      try {
        const isUsernameAvailable = await checkUsernameAvailable(username)

        if (!isUsernameAvailable) {
          setError('Username is not available. Please choose a different username.')
          return
        }

        const isEmailAvailable = await checkEmailAvailable(email)

        if (!isEmailAvailable) {
          setError(
            'An account is already registered with that email address. LOGIN or RECOVER PASSWORD',
          )
          return
        }

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

        setSuccess(true)
      } catch (error) {
        console.error('Error:', error)
        setError('An unexpected error occurred. Please try again later.')
        setSuccess(false)
      }
    },
    [form],
  )

  return (
    <section className={cn('max-w-md mx-auto')}>
      {success ? (
        <>
          <h1>Success!</h1>
          <p>Thanks for signing up. Proceed to LOGIN PAGE to login.</p>
        </>
      ) : (
        <>
          <h1>Sign up</h1>
          <p>Fill out the form below to create an account.</p>
          {error && <div>{error}</div>}
          <Form {...theform}>
            <form onSubmit={theform.handleSubmit(signupOnSubmit)} className={cn('grid gap-4 mt-8')}>
              {form.fields.map((field) => {
                if (['text', 'email'].includes(field.blockType))
                  return (
                    <FormField
                      key={field.id}
                      name={field.name}
                      control={theform.control}
                      render={({ field: formField }) => (
                        <FormItem>
                          <FormLabel>{field.label}</FormLabel>
                          <FormControl>
                            <Input
                              {...formField}
                              type={
                                field.blockType === 'email'
                                  ? 'email'
                                  : ['password', 'password-repeat'].includes(field.name)
                                    ? 'password'
                                    : 'text'
                              }
                            />
                          </FormControl>
                          <FormMessage className="mt-0!" />
                        </FormItem>
                      )}
                    />
                  )
                if (field.blockType === 'checkbox')
                  return (
                    <FormField
                      key={field.id}
                      name={field.name}
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
                              {field.label}
                            </label>
                            <p className="text-sm text-muted-foreground">
                              Read the{' '}
                              <a className="underline underline-offset-2" href="#">
                                privacy policy
                              </a>
                            </p>
                          </div>
                          <FormMessage className="basis-full mt-0!" />
                        </FormItem>
                      )}
                    />
                  )
              })}
              <Button type="submit">{form.submitButtonLabel}</Button>
            </form>
          </Form>
        </>
      )}
    </section>
  )
}

export default SignupForm

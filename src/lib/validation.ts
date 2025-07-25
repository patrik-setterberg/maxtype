import { z } from 'zod'

/**
 * Login form validation schema
 * Used by LoginForm component
 */
export const LoginSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required.',
    })
    .email({ message: 'Invalid email address.' }),
  password: z
    .string({
      required_error: 'Password is required.',
    })
    .min(6, { message: 'Password must be at least 6 characters.' })
    .max(50, { message: 'Password must be at most 50 characters.' }),
})

/**
 * Signup form validation schema
 * Used by SignupForm component
 */
export const SignupSchema = z
  .object({
    username: z
      .string({
        required_error: 'Username is required.',
      })
      .min(3, { message: 'Username must be at least 3 characters.' })
      .max(20, { message: 'Username must be at most 20 characters.' })
      .regex(/^[a-zA-Z0-9_-]+$/, {
        message: 'Username must contain only letters, numbers, dashes, or underscores.',
      }),
    email: z
      .string({
        required_error: 'Email is required.',
      })
      .email({ message: 'Invalid email address.' }),
    password: z
      .string({
        required_error: 'Password is required.',
      })
      .min(6, { message: 'Password must be at least 6 characters.' })
      .max(50, { message: 'Password must be at most 50 characters.' }),
    'password-repeat': z
      .string({
        required_error: 'Password confirmation is required.',
      }),
    consent: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the terms in the privacy policy.',
    }),
  })
  .refine((data) => data.password === data['password-repeat'], {
    message: 'Passwords do not match',
    path: ['password-repeat'],
  })

/**
 * User preferences validation schema
 * Used for validating both localStorage and API preference updates
 */
export const PreferenceSchema = z.object({
  language: z.enum(['en', 'es', 'fr', 'de', 'sv'], {
    required_error: 'Language is required.',
    invalid_type_error: 'Invalid language selection.',
  }),
  keyboardLayout: z.enum(['qwerty', 'azerty', 'dvorak', 'colemak'], {
    required_error: 'Keyboard layout is required.',
    invalid_type_error: 'Invalid keyboard layout selection.',
  }),
  testDuration: z.enum(['30', '60', '120'], {
    required_error: 'Test duration is required.',
    invalid_type_error: 'Invalid test duration selection.',
  }),
  showKeyboard: z.boolean({
    required_error: 'Show keyboard preference is required.',
    invalid_type_error: 'Show keyboard must be a boolean value.',
  }),
}).strict() // Prevent additional properties

// Type exports for TypeScript
export type LoginFormData = z.infer<typeof LoginSchema>
export type SignupFormData = z.infer<typeof SignupSchema>
export type UserPreferences = z.infer<typeof PreferenceSchema>
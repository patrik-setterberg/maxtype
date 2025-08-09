import { z } from 'zod'

/**
 * Login form validation schema
 * Used by LoginForm component
 * Supports both username and email login
 */
export const LoginSchema = z.object({
  username: z
    .string({
      required_error: 'Username or email is required.',
    })
    .min(1, { message: 'Username or email is required.' }),
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
    'password-repeat': z.string({
      required_error: 'Password confirmation is required.',
    }),
    consent: z.boolean().refine(val => val === true, {
      message: 'You must agree to the terms in the privacy policy.',
    }),
  })
  .refine(data => data.password === data['password-repeat'], {
    message: 'Passwords do not match',
    path: ['password-repeat'],
  })

/**
 * User preferences validation schema
 * Used for validating both localStorage and API preference updates
 */
export const PreferenceSchema = z
  .object({
    language: z.enum(['en', 'es', 'fr', 'de', 'sv', 'pt'], {
      required_error: 'Typing test language is required.',
      invalid_type_error: 'Invalid language selection.',
    }),
    keyboardLayout: z.enum(
      [
        'qwerty_us',
        'qwerty_sv',
        'azerty_fr',
        'qwertz_de',
        'qwerty_es',
        'qwerty_pt',
        'dvorak_us',
        'colemak',
      ],
      {
        required_error: 'Keyboard layout is required.',
        invalid_type_error: 'Invalid keyboard layout selection.',
      },
    ),
    testDuration: z.enum(['30', '60', '120'], {
      required_error: 'Test duration is required.',
      invalid_type_error: 'Invalid test duration selection.',
    }),
    showKeyboard: z.boolean({
      required_error: 'Show keyboard preference is required.',
      invalid_type_error: 'Show keyboard must be a boolean value.',
    }),
    theme: z.enum(['light', 'dark', 'system'], {
      required_error: 'Theme preference is required.',
      invalid_type_error: 'Invalid theme selection.',
    }),
  })
  .strict() // Prevent additional properties

/**
 * Forgot password form validation schema
 * Used by ForgotPasswordForm component
 * Supports both username and email for password reset
 */
export const ForgotPasswordSchema = z.object({
  usernameOrEmail: z
    .string({
      required_error: 'Username or email is required.',
    })
    .min(1, { message: 'Username or email is required.' }),
})

/**
 * Reset password form validation schema
 * Used by ResetPasswordForm component
 */
export const ResetPasswordSchema = z
  .object({
    password: z
      .string({
        required_error: 'Password is required.',
      })
      .min(6, { message: 'Password must be at least 6 characters.' })
      .max(50, { message: 'Password must be at most 50 characters.' }),
    'password-repeat': z.string({
      required_error: 'Password confirmation is required.',
    }),
  })
  .refine(data => data.password === data['password-repeat'], {
    message: 'Passwords do not match',
    path: ['password-repeat'],
  })

/**
 * Change password form validation schema
 * Used by ChangePasswordForm component
 * Requires current password and new password with confirmation
 */
export const ChangePasswordSchema = z
  .object({
    currentPassword: z
      .string({
        required_error: 'Current password is required.',
      })
      .min(1, { message: 'Current password is required.' }),
    newPassword: z
      .string({
        required_error: 'New password is required.',
      })
      .min(6, { message: 'New password must be at least 6 characters.' })
      .max(50, { message: 'New password must be at most 50 characters.' }),
    'newPassword-repeat': z.string({
      required_error: 'New password confirmation is required.',
    }),
  })
  .refine(data => data.newPassword === data['newPassword-repeat'], {
    message: 'New passwords do not match',
    path: ['newPassword-repeat'],
  })
  .refine(data => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  })

// Type exports for TypeScript
export type LoginFormData = z.infer<typeof LoginSchema>
export type SignupFormData = z.infer<typeof SignupSchema>
export type UserPreferences = z.infer<typeof PreferenceSchema>
export type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>
export type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>

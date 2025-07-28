import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fetchGlobalData = async (slug: string) => {
  const response = await fetch(`/api/globals/${slug}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch global data for ${slug}`)
  }
  return response.json()
}

/**
 * Validates if a string is a properly formatted email address
 * More robust than just checking for '@' character
 */
export const isValidEmail = (value: string): boolean => {
  if (!value || typeof value !== 'string') {
    return false
  }
  
  // Basic structure check: must have @ with content before and after
  if (!value.includes('@') || value.indexOf('@') === 0 || value.indexOf('@') === value.length - 1) {
    return false
  }
  
  // Check for invalid patterns
  if (value.includes('..') || value.includes('@.') || value.includes('.@')) {
    return false
  }
  
  // More comprehensive regex for email validation
  // This covers most common email formats while being reasonably permissive
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/
  
  return emailRegex.test(value)
}

/**
 * Determines if input should be treated as email or username
 * Uses proper email validation instead of simple '@' check
 */
export const isEmailInput = (input: string): boolean => {
  return isValidEmail(input)
}

/**
 * Interface for authentication error response
 */
interface AuthErrorResponse {
  message?: string
  errors?: Array<{
    message: string
    field?: string
  }>
}

/**
 * Converts authentication API errors into user-friendly messages
 * Provides specific, actionable feedback for common authentication issues
 */
export const getAuthErrorMessage = (
  status: number,
  response: AuthErrorResponse,
  context: 'login' | 'signup' | 'forgot-password' | 'reset-password' = 'login'
): string => {
  // Handle network/server errors first
  if (status >= 500) {
    return 'Our servers are experiencing issues. Please try again in a few minutes.'
  }

  const message = response.message || response.errors?.[0]?.message || ''
  const lowerMessage = message.toLowerCase()

  // Handle specific error cases based on context
  switch (context) {
    case 'login':
      if (lowerMessage.includes('verify') || lowerMessage.includes('verification')) {
        return 'Please verify your email address before logging in. Check your inbox for the verification link.'
      }
      if (lowerMessage.includes('incorrect') || lowerMessage.includes('invalid') || status === 401) {
        return 'The username/email or password you entered is incorrect. Please check your credentials and try again.'
      }
      if (lowerMessage.includes('locked') || lowerMessage.includes('attempt')) {
        return 'Your account has been temporarily locked due to multiple failed login attempts. Please try again later or reset your password.'
      }
      if (lowerMessage.includes('disabled') || lowerMessage.includes('suspended')) {
        return 'Your account has been suspended. Please contact support for assistance.'
      }
      break

    case 'signup':
      if (lowerMessage.includes('already') || lowerMessage.includes('exists')) {
        if (lowerMessage.includes('email')) {
          return 'This email address is already registered. Please use a different email or try logging in instead.'
        }
        if (lowerMessage.includes('username')) {
          return 'This username is already taken. Please choose a different username.'
        }
        return 'An account with these details already exists. Please try logging in instead.'
      }
      if (lowerMessage.includes('invalid email') || lowerMessage.includes('email format')) {
        return 'Please enter a valid email address.'
      }
      if (lowerMessage.includes('password') && (lowerMessage.includes('short') || lowerMessage.includes('length'))) {
        return 'Password must be at least 6 characters long.'
      }
      break

    case 'forgot-password':
      if (lowerMessage.includes('not found') || lowerMessage.includes('exist')) {
        return 'No account found with that username or email address. Please check and try again.'
      }
      if (lowerMessage.includes('rate limit') || lowerMessage.includes('too many')) {
        return 'Too many password reset requests. Please wait before trying again.'
      }
      break

    case 'reset-password':
      if (lowerMessage.includes('expired') || lowerMessage.includes('invalid')) {
        return 'This password reset link has expired or is invalid. Please request a new password reset.'
      }
      if (lowerMessage.includes('password') && (lowerMessage.includes('short') || lowerMessage.includes('length'))) {
        return 'Password must be at least 6 characters long.'
      }
      break
  }

  // Fallback to original message or generic error
  return message || 'An unexpected error occurred. Please try again.'
}


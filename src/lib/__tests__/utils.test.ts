import { isValidEmail, isEmailInput, getAuthErrorMessage } from '../utils'

describe('Email validation utilities', () => {
  describe('isValidEmail', () => {
    it('should return true for valid email addresses', () => {
      const validEmails = [
        'user@example.com',
        'test.email@domain.co.uk',
        'firstname+lastname@company.org',
        'user123@test-domain.net',
        'a@b.co',
        'very.long.email.address@very-long-domain-name.museum',
      ]

      validEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(true)
      })
    })

    it('should return false for invalid email addresses', () => {
      const invalidEmails = [
        '',
        'not-an-email',
        '@domain.com',
        'user@',
        'user@@domain.com',
        'user@domain',
        'user@.com',
        'user@domain.',
        'user @domain.com',
        'user@domain .com',
        null as unknown as string,
        undefined as unknown as string,
        123 as unknown as string,
      ]

      invalidEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(false)
      })
    })

    it('should handle edge cases', () => {
      expect(isValidEmail('a@b.c')).toBe(false) // TLD too short
      expect(isValidEmail('user@domain.toolongTLD')).toBe(true) // Actually valid - long TLD is okay
      expect(isValidEmail('user+tag@domain.com')).toBe(true) // Plus in local part
      expect(isValidEmail('user.name@domain.com')).toBe(true) // Dot in local part
      expect(isValidEmail('user@domain..com')).toBe(false) // Double dot in domain
      expect(isValidEmail('user@-domain.com')).toBe(false) // Domain starting with dash
    })
  })

  describe('isEmailInput', () => {
    it('should correctly identify email vs username inputs', () => {
      // These should be treated as emails
      expect(isEmailInput('user@example.com')).toBe(true)
      expect(isEmailInput('test@domain.org')).toBe(true)
      
      // These should be treated as usernames
      expect(isEmailInput('username')).toBe(false)
      expect(isEmailInput('user123')).toBe(false)
      expect(isEmailInput('user@')).toBe(false) // Invalid email
      expect(isEmailInput('@domain.com')).toBe(false) // Invalid email
      expect(isEmailInput('user_name')).toBe(false)
      expect(isEmailInput('user-name')).toBe(false)
    })

    it('should handle empty or invalid inputs', () => {
      expect(isEmailInput('')).toBe(false)
      expect(isEmailInput(' ')).toBe(false)
      expect(isEmailInput(null as unknown as string)).toBe(false)
      expect(isEmailInput(undefined as unknown as string)).toBe(false)
    })
  })
})

describe('Auth error message utilities', () => {
  describe('getAuthErrorMessage', () => {
    it('should handle server errors (5xx)', () => {
      const result = getAuthErrorMessage(500, { message: 'Internal server error' })
      expect(result).toBe('Our servers are experiencing issues. Please try again in a few minutes.')
    })

    it('should handle login errors specifically', () => {
      // Verification error
      let result = getAuthErrorMessage(400, { message: 'Please verify your email' }, 'login')
      expect(result).toBe('Please verify your email address before logging in. Check your inbox for the verification link.')

      // Invalid credentials
      result = getAuthErrorMessage(401, { message: 'Incorrect username or password' }, 'login')
      expect(result).toBe('The username/email or password you entered is incorrect. Please check your credentials and try again.')

      // Account locked
      result = getAuthErrorMessage(400, { message: 'Account locked due to failed attempts' }, 'login')
      expect(result).toBe('Your account has been temporarily locked due to multiple failed login attempts. Please try again later or reset your password.')
    })

    it('should handle signup errors specifically', () => {
      // Email already exists
      let result = getAuthErrorMessage(400, { message: 'Email already exists' }, 'signup')
      expect(result).toBe('This email address is already registered. Please use a different email or try logging in instead.')

      // Username already exists
      result = getAuthErrorMessage(400, { message: 'Username already taken' }, 'signup')
      expect(result).toBe('This username is already taken. Please choose a different username.')

      // Password too short
      result = getAuthErrorMessage(400, { message: 'Password too short' }, 'signup')
      expect(result).toBe('Password must be at least 6 characters long.')
    })

    it('should handle forgot password errors specifically', () => {
      // User not found
      let result = getAuthErrorMessage(404, { message: 'User not found' }, 'forgot-password')
      expect(result).toBe('No account found with that username or email address. Please check and try again.')

      // Rate limiting
      result = getAuthErrorMessage(429, { message: 'Too many requests' }, 'forgot-password')
      expect(result).toBe('Too many password reset requests. Please wait before trying again.')
    })

    it('should handle reset password errors specifically', () => {
      // Expired token
      let result = getAuthErrorMessage(400, { message: 'Token expired' }, 'reset-password')
      expect(result).toBe('This password reset link has expired or is invalid. Please request a new password reset.')

      // Invalid token
      result = getAuthErrorMessage(400, { message: 'Invalid token' }, 'reset-password')
      expect(result).toBe('This password reset link has expired or is invalid. Please request a new password reset.')
    })

    it('should handle errors array format', () => {
      const response = {
        errors: [
          { message: 'Email already exists', field: 'email' }
        ]
      }
      const result = getAuthErrorMessage(400, response, 'signup')
      expect(result).toBe('This email address is already registered. Please use a different email or try logging in instead.')
    })

    it('should fallback to original message when no specific handling exists', () => {
      const result = getAuthErrorMessage(400, { message: 'Some custom error' })
      expect(result).toBe('Some custom error')
    })

    it('should provide generic message when no message is available', () => {
      const result = getAuthErrorMessage(400, {})
      expect(result).toBe('An unexpected error occurred. Please try again.')
    })
  })
})
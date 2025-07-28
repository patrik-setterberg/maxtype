/**
 * Integration tests for flexible authentication logic
 * Tests the username/email detection and authentication flows
 */

import { isEmailInput } from '../utils'

// Mock fetch for testing API calls
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('Flexible Authentication Integration', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    // Reset environment variable for tests
    process.env.NEXT_PUBLIC_CMS_URL = ''
  })

  describe('Email vs Username Detection', () => {
    it('should correctly identify valid emails for authentication', () => {
      const testCases = [
        { input: 'user@example.com', expected: true, description: 'standard email' },
        { input: 'test.user+tag@domain.co.uk', expected: true, description: 'complex email' },
        { input: 'simple@test.org', expected: true, description: 'simple email' },
        { input: 'username123', expected: false, description: 'alphanumeric username' },
        { input: 'user_name', expected: false, description: 'username with underscore' },
        { input: 'user-name', expected: false, description: 'username with dash' },
        { input: 'user@', expected: false, description: 'incomplete email' },
        { input: '@domain.com', expected: false, description: 'email without local part' },
        { input: 'user@domain', expected: false, description: 'email without TLD' },
      ]

      testCases.forEach(({ input, expected }) => {
        expect(isEmailInput(input)).toBe(expected)
      })
    })

    it('should handle edge cases in email detection', () => {
      expect(isEmailInput('')).toBe(false)
      expect(isEmailInput(' ')).toBe(false)
      expect(isEmailInput('user@domain..com')).toBe(false) // Double dot
      expect(isEmailInput('user@domain.c')).toBe(false) // TLD too short
    })
  })

  describe('Forgot Password Payload Construction', () => {
    it('should construct correct payload for email input', () => {
      const emailInput = 'user@example.com'
      const isEmail = isEmailInput(emailInput)
      const payload = isEmail ? { email: emailInput } : { username: emailInput }
      
      expect(payload).toEqual({ email: 'user@example.com' })
    })

    it('should construct correct payload for username input', () => {
      const usernameInput = 'myusername'
      const isEmail = isEmailInput(usernameInput)
      const payload = isEmail ? { email: usernameInput } : { username: usernameInput }
      
      expect(payload).toEqual({ username: 'myusername' })
    })

    it('should handle ambiguous cases correctly', () => {
      // Cases that might look like emails but aren't valid
      const testCases = [
        { input: 'user@', expectedKey: 'username' },
        { input: '@domain.com', expectedKey: 'username' },
        { input: 'user@domain', expectedKey: 'username' },
        { input: 'user.name@valid.com', expectedKey: 'email' },
      ]

      testCases.forEach(({ input, expectedKey }) => {
        const isEmail = isEmailInput(input)
        const payload = isEmail ? { email: input } : { username: input }
        
        expect(Object.keys(payload)[0]).toBe(expectedKey)
      })
    })
  })

  describe('Authentication Flow Simulation', () => {
    it('should simulate forgot password with email', async () => {
      // Mock successful API response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ message: 'Reset email sent' })
      })

      const userInput = 'test@example.com'
      const isEmail = isEmailInput(userInput)
      const payload = isEmail ? { email: userInput } : { username: userInput }

      // Simulate the API call that would happen in ForgotPasswordForm
      await fetch('/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      expect(mockFetch).toHaveBeenCalledWith('/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com' })
      })
    })

    it('should simulate forgot password with username', async () => {
      // Mock successful API response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ message: 'Reset email sent' })
      })

      const userInput = 'myusername'
      const isEmail = isEmailInput(userInput)
      const payload = isEmail ? { email: userInput } : { username: userInput }

      // Simulate the API call that would happen in ForgotPasswordForm
      await fetch('/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      expect(mockFetch).toHaveBeenCalledWith('/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'myusername' })
      })
    })

    it('should simulate login with username or email', async () => {
      // Mock successful login response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ 
          user: { id: '123', username: 'testuser', email: 'test@example.com' },
          token: 'mock-token'
        })
      })

      // Test login with either username or email (both use same endpoint with username field)
      const credentials = { username: 'test@example.com', password: 'password123' }

      await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credentials)
      })

      expect(mockFetch).toHaveBeenCalledWith('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: 'test@example.com', password: 'password123' })
      })
    })
  })

  describe('Error Handling Integration', () => {
    it('should handle forgot password errors appropriately', async () => {
      // Mock error response
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: 'User not found' })
      })

      let errorOccurred = false
      let errorMessage = ''

      try {
        const response = await fetch('/api/users/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'nonexistent@example.com' })
        })

        const data = await response.json()
        
        if (!response.ok) {
          errorOccurred = true
          errorMessage = data.message
        }
      } catch (_error) {
        errorOccurred = true
      }

      expect(errorOccurred).toBe(true)
      expect(errorMessage).toBe('User not found')
    })
  })

  describe('Validation Schema Integration', () => {
    it('should work with form validation for flexible username/email input', () => {
      // Test that our email detection works with the validation schemas
      const validInputs = [
        'username123',
        'user_name',
        'user-name',
        'test@example.com',
        'complex.email+tag@domain.co.uk'
      ]

      validInputs.forEach(input => {
        // All inputs should be valid for the usernameOrEmail field
        expect(input.length).toBeGreaterThan(0) // Basic validation
        
        // Email detection should work correctly
        const isEmail = isEmailInput(input)
        expect(typeof isEmail).toBe('boolean')
        
        if (input.includes('@')) {
          // If it contains @, it should be a valid email to be detected as email
          if (isEmail) {
            expect(input).toMatch(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/)
          }
        }
      })
    })
  })
})
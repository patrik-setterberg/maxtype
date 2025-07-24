import { LoginSchema, SignupSchema } from '../validation'

// These tests now use the extracted validation schemas
// This demonstrates TDD: test first, implement second, then refactor

describe('Form Validation Schemas', () => {
  describe('LoginSchema', () => {
    // Test case 1: Valid login data should pass
    test('should accept valid email and password', () => {
      const validData = {
        email: 'user@example.com',
        password: 'password123',
      }
      
      // We'll implement this schema next
      expect(() => LoginSchema.parse(validData)).not.toThrow()
    })

    // Test case 2: Invalid email should fail
    test('should reject invalid email format', () => {
      const invalidData = {
        email: 'not-an-email',
        password: 'password123',
      }
      
      expect(() => LoginSchema.parse(invalidData)).toThrow()
    })

    // Test case 3: Short password should fail
    test('should reject password shorter than 6 characters', () => {
      const invalidData = {
        email: 'user@example.com',
        password: '12345', // Only 5 characters
      }
      
      expect(() => LoginSchema.parse(invalidData)).toThrow()
    })

    // Test case 4: Missing fields should fail
    test('should reject missing email', () => {
      const invalidData = {
        password: 'password123',
        // email missing
      }
      
      expect(() => LoginSchema.parse(invalidData)).toThrow()
    })

    test('should reject missing password', () => {
      const invalidData = {
        email: 'user@example.com',
        // password missing
      }
      
      expect(() => LoginSchema.parse(invalidData)).toThrow()
    })
  })

  describe('SignupSchema', () => {
    // Test case 1: Valid signup data should pass
    test('should accept valid signup data', () => {
      const validData = {
        username: 'testuser',
        email: 'user@example.com',
        password: 'password123',
        'password-repeat': 'password123',
        consent: true,
      }
      
      expect(() => SignupSchema.parse(validData)).not.toThrow()
    })

    // Test case 2: Username validation
    test('should reject username shorter than 3 characters', () => {
      const invalidData = {
        username: 'ab', // Only 2 characters
        email: 'user@example.com',
        password: 'password123',
        'password-repeat': 'password123',
        consent: true,
      }
      
      expect(() => SignupSchema.parse(invalidData)).toThrow()
    })

    test('should reject username longer than 20 characters', () => {
      const invalidData = {
        username: 'thisusernameiswaytoolong', // More than 20 characters
        email: 'user@example.com',
        password: 'password123',
        'password-repeat': 'password123',
        consent: true,
      }
      
      expect(() => SignupSchema.parse(invalidData)).toThrow()
    })

    test('should reject username with invalid characters', () => {
      const invalidData = {
        username: 'user@name', // @ is not allowed
        email: 'user@example.com',
        password: 'password123',
        'password-repeat': 'password123',
        consent: true,
      }
      
      expect(() => SignupSchema.parse(invalidData)).toThrow()
    })

    test('should accept username with allowed characters', () => {
      const validUsernames = ['user123', 'test-user', 'user_name', 'TestUser']
      
      validUsernames.forEach(username => {
        const validData = {
          username,
          email: 'user@example.com',
          password: 'password123',
          'password-repeat': 'password123',
          consent: true,
        }
        
        expect(() => SignupSchema.parse(validData)).not.toThrow()
      })
    })

    // Test case 3: Password matching
    test('should reject when passwords do not match', () => {
      const invalidData = {
        username: 'testuser',
        email: 'user@example.com',
        password: 'password123',
        'password-repeat': 'different123', // Doesn't match
        consent: true,
      }
      
      expect(() => SignupSchema.parse(invalidData)).toThrow()
    })

    // Test case 4: Consent validation
    test('should reject when consent is false', () => {
      const invalidData = {
        username: 'testuser',
        email: 'user@example.com',
        password: 'password123',
        'password-repeat': 'password123',
        consent: false, // Must be true
      }
      
      expect(() => SignupSchema.parse(invalidData)).toThrow()
    })

    // Test case 5: Email validation (same as login)
    test('should reject invalid email format', () => {
      const invalidData = {
        username: 'testuser',
        email: 'not-an-email',
        password: 'password123',
        'password-repeat': 'password123',
        consent: true,
      }
      
      expect(() => SignupSchema.parse(invalidData)).toThrow()
    })
  })
})

// The schemas are now implemented in src/lib/validation.ts
// This completes the TDD cycle: RED -> GREEN -> REFACTOR
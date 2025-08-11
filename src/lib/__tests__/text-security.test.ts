import { sanitizeCustomText, validateCustomText } from '../utils'

describe('Text Security Functions', () => {
  describe('sanitizeCustomText', () => {
    test('should remove HTML tags', () => {
      const input = 'Hello <script>alert("xss")</script> world'
      const result = sanitizeCustomText(input)
      expect(result).toBe('Hello alert("xss") world')
    })

    test('should remove JavaScript protocols', () => {
      const input = 'Click javascript:alert("xss") here'
      const result = sanitizeCustomText(input)
      expect(result).toBe('Click alert("xss") here')
    })

    test('should remove data protocols', () => {
      const input = 'Image data:image/svg+xml;base64,PHN2Zw here'
      const result = sanitizeCustomText(input)
      expect(result).toBe('Image PHN2Zw here')
    })

    test('should remove event handlers', () => {
      const input = 'Text onclick="alert()" onload="badScript()" here'
      const result = sanitizeCustomText(input)
      expect(result).toBe('Text here')
    })

    test('should normalize whitespace', () => {
      const input = 'Hello    world   with    spaces'
      const result = sanitizeCustomText(input)
      expect(result).toBe('Hello world with spaces')
    })

    test('should limit length to 10000 characters', () => {
      const input = 'a'.repeat(15000)
      const result = sanitizeCustomText(input)
      expect(result).toHaveLength(10000)
    })

    test('should handle empty input', () => {
      expect(sanitizeCustomText('')).toBe('')
      expect(sanitizeCustomText(null as unknown as string)).toBe('')
      expect(sanitizeCustomText(undefined as unknown as string)).toBe('')
    })

    test('should preserve normal text', () => {
      const input = 'This is a normal sentence with punctuation! How are you?'
      const result = sanitizeCustomText(input)
      expect(result).toBe(input)
    })
  })

  describe('validateCustomText', () => {
    test('should accept valid text', () => {
      const result = validateCustomText('This is a valid text for typing practice.')
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    test('should reject empty text', () => {
      const result = validateCustomText('')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('required')
    })

    test('should reject text that becomes empty after sanitization', () => {
      const result = validateCustomText('<script></script>')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('empty')
    })

    test('should reject text shorter than 10 characters', () => {
      const result = validateCustomText('Short')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('at least 10 characters')
    })

    test('should accept text exactly at 10000 characters', () => {
      const longText = 'a'.repeat(10000)
      const result = validateCustomText(longText)
      expect(result.isValid).toBe(true)
    })

    test('should reject text with too few alphanumeric characters', () => {
      const result = validateCustomText('!@#$%^&*()_+{}[]|\\:";\'<>?,./')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('readable characters')
    })

    test('should accept text with proper alphanumeric ratio', () => {
      const result = validateCustomText('This is a good text with some punctuation!')
      expect(result.isValid).toBe(true)
    })

    test('should handle null/undefined input', () => {
      expect(validateCustomText(null as unknown as string).isValid).toBe(false)
      expect(validateCustomText(undefined as unknown as string).isValid).toBe(false)
    })
  })

  describe('Security scenarios', () => {
    test('should handle complex XSS attempts', () => {
      const maliciousInput = `
        <img src="x" onerror="alert('XSS')">
        <script>
          fetch('/api/steal-data', {
            method: 'POST',
            body: JSON.stringify({token: localStorage.getItem('auth')})
          });
        </script>
        javascript:void(0);
        data:text/html,<script>alert('XSS')</script>
        This is the actual text content for typing.
      `

      const sanitized = sanitizeCustomText(maliciousInput)
      const validation = validateCustomText(sanitized)

      // Should remove all malicious content but keep the safe text
      expect(sanitized).not.toContain('<script>')
      expect(sanitized).not.toContain('javascript:')
      expect(sanitized).not.toContain('data:')
      expect(sanitized).not.toContain('onerror')
      expect(sanitized).toContain('This is the actual text content for typing')
      expect(validation.isValid).toBe(true)
    })

    test('should handle SQL injection attempts in text', () => {
      const input = `
        Robert'); DROP TABLE Students;--
        This is a story about a student named Robert.
        He was learning about databases and security.
      `

      const sanitized = sanitizeCustomText(input)
      const validation = validateCustomText(sanitized)

      // SQL injection in text content should be preserved as it's just text for typing
      // But it should be safe when stored/retrieved from database due to proper ORM usage
      expect(validation.isValid).toBe(true)
      expect(sanitized).toContain('Robert')
      expect(sanitized).toContain('DROP TABLE')
    })
  })
})

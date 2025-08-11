/**
 * Simple theme tests
 * Just testing that theme preferences get properly validated by Zod
 */

import { PreferenceSchema } from '../validation'

describe('Theme Integration', () => {
  describe('PreferenceSchema with theme field', () => {
    it('should accept valid theme preferences', () => {
      const validPreferences = {
        language: 'en' as const,
        keyboardLayout: 'qwerty_us' as const,
        testDuration: '30' as const,
        showKeyboard: true,
        theme: 'light' as const,
        textType: 'words' as const,
      }

      const result = PreferenceSchema.safeParse(validPreferences)
      expect(result.success).toBe(true)
    })

    it('should accept dark theme', () => {
      const preferences = {
        language: 'en' as const,
        keyboardLayout: 'qwerty_us' as const,
        testDuration: '30' as const,
        showKeyboard: true,
        theme: 'dark' as const,
        textType: 'words' as const,
      }

      const result = PreferenceSchema.safeParse(preferences)
      expect(result.success).toBe(true)
    })

    it('should accept system theme', () => {
      const preferences = {
        language: 'en' as const,
        keyboardLayout: 'qwerty_us' as const,
        testDuration: '30' as const,
        showKeyboard: true,
        theme: 'system' as const,
        textType: 'words' as const,
      }

      const result = PreferenceSchema.safeParse(preferences)
      expect(result.success).toBe(true)
    })

    it('should reject invalid theme', () => {
      const preferences = {
        language: 'en' as const,
        keyboardLayout: 'qwerty_us' as const,
        testDuration: '30' as const,
        showKeyboard: true,
        theme: 'invalid' as 'light',
        textType: 'words' as const,
      }

      const result = PreferenceSchema.safeParse(preferences)
      expect(result.success).toBe(false)
    })

    it('should require theme field', () => {
      const preferences = {
        language: 'en' as const,
        keyboardLayout: 'qwerty_us' as const,
        testDuration: '30' as const,
        showKeyboard: true,
        // theme and textType missing
      }

      const result = PreferenceSchema.safeParse(preferences)
      expect(result.success).toBe(false)
    })

    it('should require textType field', () => {
      const preferences = {
        language: 'en' as const,
        keyboardLayout: 'qwerty_us' as const,
        testDuration: '30' as const,
        showKeyboard: true,
        theme: 'system' as const,
        // textType missing
      }

      const result = PreferenceSchema.safeParse(preferences)
      expect(result.success).toBe(false)
    })

    it('should accept all text types', () => {
      const textTypes = ['words', 'sentences', 'paragraphs', 'punctuation', 'custom'] as const

      textTypes.forEach(textType => {
        const preferences = {
          language: 'en' as const,
          keyboardLayout: 'qwerty_us' as const,
          testDuration: '30' as const,
          showKeyboard: true,
          theme: 'system' as const,
          textType,
        }

        const result = PreferenceSchema.safeParse(preferences)
        expect(result.success).toBe(true)
      })
    })
  })
})

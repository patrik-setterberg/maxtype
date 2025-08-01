import { PreferenceSchema } from '../validation'

describe('PreferenceSchema', () => {
  describe('valid preferences', () => {
    test('should accept all valid language options', () => {
      const languages = ['en', 'es', 'fr', 'de', 'sv'] as const

      languages.forEach(language => {
        const validData = {
          language,
          keyboardLayout: 'qwerty' as const,
          testDuration: '30' as const,
          showKeyboard: true,
          theme: 'system' as const,
        }

        expect(() => PreferenceSchema.parse(validData)).not.toThrow()
      })
    })

    test('should accept all valid keyboard layout options', () => {
      const layouts = ['qwerty', 'azerty', 'dvorak', 'colemak'] as const

      layouts.forEach(keyboardLayout => {
        const validData = {
          language: 'en' as const,
          keyboardLayout,
          testDuration: '30' as const,
          showKeyboard: true,
          theme: 'system' as const,
        }

        expect(() => PreferenceSchema.parse(validData)).not.toThrow()
      })
    })

    test('should accept all valid test duration options', () => {
      const durations = ['30', '60', '120'] as const

      durations.forEach(testDuration => {
        const validData = {
          language: 'en' as const,
          keyboardLayout: 'qwerty' as const,
          testDuration,
          showKeyboard: true,
          theme: 'system' as const,
        }

        expect(() => PreferenceSchema.parse(validData)).not.toThrow()
      })
    })

    test('should accept both boolean values for showKeyboard', () => {
      ;[true, false].forEach(showKeyboard => {
        const validData = {
          language: 'en' as const,
          keyboardLayout: 'qwerty' as const,
          testDuration: '30' as const,
          showKeyboard,
          theme: 'system' as const,
        }

        expect(() => PreferenceSchema.parse(validData)).not.toThrow()
      })
    })

    test('should accept all valid theme options', () => {
      const themes = ['light', 'dark', 'system'] as const

      themes.forEach(theme => {
        const validData = {
          language: 'en' as const,
          keyboardLayout: 'qwerty' as const,
          testDuration: '30' as const,
          showKeyboard: true,
          theme,
        }

        expect(() => PreferenceSchema.parse(validData)).not.toThrow()
      })
    })

    test('should accept complete valid preference object', () => {
      const validPreferences = {
        language: 'es' as const,
        keyboardLayout: 'azerty' as const,
        testDuration: '60' as const,
        showKeyboard: false,
        theme: 'dark' as const,
      }

      const result = PreferenceSchema.parse(validPreferences)
      expect(result).toEqual(validPreferences)
    })
  })

  describe('invalid preferences', () => {
    test('should reject invalid language', () => {
      const invalidData = {
        language: 'invalid',
        keyboardLayout: 'qwerty' as const,
        testDuration: '30' as const,
        showKeyboard: true,
        theme: 'system' as const,
      }

      expect(() => PreferenceSchema.parse(invalidData)).toThrow()
    })

    test('should reject invalid keyboard layout', () => {
      const invalidData = {
        language: 'en' as const,
        keyboardLayout: 'workman',
        testDuration: '30' as const,
        showKeyboard: true,
        theme: 'system' as const,
      }

      expect(() => PreferenceSchema.parse(invalidData)).toThrow()
    })

    test('should reject invalid test duration', () => {
      const invalidData = {
        language: 'en' as const,
        keyboardLayout: 'qwerty' as const,
        testDuration: '45',
        showKeyboard: true,
        theme: 'system' as const,
      }

      expect(() => PreferenceSchema.parse(invalidData)).toThrow()
    })

    test('should reject non-boolean showKeyboard', () => {
      const invalidData = {
        language: 'en' as const,
        keyboardLayout: 'qwerty' as const,
        testDuration: '30' as const,
        showKeyboard: 'true',
        theme: 'system' as const,
      }

      expect(() => PreferenceSchema.parse(invalidData)).toThrow()
    })

    test('should reject invalid theme', () => {
      const invalidData = {
        language: 'en' as const,
        keyboardLayout: 'qwerty' as const,
        testDuration: '30' as const,
        showKeyboard: true,
        theme: 'invalid',
      }

      expect(() => PreferenceSchema.parse(invalidData)).toThrow()
    })

    test('should reject missing required fields', () => {
      const incompleteData = {
        language: 'en' as const,
        keyboardLayout: 'qwerty' as const,
        // missing testDuration, showKeyboard, and theme
      }

      expect(() => PreferenceSchema.parse(incompleteData)).toThrow()
    })

    test('should reject extra fields', () => {
      const dataWithExtra = {
        language: 'en' as const,
        keyboardLayout: 'qwerty' as const,
        testDuration: '30' as const,
        showKeyboard: true,
        theme: 'system' as const,
        extraField: 'not allowed',
      }

      expect(() => PreferenceSchema.parse(dataWithExtra)).toThrow()
    })

    test('should reject null values', () => {
      const nullData = {
        language: null,
        keyboardLayout: 'qwerty' as const,
        testDuration: '30' as const,
        showKeyboard: true,
        theme: 'system' as const,
      }

      expect(() => PreferenceSchema.parse(nullData)).toThrow()
    })

    test('should reject undefined values', () => {
      const undefinedData = {
        language: undefined,
        keyboardLayout: 'qwerty' as const,
        testDuration: '30' as const,
        showKeyboard: true,
        theme: 'system' as const,
      }

      expect(() => PreferenceSchema.parse(undefinedData)).toThrow()
    })
  })

  describe('type coercion', () => {
    test('should not coerce string boolean to boolean', () => {
      const stringBooleanData = {
        language: 'en' as const,
        keyboardLayout: 'qwerty' as const,
        testDuration: '30' as const,
        showKeyboard: 'true',
        theme: 'system' as const,
      }

      expect(() => PreferenceSchema.parse(stringBooleanData)).toThrow()
    })

    test('should not coerce number duration to string', () => {
      const numberDurationData = {
        language: 'en' as const,
        keyboardLayout: 'qwerty' as const,
        testDuration: 30,
        showKeyboard: true,
        theme: 'system' as const,
      }

      expect(() => PreferenceSchema.parse(numberDurationData)).toThrow()
    })
  })

  describe('edge cases', () => {
    test('should handle empty object', () => {
      expect(() => PreferenceSchema.parse({})).toThrow()
    })

    test('should handle array input', () => {
      expect(() => PreferenceSchema.parse([])).toThrow()
    })

    test('should handle string input', () => {
      expect(() => PreferenceSchema.parse('invalid')).toThrow()
    })

    test('should handle number input', () => {
      expect(() => PreferenceSchema.parse(123)).toThrow()
    })

    test('should handle null input', () => {
      expect(() => PreferenceSchema.parse(null)).toThrow()
    })

    test('should handle undefined input', () => {
      expect(() => PreferenceSchema.parse(undefined)).toThrow()
    })
  })
})

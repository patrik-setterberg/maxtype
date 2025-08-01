import { PreferenceStorage, usePreferences } from '../preferences'
import { renderHook, act, waitFor } from '@testing-library/react'
import { User } from '@/payload-types'
import { UserPreferences } from '../validation'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock Payload API
const mockPayloadFetch = jest.fn()
global.fetch = mockPayloadFetch

// Mock auth hook with state management
const mockAuth = {
  user: null as User | null,
  loading: false,
  logout: jest.fn(),
}

jest.mock('../auth', () => ({
  useAuth: jest.fn(() => mockAuth),
}))

describe('PreferenceStorage', () => {
  beforeEach(() => {
    localStorageMock.clear()
    jest.clearAllMocks()
    mockAuth.user = null
    mockAuth.loading = false
  })

  describe('localStorage operations', () => {
    test('should save preferences to localStorage', () => {
      const preferences = {
        language: 'es' as const,
        keyboardLayout: 'azerty' as const,
        testDuration: '60' as const,
        showKeyboard: false,
        theme: 'dark' as const,
      }

      PreferenceStorage.saveToLocalStorage(preferences)

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'maxtype-preferences',
        JSON.stringify(preferences),
      )
    })

    test('should load preferences from localStorage', () => {
      const preferences = {
        language: 'fr' as const,
        keyboardLayout: 'dvorak' as const,
        testDuration: '120' as const,
        showKeyboard: true,
        theme: 'light' as const,
      }

      localStorageMock.getItem.mockReturnValue(JSON.stringify(preferences))

      const result = PreferenceStorage.loadFromLocalStorage()

      expect(localStorageMock.getItem).toHaveBeenCalledWith('maxtype-preferences')
      expect(result).toEqual(preferences)
    })

    test('should return null when localStorage is empty', () => {
      localStorageMock.getItem.mockReturnValue(null)

      const result = PreferenceStorage.loadFromLocalStorage()

      expect(result).toBeNull()
    })

    test('should handle malformed JSON in localStorage', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json')

      const result = PreferenceStorage.loadFromLocalStorage()

      expect(result).toBeNull()
    })

    test('should clear preferences from localStorage', () => {
      PreferenceStorage.clearLocalStorage()

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('maxtype-preferences')
    })
  })

  describe('default preferences', () => {
    test('should return correct default preferences', () => {
      const defaults = PreferenceStorage.getDefaults()

      expect(defaults).toEqual({
        language: 'en',
        keyboardLayout: 'qwerty',
        testDuration: '30',
        showKeyboard: true,
        theme: 'system',
      })
    })
  })

  describe('preference validation', () => {
    test('should validate correct preferences', () => {
      const validPreferences = {
        language: 'es' as const,
        keyboardLayout: 'azerty' as const,
        testDuration: '60' as const,
        showKeyboard: false,
        theme: 'dark' as const,
      }

      expect(PreferenceStorage.isValidPreferences(validPreferences)).toBe(true)
    })

    test('should reject invalid language', () => {
      const invalidPreferences = {
        language: 'invalid',
        keyboardLayout: 'qwerty' as const,
        testDuration: '30' as const,
        showKeyboard: true,
        theme: 'system' as const,
      } as const

      expect(PreferenceStorage.isValidPreferences(invalidPreferences)).toBe(false)
    })

    test('should reject invalid keyboard layout', () => {
      const invalidPreferences = {
        language: 'en' as const,
        keyboardLayout: 'invalid',
        testDuration: '30' as const,
        showKeyboard: true,
        theme: 'system' as const,
      } as const

      expect(PreferenceStorage.isValidPreferences(invalidPreferences)).toBe(false)
    })

    test('should reject invalid test duration', () => {
      const invalidPreferences = {
        language: 'en' as const,
        keyboardLayout: 'qwerty' as const,
        testDuration: '45',
        showKeyboard: true,
        theme: 'system' as const,
      } as const

      expect(PreferenceStorage.isValidPreferences(invalidPreferences)).toBe(false)
    })

    test('should reject non-boolean showKeyboard', () => {
      const invalidPreferences = {
        language: 'en' as const,
        keyboardLayout: 'qwerty' as const,
        testDuration: '30' as const,
        showKeyboard: 'true',
        theme: 'system' as const,
      } as const

      expect(PreferenceStorage.isValidPreferences(invalidPreferences)).toBe(false)
    })

    test('should reject missing fields', () => {
      const incompletePreferences = {
        language: 'en' as const,
        keyboardLayout: 'qwerty' as const,
        // missing testDuration, showKeyboard, and theme
      }

      expect(PreferenceStorage.isValidPreferences(incompletePreferences)).toBe(false)
    })
  })
})

describe('usePreferences hook', () => {
  beforeEach(() => {
    localStorageMock.clear()
    jest.clearAllMocks()
    mockAuth.user = null
    mockAuth.loading = false
    // Clear all localStorage mock return values
    localStorageMock.getItem.mockReturnValue(null)
  })

  describe('guest user preferences', () => {
    test('should return default preferences for new guest', () => {
      const { result } = renderHook(() => usePreferences())

      expect(result.current.preferences).toEqual({
        language: 'en',
        keyboardLayout: 'qwerty',
        testDuration: '30',
        showKeyboard: true,
        theme: 'system',
      })
      expect(result.current.isGuest).toBe(true)
      expect(result.current.loading).toBe(false)
    })

    test('should load preferences from localStorage for returning guest', () => {
      const savedPreferences = {
        language: 'es' as const,
        keyboardLayout: 'azerty' as const,
        testDuration: '60' as const,
        showKeyboard: false,
        theme: 'dark' as const,
      }
      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedPreferences))

      const { result } = renderHook(() => usePreferences())

      expect(result.current.preferences).toEqual(savedPreferences)
      expect(result.current.isGuest).toBe(true)
    })

    test('should update guest preferences and save to localStorage', async () => {
      const { result } = renderHook(() => usePreferences())

      await act(async () => {
        await result.current.updatePreferences({
          language: 'fr',
          keyboardLayout: 'dvorak',
          testDuration: '120',
          showKeyboard: false,
          theme: 'light',
        })
      })

      expect(result.current.preferences).toEqual({
        language: 'fr',
        keyboardLayout: 'dvorak',
        testDuration: '120',
        showKeyboard: false,
        theme: 'light',
      })
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'maxtype-preferences',
        JSON.stringify({
          language: 'fr',
          keyboardLayout: 'dvorak',
          testDuration: '120',
          showKeyboard: false,
          theme: 'light',
        }),
      )
    })

    test('should reject invalid preference updates', async () => {
      // Ensure we start with defaults (no localStorage data)
      localStorageMock.getItem.mockReturnValue(null)

      const { result } = renderHook(() => usePreferences())

      // Verify we start with defaults
      expect(result.current.preferences).toEqual({
        language: 'en',
        keyboardLayout: 'qwerty',
        testDuration: '30',
        showKeyboard: true,
        theme: 'system',
      })

      let errorCaught = false
      await act(async () => {
        try {
          await result.current.updatePreferences({
            language: 'invalid',
            keyboardLayout: 'qwerty',
            testDuration: '30',
            showKeyboard: true,
            theme: 'system',
          } as UserPreferences)
        } catch (error) {
          errorCaught = true
          expect(error).toBeInstanceOf(Error)
        }
      })

      expect(errorCaught).toBe(true)

      // Preferences should remain unchanged
      expect(result.current.preferences).toEqual({
        language: 'en',
        keyboardLayout: 'qwerty',
        testDuration: '30',
        showKeyboard: true,
        theme: 'system',
      })
    })
  })

  describe('authenticated user preferences', () => {
    beforeEach(() => {
      mockAuth.user = {
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        preferences: {
          language: 'es',
          keyboardLayout: 'azerty',
          testDuration: '60',
          showKeyboard: false,
          theme: 'dark',
        },
      } as User
    })

    test('should return user preferences from database', () => {
      const { result } = renderHook(() => usePreferences())

      expect(result.current.preferences).toEqual({
        language: 'es',
        keyboardLayout: 'azerty',
        testDuration: '60',
        showKeyboard: false,
        theme: 'dark',
      })
      expect(result.current.isGuest).toBe(false)
    })

    test('should update user preferences via API', async () => {
      mockPayloadFetch.mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            doc: {
              ...mockAuth.user,
              preferences: {
                language: 'fr',
                keyboardLayout: 'dvorak',
                testDuration: '120',
                showKeyboard: true,
                theme: 'light',
              },
            },
          }),
      })

      const { result } = renderHook(() => usePreferences())

      await act(async () => {
        await result.current.updatePreferences({
          language: 'fr',
          keyboardLayout: 'dvorak',
          testDuration: '120',
          showKeyboard: true,
          theme: 'light',
        })
      })

      expect(mockPayloadFetch).toHaveBeenCalledWith('/api/users/user-123', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          preferences: {
            language: 'fr',
            keyboardLayout: 'dvorak',
            testDuration: '120',
            showKeyboard: true,
            theme: 'light',
          },
        }),
      })

      expect(result.current.preferences).toEqual({
        language: 'fr',
        keyboardLayout: 'dvorak',
        testDuration: '120',
        showKeyboard: true,
        theme: 'light',
      })
    })

    test('should handle API update errors', async () => {
      mockPayloadFetch.mockResolvedValue({
        ok: false,
        status: 500,
      })

      const { result } = renderHook(() => usePreferences())
      const originalPreferences = result.current.preferences

      await act(async () => {
        try {
          await result.current.updatePreferences({
            language: 'fr',
            keyboardLayout: 'dvorak',
            testDuration: '120',
            showKeyboard: true,
            theme: 'light',
          })
        } catch (error) {
          expect(error).toBeInstanceOf(Error)
        }
      })

      // Preferences should remain unchanged on API error
      expect(result.current.preferences).toEqual(originalPreferences)
    })
  })

  describe('guest-to-user migration', () => {
    test('should migrate localStorage preferences when user logs in', async () => {
      // Start as guest with saved preferences
      const guestPreferences = {
        language: 'es' as const,
        keyboardLayout: 'azerty' as const,
        testDuration: '60' as const,
        showKeyboard: false,
        theme: 'dark' as const,
      }
      localStorageMock.getItem.mockReturnValue(JSON.stringify(guestPreferences))

      // Mock successful migration API call
      mockPayloadFetch.mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            doc: {
              id: 'user-123',
              username: 'testuser',
              email: 'test@example.com',
              preferences: guestPreferences,
            },
          }),
      })

      // Start rendering with guest user
      const { result, rerender } = renderHook(() => usePreferences())

      // Verify initial guest state
      expect(result.current.preferences).toEqual(guestPreferences)
      expect(result.current.isGuest).toBe(true)

      // Update mock auth state
      mockAuth.user = {
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        preferences: {
          language: 'en', // Default database preferences
          keyboardLayout: 'qwerty',
          testDuration: '30',
          showKeyboard: true,
          theme: 'system',
        },
      } as User

      // Trigger re-render to pick up auth changes
      rerender()

      // Wait for migration to complete
      await waitFor(() => {
        expect(mockPayloadFetch).toHaveBeenCalledWith('/api/users/user-123', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            preferences: guestPreferences,
          }),
        })
      })

      // Wait for preferences to be updated with migrated values
      await waitFor(() => {
        expect(result.current.preferences).toEqual(guestPreferences)
      })

      // Verify localStorage was cleared after migration
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('maxtype-preferences')

      // Verify user state
      expect(result.current.isGuest).toBe(false)
    })

    test('should not migrate when user already has non-default preferences', async () => {
      // Start as guest
      const guestPreferences = {
        language: 'es' as const,
        keyboardLayout: 'azerty' as const,
        testDuration: '60' as const,
        showKeyboard: false,
        theme: 'dark' as const,
      }
      localStorageMock.getItem.mockReturnValue(JSON.stringify(guestPreferences))

      const { result, rerender } = renderHook(() => usePreferences())

      // Verify initial guest state
      expect(result.current.preferences).toEqual(guestPreferences)

      // Update mock auth state with user having custom preferences
      mockAuth.user = {
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        preferences: {
          language: 'fr', // User already has custom preferences
          keyboardLayout: 'dvorak',
          testDuration: '120',
          showKeyboard: true,
          theme: 'light',
        },
      } as User

      // Trigger re-render to pick up auth changes
      rerender()

      // Wait a bit for any potential async operations
      await act(async () => await new Promise(resolve => setTimeout(resolve, 10)))

      // Should not attempt migration
      expect(mockPayloadFetch).not.toHaveBeenCalled()

      // Should use user's existing preferences
      expect(result.current.preferences).toEqual({
        language: 'fr',
        keyboardLayout: 'dvorak',
        testDuration: '120',
        showKeyboard: true,
        theme: 'light',
        theme: 'light',
      })

      // Should still clear localStorage
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('maxtype-preferences')
    })
  })

  describe('loading states', () => {
    test('should show loading state while auth is loading', () => {
      mockAuth.loading = true

      const { result } = renderHook(() => usePreferences())

      expect(result.current.loading).toBe(true)
    })

    test('should show loading state during API updates', async () => {
      mockAuth.user = {
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        preferences: {
          language: 'en',
          keyboardLayout: 'qwerty',
          testDuration: '30',
          showKeyboard: true,
          theme: 'system',
        },
      } as User

      // Mock slow API response
      mockPayloadFetch.mockImplementation(
        () =>
          new Promise(resolve =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: () => Promise.resolve({ doc: mockAuth.user }),
                }),
              100,
            ),
          ),
      )

      const { result } = renderHook(() => usePreferences())

      act(() => {
        result.current.updatePreferences({
          language: 'es',
          keyboardLayout: 'azerty',
          testDuration: '60',
          showKeyboard: false,
          theme: 'dark',
        })
      })

      expect(result.current.loading).toBe(true)

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
    })
  })
})

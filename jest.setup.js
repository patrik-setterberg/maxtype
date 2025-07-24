import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    }
  },
}))

// Mock environment variables
process.env.NEXT_PUBLIC_CMS_URL = 'http://localhost:3000'

// Mock window.matchMedia (used by some UI components)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock PayloadCMS auth hook for testing (we'll add this when we test components)
// For now, comment out since we're only testing validation schemas
// jest.mock('@/lib/auth', () => ({
//   useAuth: jest.fn(() => ({
//     user: null,
//     loading: false,
//     logout: jest.fn(),
//     isAuthenticated: false,
//   })),
//   getCurrentUser: jest.fn(),
//   logoutUser: jest.fn(),
// }))
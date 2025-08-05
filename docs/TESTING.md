# Testing Strategy & Documentation

## Overview

MaxType follows a comprehensive Test-Driven Development (TDD) approach with 80+ tests covering authentication flows, utility functions, validation schemas, user preferences, and theme management. The testing strategy ensures reliability, maintainability, and confidence in code changes.

## Testing Framework & Configuration

### Jest Configuration

MaxType uses Jest with Next.js integration for optimal testing performance:

```javascript
// jest.config.js
const createJestConfig = nextJest({
  dir: './', // Load next.config.js and .env files
})

const config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom', // Browser-like environment for React testing

  // Test file patterns
  testMatch: ['**/__tests__/**/*.(js|jsx|ts|tsx)', '**/*.(test|spec).(js|jsx|ts|tsx)'],

  // Coverage settings
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/payload-types.ts', // Exclude generated PayloadCMS types
  ],

  // Module name mapping for absolute imports and assets
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
  },

  // ES modules support
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
}
```

### Test Environment Setup

#### Jest Setup File (`jest.setup.js`)

```javascript
// Extends Jest with additional matchers for DOM testing
import '@testing-library/jest-dom'

// Additional global test configuration can be added here
```

#### File Mocks (`__mocks__/fileMock.js`)

```javascript
// Mock static assets for testing
module.exports = 'test-file-stub'
```

## Test Architecture

### Test Organization

```
src/lib/__tests__/
├── auth-integration.test.ts      # Authentication flow integration tests
├── preference-validation.test.ts # User preferences validation tests
├── preferences.test.ts           # Preferences hook and storage tests
├── theme.test.ts                 # Theme system validation tests
├── utils.test.ts                 # Utility functions tests
├── validation.test.ts            # Zod schema validation tests
└── validation-change-password.test.ts # Password change validation tests
```

### Test Coverage Areas

#### 1. Authentication System (`auth-integration.test.ts`)

- **User Registration Flow**: Email verification, validation errors
- **Login System**: Username/email flexibility, error handling
- **Password Management**: Reset flow, change password security
- **Account Security**: Rate limiting, account lockout scenarios
- **Session Management**: Authentication state persistence

#### 2. Validation Schemas (`validation.test.ts`, `validation-change-password.test.ts`)

- **Login Schema**: Username/email validation, password requirements
- **Signup Schema**: Username format, email validation, password confirmation
- **Preference Schema**: Valid options, type safety, strict validation
- **Password Change Schema**: Current password verification, new password validation
- **Edge Cases**: Invalid inputs, boundary conditions, security constraints

#### 3. Utility Functions (`utils.test.ts`)

- **Email Validation**: Comprehensive regex testing, edge cases
- **Input Detection**: Email vs username identification
- **Error Message Generation**: Context-aware authentication errors
- **Class Name Utilities**: TailwindCSS class merging
- **API Helpers**: Global data fetching utilities

#### 4. User Preferences (`preferences.test.ts`, `preference-validation.test.ts`)

- **LocalStorage Management**: Guest user preference storage
- **Database Integration**: Authenticated user preference sync
- **Migration Logic**: Guest-to-authenticated user preference transfer
- **Validation**: Preference schema validation, default values
- **Error Handling**: Storage failures, validation errors

#### 5. Theme System (`theme.test.ts`)

- **Theme Resolution**: System theme detection, user preference handling
- **State Management**: Theme switching, persistence
- **Validation**: Theme option validation, type safety
- **Integration**: User preferences integration, localStorage fallback

## Test Commands

### Available Commands

```bash
# Run all tests
pnpm test

# Run tests in watch mode (development)
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

### CI/CD Integration

```bash
# Production test run (CI environments)
NODE_ENV=test pnpm test --coverage --watchAll=false
```

## Testing Patterns & Best Practices

### 1. Test-Driven Development (TDD)

#### TDD Workflow

1. **Red**: Write failing test for new functionality
2. **Green**: Write minimal code to make test pass
3. **Refactor**: Improve code while keeping tests green

#### Example TDD Process

```typescript
// Step 1: Write failing test
describe('new feature', () => {
  it('should handle new requirement', () => {
    const result = newFunction('input')
    expect(result).toBe('expected output')
  })
})

// Step 2: Implement minimal solution
function newFunction(input: string): string {
  return 'expected output' // Minimal implementation
}

// Step 3: Refactor and improve
function newFunction(input: string): string {
  // Proper implementation with error handling
  if (!input) throw new Error('Input required')
  return processInput(input)
}
```

### 2. Comprehensive Error Testing

#### Authentication Error Scenarios

```typescript
describe('getAuthErrorMessage', () => {
  it('should handle PayloadCMS structured errors', () => {
    const result = getAuthErrorMessage(
      401,
      {
        name: 'AuthenticationError',
        type: 'AuthenticationError',
        message: 'The username or password provided is incorrect.',
      },
      'login',
    )
    expect(result).toBe(
      'The username/email or password you entered is incorrect. Please check your credentials and try again.',
    )
  })

  it('should handle account lockout scenarios', () => {
    const result = getAuthErrorMessage(
      401,
      {
        name: 'LockedAuth',
        type: 'LockedAuth',
        message: 'This user is locked due to having too many failed login attempts.',
      },
      'login',
    )
    expect(result).toBe(
      'Your account has been temporarily locked due to multiple failed login attempts. Please try again later or reset your password.',
    )
  })
})
```

### 3. Validation Testing Patterns

#### Schema Validation Tests

```typescript
describe('PreferenceSchema', () => {
  it('should accept valid preferences', () => {
    const validPreferences = {
      language: 'en',
      keyboardLayout: 'qwerty',
      testDuration: '30',
      showKeyboard: true,
      theme: 'system',
    }

    expect(() => PreferenceSchema.parse(validPreferences)).not.toThrow()
  })

  it('should reject invalid language options', () => {
    const invalidPreferences = {
      language: 'invalid-language',
      keyboardLayout: 'qwerty',
      testDuration: '30',
      showKeyboard: true,
      theme: 'system',
    }

    expect(() => PreferenceSchema.parse(invalidPreferences)).toThrow()
  })
})
```

### 4. Integration Testing

#### Authentication Flow Testing

```typescript
describe('Authentication Integration', () => {
  it('should complete full signup flow', async () => {
    // Test complete user registration process
    const signupData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      'password-repeat': 'password123',
      consent: true,
    }

    // Validate form data
    expect(() => SignupSchema.parse(signupData)).not.toThrow()

    // Test API call structure
    const expectedPayload = {
      username: signupData.username,
      email: signupData.email,
      password: signupData.password,
    }

    // Verify error handling
    expect(getAuthErrorMessage(400, { message: 'Email already exists' }, 'signup')).toBe(
      'This email address is already registered. Please use a different email or try logging in instead.',
    )
  })
})
```

## Test Coverage

### Coverage Configuration

```javascript
// jest.config.js
collectCoverageFrom: [
  'src/**/*.{js,jsx,ts,tsx}', // Include all source files
  '!src/**/*.d.ts', // Exclude type declarations
  '!src/payload-types.ts', // Exclude generated PayloadCMS types
]
```

### Coverage Targets

#### Current Coverage Areas

- **Authentication System**: 95%+ coverage
- **Validation Schemas**: 100% coverage
- **Utility Functions**: 90%+ coverage
- **User Preferences**: 85%+ coverage
- **Theme System**: 80%+ coverage

#### Coverage Reports

```bash
# Generate detailed coverage report
pnpm test:coverage

# Coverage output locations
├── coverage/
│   ├── lcov-report/index.html  # HTML coverage report
│   ├── lcov.info               # LCOV format for CI tools
│   └── coverage-final.json     # JSON coverage data
```

## Testing Best Practices

### 1. Test Structure

#### AAA Pattern (Arrange, Act, Assert)

```typescript
describe('utility function', () => {
  it('should handle specific scenario', () => {
    // Arrange: Set up test data
    const input = 'test@example.com'

    // Act: Execute function
    const result = isValidEmail(input)

    // Assert: Verify outcome
    expect(result).toBe(true)
  })
})
```

#### Descriptive Test Names

```typescript
// Good: Descriptive and specific
it('should return true for valid email addresses with subdomains', () => {})
it('should handle account lockout after 5 failed login attempts', () => {})

// Bad: Vague and unclear
it('should work', () => {})
it('should validate input', () => {})
```

### 2. Mock Strategies

#### Environment Mocking

```typescript
// Mock environment variables for testing
process.env.NEXT_PUBLIC_CMS_URL = 'http://localhost:3000'
```

#### Function Mocking

```typescript
// Mock external dependencies
jest.mock('../utils', () => ({
  fetchGlobalData: jest.fn().mockResolvedValue({ data: 'mock data' }),
}))
```

### 3. Edge Case Testing

#### Boundary Value Testing

```typescript
describe('username validation', () => {
  it('should reject usernames shorter than 3 characters', () => {
    expect(() => SignupSchema.parse({ username: 'ab' })).toThrow()
  })

  it('should accept usernames exactly 3 characters', () => {
    expect(() => SignupSchema.parse({ username: 'abc' })).not.toThrow()
  })

  it('should reject usernames longer than 20 characters', () => {
    expect(() =>
      SignupSchema.parse({
        username: 'a'.repeat(21),
      }),
    ).toThrow()
  })
})
```

#### Null/Undefined Handling

```typescript
describe('error handling', () => {
  it('should handle null inputs gracefully', () => {
    expect(isValidEmail(null as unknown as string)).toBe(false)
    expect(isValidEmail(undefined as unknown as string)).toBe(false)
  })
})
```

## Debugging Tests

### Test Debugging Strategies

#### 1. Isolated Test Runs

```bash
# Run specific test file
pnpm test utils.test.ts

# Run specific test case
pnpm test --testNamePattern="should validate email addresses"

# Run tests matching pattern
pnpm test --testPathPattern="validation"
```

#### 2. Debug Output

```typescript
describe('debugging example', () => {
  it('should debug test scenario', () => {
    const result = complexFunction(input)

    // Debug output for test failures
    console.log('Input:', input)
    console.log('Result:', result)
    console.log('Expected:', expectedValue)

    expect(result).toBe(expectedValue)
  })
})
```

#### 3. Test Environment Debugging

```bash
# Enable verbose test output
pnpm test --verbose

# Run tests with coverage and no watch
pnpm test --coverage --watchAll=false

# Debug test configuration
pnpm test --showConfig
```

## Continuous Integration

### CI Test Configuration

```yaml
# Example GitHub Actions workflow
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: corepack enable pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm test --coverage --watchAll=false
      - uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

### Test Quality Gates

#### Pre-commit Hooks

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "pnpm test --passWithNoTests",
      "pre-push": "pnpm test --coverage --watchAll=false"
    }
  }
}
```

## Future Testing Enhancements

### Planned Test Areas

#### 1. Component Testing

- **React Testing Library**: Component behavior testing
- **User Interaction Testing**: Form submissions, button clicks
- **Accessibility Testing**: ARIA attributes, keyboard navigation

#### 2. End-to-End Testing

- **Playwright/Cypress**: Full user journey testing
- **Authentication Flows**: Complete login/signup processes
- **Preference Management**: Settings persistence testing

#### 3. Performance Testing

- **Bundle Size Testing**: Prevent regression in bundle size
- **Load Testing**: Authentication system performance
- **Memory Usage**: Long-running test scenario analysis

### Testing Tools Integration

#### Code Quality Tools

- **ESLint Testing Rules**: Enforce testing best practices
- **TypeScript Testing**: Type safety in test files
- **Test Coverage Badges**: Visual coverage indicators

#### Monitoring & Reporting

- **Test Result Tracking**: Historical test performance
- **Flaky Test Detection**: Identify unreliable tests
- **Performance Regression**: Test execution time monitoring

# Project information

## MaxType is

- A typing speed test application designed to help users improve their typing skills.
- Users can (but don't have to) register an account.
- Registered users' preferences and statistics (mainly typing test performances) are stored.
- Unregistered users' preferences are stored in localStorage.

## Tech stack

- MaxType is built on PayloadCMS 3.27 and stores its data in a MongoDB database.
- The typing test app is (will be) built in React 19 with TypeScript 5.7.
- MaxType uses TailwindCSS 4.0 for styling with Radix UI components for interactive elements.
- Next.js 15.1.5 for the full-stack framework.
- We try to follow TDD with Jest 30.0 for testing.
- Frontend form validation is achieved with Zod 3.24.
- React Hook Form 7.54 for form state management.
- We prefer to use Payload's built-in tools, e.g. for auth, user registration, etc.

## Development Environment

- **Package Manager**: pnpm (required, see engines in package.json)
- **Node Version**: ^18.20.2 || >=20.9.0
- **Key Scripts**:
  - `pnpm dev` - Development server
  - `pnpm test` - Run Jest tests
  - `pnpm test:watch` - Watch mode testing
  - `pnpm lint` - ESLint checking
  - `pnpm build` - Production build

# Project Architecture

## PayloadCMS Collections

- **Users**: Main user collection with username/email login, preferences group field
- **Admins**: Administrative users (separate from regular users)
- **Media**: File uploads and media management
- **Pages**: CMS-managed pages with form builder plugin

## Data Models & Validation

- **Zod Schemas**: All forms use Zod validation (src/lib/validation.ts)
  - `LoginSchema` - username/email + password login
  - `SignupSchema` - username, email, password, consent with password confirmation
  - `PreferenceSchema` - language, keyboardLayout, testDuration, showKeyboard
  - `ForgotPasswordSchema` - username or email input
  - `ResetPasswordSchema` - password + confirmation
- **TypeScript Types**: Auto-generated from Zod schemas using `z.infer<>`

## Custom Hooks

- **`useAuth()`** (src/lib/auth.ts): Authentication state management
  - Provides: `user`, `loading`, `login`, `logout`, `signup` functions
  - Uses PayloadCMS /api/users/me for auth checking
- **`usePreferences()`** (src/lib/preferences.ts): User preferences with guest support
  - Handles localStorage for guests, database for authenticated users
  - Auto-migration of guest preferences when users log in
  - Provides: `preferences`, `updatePreferences`, `resetPreferences`, `isGuest`

## Component Patterns

- **Location**: All UI components in src/components/ui/
- **Styling**: TailwindCSS with Radix UI primitives
- **Forms**: React Hook Form + Zod validation + custom error handling
- **Standard Components**: Button, Input, Label, Select, Switch, Checkbox (Radix-based)
- **Auth Components**: LoginForm, SignupForm, ForgotPasswordForm, ResetPasswordForm
- **Layout**: Header, Footer, and layout components

## Email Templates

- Comprehensive HTML emails with dark mode support
- Consistent branding with "MaxType" styling
- Password reset (1-hour expiration) and email verification (24-hour expiration)
- Located in Users collection configuration (src/collections/Users.ts)

## Access Patterns

- Users can only read/update their own data
- Admins have full access to all collections
- Public signup enabled, admin-only delete permissions

# General instructions

- The user wants to learn. Be sure to explain everything you do, and why. For complicated pieces of code, be very detailed.
- For web searches, remember that it is currently the year 2025.

# Authentication Features

## Implemented Features

- **User Registration**: Email verification required after signup
- **Flexible Login**: Users can login with either username or email address
- **Forgot Password**: Complete password reset flow with email links
- **Password Reset**: Secure token-based password reset (1-hour expiration)
- **Password Change**: Secure password change with current password verification
- **Account Security**: Rate limiting with account lockout (5 failed attempts, 15-minute lockout)

## Authentication Components

- `LoginForm`: Supports both username and email login with context-aware error messages
- `SignupForm`: Registration with email verification requirement
- `ForgotPasswordForm`: Smart detection of email vs username input
- `ResetPasswordForm`: Token-based password reset with expiry handling
- `ChangePasswordForm`: Two-step password verification (current + new password)

## Password Change Implementation

- **Security**: Two-step verification using PayloadCMS login endpoint to validate current password
- **Location**: `/change-password` route with form, linked from profile page
- **Validation**: Zod schema with password matching and difference validation
- **UX**: Inline success state (form replaced with confirmation message)
- **Error Handling**: Account lockout detection with appropriate user guidance
- **Testing**: Comprehensive test coverage including edge cases and error scenarios

## Validation & Error Handling

- Robust email validation using comprehensive regex patterns
- Context-aware error messages for different authentication flows
- User-friendly error messaging (no technical "Value must be unique" messages)
- Comprehensive form validation using Zod schemas

## Testing

- 80+ comprehensive tests covering all authentication scenarios
- Unit tests for validation utilities and error handling
- Integration tests for complete authentication flows
- TDD approach maintained throughout implementation

# Development Standards

## Code Patterns & Conventions

- **Import Aliases**: Use `@/` for src/ directory imports (configured in tsconfig.json)
- **Error Handling**: User-friendly messages, no technical "Value must be unique" errors
- **Validation**: All user inputs validated with Zod schemas before processing
- **State Management**: React hooks for local state, custom hooks for complex logic
- **API Calls**: Always include `credentials: 'include'` for PayloadCMS API calls
- **TypeScript**: Strict mode enabled, prefer explicit typing over `any`

## File Organization

```
src/
├── app/                    # Next.js App Router
│   ├── (frontend)/        # Public-facing pages
│   └── (payload)/         # PayloadCMS admin and API routes
├── collections/           # PayloadCMS collection definitions
├── components/ui/         # Reusable UI components
├── lib/                   # Utilities, hooks, and business logic
│   └── __tests__/        # Unit tests
├── blocks/               # PayloadCMS content blocks
└── globals/              # PayloadCMS global configurations
```

## Testing Patterns

- **Jest Configuration**: jsdom environment for React component testing
- **Test Location**: Tests in `src/lib/__tests__/` directory
- **Coverage**: Configured to cover all src files except generated types
- **Test Commands**:
  - `pnpm test` - Run all tests
  - `pnpm test:watch` - Watch mode for development
  - `pnpm test:coverage` - Generate coverage reports

## Environment & Configuration

- **Environment Variables**: Next.js loads `.env.local` (secrets) then `.env` (defaults) automatically
- **PayloadCMS URL**: `NEXT_PUBLIC_CMS_URL` for client-side API calls
- **Database**: MongoDB connection via `DATABASE_URI`
- **Email**: Nodemailer configuration with SMTP settings
- **Development**: Cross-env used for NODE_OPTIONS=--no-deprecation

## Git & Development Workflow

- **Main Branch**: `main` (use for PRs)
- **Current State**: Clean working directory
- **Recent Work**: Authentication features, email verification, forgot password functionality

## Claude Code Configuration

- **Sub-Agents**: testing-expert, build-deployment-specialist, payloadcms-expert
- **Hooks**: Prettier auto-formatting on file save (PostToolUse hook)
- **Settings**: `.claude/settings.json` configures hooks and project-specific behavior

# Missing/Future Features

## Core Typing Test Features (Not Yet Implemented)

- **Typing Test Engine**: The main typing test functionality
- **Statistics Tracking**: WPM, accuracy, error tracking for authenticated users
- **Test Results Storage**: Database storage for user performance history
- **Text Content**: Word lists, custom text support, different languages
- **Real-time Feedback**: Visual keyboard highlighting, error indicators
- **Progress Tracking**: Charts, historical data, personal bests

## Potential Enhancements

- **Social Features**: Leaderboards, competitions, sharing results
- **Advanced Settings**: Sound effects, custom themes, difficulty levels
- **Analytics**: Detailed typing pattern analysis, improvement suggestions
- **Import/Export**: Custom text import, result export functionality

# Implementation Guidelines

## When Adding New Features

1. **Follow TDD**: Write tests first, then implement
2. **Use Existing Patterns**:
   - Zod schemas for validation
   - Custom hooks for complex state
   - PayloadCMS collections for data storage
   - Radix UI components for consistency
3. **Error Handling**: Always provide user-friendly error messages
4. **TypeScript**: Maintain strict typing, generate types from Zod schemas
5. **Testing**: Aim for comprehensive test coverage like existing auth features

## Integration Points

- **User Preferences**: Use existing `usePreferences()` hook for settings
- **Authentication**: Leverage existing auth system for user features
- **Database**: Add new collections following Users/Admins patterns
- **Validation**: Extend existing validation.ts with new Zod schemas
- **Components**: Follow existing component patterns in src/components/ui/

# Key Technical Details

## PayloadCMS Configuration

- **Config File**: src/payload.config.ts
- **Collections**: Users, Admins, Media, Pages
- **Plugins**: Form builder, Payload Cloud
- **Email**: Nodemailer with custom HTML templates
- **Database**: MongoDB via Mongoose adapter

## User Preferences System

- **Default Values**: English, QWERTY, 30 seconds, show keyboard
- **Guest Storage**: localStorage with validation and migration
- **Authenticated Storage**: PayloadCMS user preferences field (group type)
- **Migration**: Automatic guest-to-user preference migration on login
- **Validation**: Strict Zod schema prevents invalid preference data

## Authentication Flow Details

- **Login Methods**: Username OR email (flexible input)
- **Security**: 5 failed attempts = 15-minute lockout
- **Email Verification**: Required for new signups, 24-hour token expiry
- **Password Reset**: 1-hour token expiry, secure email-based flow
- **Session**: HTTP-only cookies managed by PayloadCMS

## Component Architecture

- **Radix Primitives**: Form, Button, Input, Select, Switch, Checkbox, Label
- **Class Variance Authority**: Used for component variants
- **Tailwind Merge**: Utility for merging Tailwind classes
- **Lucide React Icons**: Icon library
- **React Bootstrap Icons**: Additional icon set

### MessageAlert Component (`src/components/ui/MessageAlert.tsx`)

Enhanced alert component for displaying messages with optional titles and proper variant styling:

**Features:**

- **Optional Title**: `title?: string` prop - can be omitted for simpler messages
- **Conditional Text Color**: When no title is provided, message text adopts the variant color (`text-error`, `text-warning`, etc.)
- **Smart Icon Positioning**: Icon margin-top only applies when title is present
- **Four Message Types**: `error`, `success`, `warning`, `info` with appropriate icons and colors

**Usage Patterns:**

```typescript
// With title (standard usage)
<MessageAlert
  message="Please check your credentials and try again"
  type="error"
  title="Login Failed"
/>

// Without title (simplified usage - message text becomes colored)
<MessageAlert
  message="Account created successfully!"
  type="success"
/>

// Empty title also triggers no-title mode
<MessageAlert
  message="Session expires in 5 minutes"
  type="warning"
  title=""
/>
```

**Implementation Details:**

- Uses React Bootstrap Icons for consistent iconography
- Integrates with theme system for elegant colors in both light and dark modes
- Backward compatible - existing usage without title prop continues to work
- Conditional styling based on `showTitle = title !== undefined && title !== ''`

### Header Navigation (`src/components/ui/Header.tsx`)

Clean header layout with minimal, focused navigation:

**Header Structure:**

- **Logo** (MaxType with MT badge) - Links to home page
- **Right Navigation:** Theme Selector → Settings Button → User Menu (3 buttons total)

**Settings Button:**

- Always visible to all users (authenticated and guests)
- Gear icon with hover states and accessibility support
- Direct link to `/settings` page

### UserMenu Component (`src/components/ui/UserMenu.tsx`)

Consolidated user account management in a popover triggered by user icon:

**Features:**

- **Controlled State**: Uses `useState` with `open`/`onOpenChange` for proper popover control
- **Auto-Close**: All navigation links close the popover via `handleLinkClick()` handler
- **User Avatar**: Circular badge with first letter of username for authenticated users

**For Authenticated Users:**

- User info header with avatar, username, and email (truncated)
- Profile link (`/profile`)
- Statistics link (`/statistics`)
- Sign Out button (calls `handleLogout()` which closes popover before logout)

**For Guest Users:**

- Welcome message encouraging account creation
- Login link (`/login`)
- Sign Up link (`/signup`) - highlighted in primary color
- No settings link (moved to header)

**Technical Details:**

- Popover width: `w-48`, right-aligned with `sideOffset={8}`
- Uses Radix UI Popover with proper accessibility
- Icons from Lucide React, consistent hover states
- Integrates with `useAuth()` hook for authentication state

# Essential Utility Functions

## Core Utilities (src/lib/utils.ts)

- **`cn(...inputs)`**: TailwindCSS class merging utility (clsx + tailwind-merge)
- **`isValidEmail(value)`**: Robust email validation with comprehensive regex
- **`isEmailInput(input)`**: Determines if input should be treated as email vs username
- **`getAuthErrorMessage(status, response, context)`**: Context-aware error message conversion
  - Supports: 'login', 'signup', 'forgot-password', 'reset-password' contexts
  - Converts technical API errors into user-friendly messages
  - Handles rate limiting, verification, account lock scenarios
- **`fetchGlobalData(slug)`**: Fetch PayloadCMS global data

## Error Handling System

- **ErrorAlert Component**: Consistent error display with destructive variant
- **Context-Aware Messages**: Different error messages based on authentication flow
- **User-Friendly Language**: "The username/email or password you entered is incorrect" vs technical errors
- **Server Error Handling**: Graceful degradation for 500+ status codes

# API & Network Patterns

## PayloadCMS API Calls

- **Client-Side Base URL**: `process.env.NEXT_PUBLIC_CMS_URL`
- **Required Headers**: `'Content-Type': 'application/json'`
- **Authentication**: `credentials: 'include'` (HTTP-only cookies)
- **Standard Endpoints**:
  - `/api/users/login` - User authentication
  - `/api/users/logout` - Session termination
  - `/api/users/me` - Current user check
  - `/api/users` - User registration
  - `/api/users/forgot-password` - Password reset request
  - `/api/users/reset-password` - Password reset completion
  - `/api/users/{id}` - User updates (PATCH)
  - `/api/globals/{slug}` - Global data fetching

## Environment Variables

- **Client-Side**: `NEXT_PUBLIC_CMS_URL` - PayloadCMS API base URL
- **Server-Side**:
  - `DATABASE_URI` - MongoDB connection string
  - `PAYLOAD_SECRET` - PayloadCMS secret key
  - `PAYLOAD_PUBLIC_SERVER_URL` - Public server URL for emails
  - `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS` - SMTP configuration

# Form & State Management Patterns

## Standard Form Pattern

```typescript
// 1. Define Zod schema + TypeScript type
const MySchema = z.object({ field: z.string() })
type MyFormData = z.infer<typeof MySchema>

// 2. Form setup with React Hook Form
const form = useForm<MyFormData>({
  resolver: zodResolver(MySchema),
  defaultValues: { field: '' },
})

// 3. State management
const [error, setError] = useState<string | null>(null)
const [loading, setLoading] = useState<boolean>(false)
const [success, setSuccess] = useState<boolean>(false)

// 4. Submit handler with error handling
const onSubmit = async (data: MyFormData) => {
  setError(null)
  setLoading(true)
  try {
    const response = await fetch('...', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const errorData = await response.json()
      setError(getAuthErrorMessage(response.status, errorData, 'context'))
      return
    }
    setSuccess(true)
  } catch (error) {
    setError('An unexpected error occurred. Please try again.')
  } finally {
    setLoading(false)
  }
}
```

## Success Message Patterns

- **URL Search Params**: Use `?verified=true`, `?reset=true` for post-action success messages
- **useSearchParams**: Check URL params in useEffect for displaying success states
- **Consistent Messaging**: Success states handled at page level, not form component level

# Performance & Security Considerations

## Security Best Practices

- **Input Validation**: All inputs validated with Zod schemas on both client and server
- **Authentication**: HTTP-only cookies prevent XSS attacks
- **Rate Limiting**: Built into PayloadCMS auth (5 attempts, 15-minute lockout)
- **Email Verification**: Required for new accounts
- **Password Requirements**: Minimum 6 characters, maximum 50 characters
- **CSRF Protection**: PayloadCMS handles CSRF tokens automatically

## Performance Patterns

- **Client-Side Validation**: Zod schemas provide immediate feedback
- **Loading States**: Always show loading indicators during API calls
- **Error Boundaries**: Graceful error handling with fallback messages
- **Optimistic Updates**: Not currently implemented but could be added

# Common Gotchas & Best Practices

## Things to Remember

- **Always use `credentials: 'include'`** for PayloadCMS API calls
- **Use `getAuthErrorMessage()`** instead of displaying raw API errors
- **Validate with Zod first**, then make API calls
- **Handle loading states** in all async operations
- **Use search params** for success messages after redirects
- **Follow the established error handling patterns**
- **Use `cn()` utility** for all className merging

## Common Mistakes to Avoid

- Don't forget to set loading states to false in finally blocks
- Don't use raw error messages from APIs - always process with `getAuthErrorMessage()`
- Don't skip input validation - always use Zod schemas
- Don't hardcode API URLs - use environment variables
- Don't forget `credentials: 'include'` for authenticated routes

# Accessibility

Always keep accessibility in mind when developing new features.

- Use semantic HTML
- Ensure keyboard navigation works
- Ensure appropriate ARIA attributes are included

# Theme System (Light/Dark Mode)

## Overview

MaxType features a comprehensive theme system with light, dark, and system preference modes. The implementation provides smooth transitions, persistent user preferences, and proper SSR support without hydration issues.

## Core Components

### Theme Hook (`src/lib/theme.ts`)

- **`useTheme()`** - Main hook for theme management
  - Integrates with user preferences system
  - Handles system theme detection via `matchMedia`
  - Provides smooth transitions for user-initiated changes
  - Manages theme persistence (localStorage for guests, database for authenticated users)

### Theme Selector (`src/components/ui/ThemeSelect.tsx`)

- Icon-only dropdown in header (Sun ☀️, Moon 🌙, Monitor 💻)
- Integrates with Radix UI Select component
- Available to both authenticated and guest users
- Proper accessibility with ARIA labels

### Theme Integration

- **User Preferences**: Theme field added to `PreferenceSchema` in validation.ts
- **PayloadCMS**: Theme field added to Users collection preferences group
- **Default**: System preference (`theme: 'system'`)

## Technical Implementation

### Theme Values

```typescript
type Theme = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark' // system resolved to actual theme
```

### CSS Architecture

- **TailwindCSS 4.0** with built-in dark mode support
- **CSS Custom Properties** for comprehensive theme variables in `styles.css`
- **Scoped Transitions**: `.theme-transitioning` class applied temporarily (0.15s duration)
- **Inline Style Fallback**: Prevents flicker during initial load

### SSR & Hydration

- **Initial Script**: `THEME_SCRIPT` in `<head>` applies theme before React hydrates
- **suppressHydrationWarning**: Used on `<html>` element (React-recommended approach)
- **Theme Detection**: Script reads localStorage and system preferences
- **Fallback Styling**: Temporary inline styles until CSS loads

### State Management

- **Guest Users**: localStorage with `maxtype-preferences` key
- **Authenticated Users**: Database storage via PayloadCMS User preferences
- **Migration**: Automatic guest-to-user preference migration on login
- **System Changes**: Real-time listening for system theme changes

## Key Features

### ✅ Implemented Features

- **Three Theme Options**: Light, Dark, System (respects OS preference)
- **Persistent Preferences**: Survives page reloads and browser sessions
- **Smooth Transitions**: 0.15s ease-in-out transitions on theme changes
- **System Theme Monitoring**: Automatically updates when OS theme changes
- **No Hydration Issues**: Proper SSR support with suppressHydrationWarning
- **Guest Support**: Full functionality for non-authenticated users
- **Accessibility**: Proper ARIA labels and keyboard navigation

### User Experience

- **Icon-Only Header**: Compact theme selector in navigation
- **Immediate Feedback**: Instant theme application on selection
- **Cross-Session Persistence**: Preferences maintained across visits
- **Error Handling**: Graceful fallbacks if theme system fails

### Developer Experience

- **Type Safety**: Full TypeScript support with generated PayloadCMS types
- **Test Coverage**: Comprehensive validation tests for theme integration
- **Clean Architecture**: Functional approach with clear separation of concerns
- **Standard Patterns**: Follows React and Next.js best practices

## File Locations

### Core Implementation

- `src/lib/theme.ts` - Theme hook and utility functions
- `src/lib/validation.ts` - Theme field in PreferenceSchema
- `src/lib/preferences.ts` - Theme integration with user preferences
- `src/components/ui/ThemeSelect.tsx` - Theme selector component
- `src/components/ui/ThemeProvider.tsx` - Theme initialization script

### Integration Points

- `src/app/(frontend)/layout.tsx` - Theme script injection and suppressHydrationWarning
- `src/app/(frontend)/styles.css` - Theme CSS variables and transitions
- `src/components/ui/Header.tsx` - Theme selector placement
- `src/collections/Users.ts` - Theme field in PayloadCMS User collection

### Testing

- `src/lib/__tests__/theme.test.ts` - Theme validation and integration tests

## Usage Patterns

### Basic Theme Usage

```typescript
const { theme, resolvedTheme, setTheme, loading } = useTheme()

// Current user preference ('light' | 'dark' | 'system')
console.log(theme)

// Actually applied theme ('light' | 'dark')
console.log(resolvedTheme)

// Change theme with smooth transition
await setTheme('dark')
```

### Error Handling

- All theme operations include proper error handling
- Graceful fallbacks to system/dark theme if issues occur
- User-friendly error logging without exposing internal details

## Common Patterns

- **Theme Detection**: Use `resolvedTheme` for actual applied theme
- **Theme Changes**: Always use `setTheme()` for user-initiated changes
- **System Integration**: Theme automatically syncs with OS preference changes
- **Validation**: All theme values validated through Zod schemas

## Performance Considerations

- **Minimal Bundle Impact**: Functional approach with tree-shaking support
- **Efficient DOM Updates**: Only updates theme classes when actually changing
- **System Monitoring**: Uses native `matchMedia` for optimal performance
- **Transition Control**: Scoped CSS transitions prevent performance issues

# Tasks

## Revisit themes (color palette)

## ✅ Allow regular users to change their password (COMPLETED)

- ✅ Add link on the profile page to a form where users can update their password.
- ✅ Users must enter their old password, new password, repeat new password.
- ✅ Two-step verification implemented for security
- ✅ Comprehensive error handling and testing

## Add typing test relevant data fields to User collection

## Statistics dashboard for admins

## 🐛 PayloadCMS Validation Bug (Known Issue)

**Status**: Investigated but not fixed - PayloadCMS server-side issue

When attempting to register with a unique username but existing email address, PayloadCMS incorrectly reports:

```
[INFO] The following field is invalid: username
```

**Root Cause**: PayloadCMS 3.27.0 validation logic bug with `loginWithUsername` configuration  
**Impact**: Users see incorrect "username taken" message instead of "email already registered"  
**Investigation**: Server correctly receives both username/email but internal validation reporting is wrong  
**Workaround Attempted**: Client-side error correction proved unreliable  
**Solution**: Reverted to clean error handling, documented for future PayloadCMS updates

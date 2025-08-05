# Authentication System Documentation

## Overview

MaxType implements a comprehensive authentication system built on PayloadCMS with flexible login options, secure password management, and robust error handling.

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

## Authentication Flow Details

- **Login Methods**: Username OR email (flexible input)
- **Security**: 5 failed attempts = 15-minute lockout
- **Email Verification**: Required for new signups, 24-hour token expiry
- **Password Reset**: 1-hour token expiry, secure email-based flow
- **Session**: HTTP-only cookies managed by PayloadCMS

## Custom Hooks

### `useAuth()` (src/lib/auth.ts)

Authentication state management:

- Provides: `user`, `loading`, `login`, `logout`, `signup` functions
- Uses PayloadCMS /api/users/me for auth checking

## Known Issues

### 🐛 PayloadCMS Validation Bug

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

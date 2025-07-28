# Project information
## MaxType is
- A typing speed test application designed to help users improve their typing skills.
- Users can (but don't have to) register an account.
- Registered users' preferences and statistics (mainly typing test performances) are stored.
- Unregistered users' preferences are stored in localStorage.

## Tech stack
- MaxType is built on PayloadCMS and stores its data in a MongoDB database.
- The typing test app is (will be) built in React with TypeScript.
- MaxType uses TailwindCSS for the majority of its styles and probably some custom styles in the future.
- We try to follow TDD.
- Testing is so far done with Jest. Additional testing tools will probably be added in the future.
- Frontend form validation is achieved with zod.
- We prefer (where reasonable) to use Payload's built-in tools, e.g. for auth, user registration, etc.


# General instructions
- The user wants to learn. Be sure to explain everything you do, and why. For complicated pieces of code, be very detailed.
- For web searches, remember that it is currently the year 2025.

# Authentication Features
## Implemented Features
- **User Registration**: Email verification required after signup
- **Flexible Login**: Users can login with either username or email address
- **Forgot Password**: Complete password reset flow with email links
- **Password Reset**: Secure token-based password reset (1-hour expiration)
- **Account Security**: Rate limiting with account lockout (5 failed attempts, 15-minute lockout)

## Authentication Components
- `LoginForm`: Supports both username and email login with context-aware error messages
- `SignupForm`: Registration with email verification requirement
- `ForgotPasswordForm`: Smart detection of email vs username input
- `ResetPasswordForm`: Token-based password reset with expiry handling

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

# Tasks

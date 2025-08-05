# MaxType Project Overview

## What MaxType Is

- A typing speed test application designed to help users improve their typing skills
- Users can (but don't have to) register an account
- Registered users' preferences and statistics (mainly typing test performances) are stored
- Unregistered users' preferences are stored in localStorage

## Tech Stack

- **Backend**: PayloadCMS 3.27.0 with MongoDB database
- **Frontend**: React 19.0.0 with TypeScript 5.7.3, Next.js 15.1.5
- **Styling**: TailwindCSS 4.0.12 with Radix UI components
- **Testing**: Jest 30.0.5 with TDD approach
- **Forms**: React Hook Form 7.54.2 + Zod 3.24.2 validation
- **Package Manager**: pnpm ^10 (required)

## Project Architecture

### PayloadCMS Collections

- **Users**: Main user collection with username/email login, preferences group field
- **Admins**: Administrative users (separate from regular users)
- **Media**: File uploads and media management
- **Pages**: CMS-managed pages with form builder plugin

### Data Models & Validation

- **Zod Schemas**: All forms use Zod validation (src/lib/validation.ts)
  - `LoginSchema`, `SignupSchema`, `PreferenceSchema`, `ForgotPasswordSchema`, `ResetPasswordSchema`
- **TypeScript Types**: Auto-generated from Zod schemas using `z.infer<>`

### Key Hooks

- **`useAuth()`** (src/lib/auth.ts): Authentication state management
- **`usePreferences()`** (src/lib/preferences.ts): User preferences with guest support
- **`useTheme()`** (src/lib/theme.ts): Theme management with light/dark/system modes

### Email Templates

- Comprehensive HTML emails with dark mode support
- Password reset (1-hour expiration) and email verification (24-hour expiration)
- Located in Users collection configuration (src/collections/Users.ts)

## General Instructions

- The user wants to learn. Be sure to explain everything you do, and why. For complicated pieces of code, be very detailed.
- For web searches, remember that it is currently the year 2025.

## Detailed Documentation

For comprehensive information on specific aspects of the project, see:

- **[Authentication System](./docs/AUTHENTICATION.md)** - Complete authentication features, password management, security
- **[Component Architecture](./docs/COMPONENTS.md)** - UI components, forms, patterns, accessibility
- **[Theme System](./docs/THEME-SYSTEM.md)** - OKLCH color palette, design philosophy, light/dark mode implementation
- **[Development Guidelines](./docs/DEVELOPMENT.md)** - ESLint config, code quality, patterns, utilities, best practices
- **[Testing Strategy](./docs/TESTING.md)** - TDD approach, Jest configuration, 80+ tests, coverage reporting
- **[Deployment & Security](./docs/DEPLOYMENT.md)** - Docker setup, security headers, production deployment, monitoring

## User Preferences System

- **Default Values**: English, QWERTY, 30 seconds, show keyboard, system theme
- **Guest Storage**: localStorage with validation and migration
- **Authenticated Storage**: PayloadCMS user preferences field (group type)
- **Migration**: Automatic guest-to-user preference migration on login

## Access Patterns

- Users can only read/update their own data
- Admins have full access to all collections
- Public signup enabled, admin-only delete permissions

## Missing/Future Features

### Core Typing Test Features (Not Yet Implemented)

- **Typing Test Engine**: The main typing test functionality
- **Statistics Tracking**: WPM, accuracy, error tracking for authenticated users
- **Test Results Storage**: Database storage for user performance history
- **Text Content**: Word lists, custom text support, different languages
- **Real-time Feedback**: Visual keyboard highlighting, error indicators
- **Progress Tracking**: Charts, historical data, personal bests

### Potential Enhancements

- **Social Features**: Leaderboards, competitions, sharing results
- **Advanced Settings**: Sound effects, custom themes, difficulty levels
- **Analytics**: Detailed typing pattern analysis, improvement suggestions
- **Import/Export**: Custom text import, result export functionality

## Key Technical Details

### PayloadCMS Configuration

- **Config File**: src/payload.config.ts
- **Collections**: Users, Admins, Media, Pages
- **Plugins**: Form builder, Payload Cloud
- **Email**: Nodemailer with custom HTML templates
- **Database**: MongoDB via Mongoose adapter

## Advanced PayloadCMS Patterns

### Collection Architecture

#### Users Collection (`src/collections/Users.ts`)

- **Authentication**: Flexible username/email login with PayloadCMS auth
- **Rate Limiting**: 5 failed attempts → 15-minute lockout
- **Email Templates**: Custom HTML with dark mode support
- **Preferences Field**: Group field with language, theme, keyboard layout settings
- **Validation**: Custom username validation with regex patterns
- **Access Control**: Users can only read/update their own data

#### Admins Collection (`src/collections/Admins.ts`)

- **Separate Auth**: Independent admin authentication system
- **Full Access**: Complete CRUD permissions across all collections
- **Admin Panel**: PayloadCMS admin interface at `/admin`

#### Media Collection

- **File Storage**: Local disk storage with Sharp optimization
- **Image Processing**: Automatic image optimization and resizing
- **Access Control**: Proper file permissions and security

#### Pages Collection

- **Content Management**: CMS-managed pages with form builder
- **Dynamic Routing**: `[slug]` based routing for CMS pages
- **Form Builder Integration**: Custom form creation capabilities

### Plugin Integrations

#### Form Builder Plugin

```typescript
formBuilderPlugin({
  fields: {
    payment: false, // Disable payment fields
  },
  formOverrides: {
    fields: ({ defaultFields }) => [
      {
        name: 'slug',
        type: 'text',
        required: true,
        unique: true,
      },
      ...defaultFields,
    ],
  },
})
```

#### Email System Integration

- **Nodemailer Adapter**: SMTP configuration with environment variables
- **Custom Templates**: Beautiful HTML emails with consistent branding
- **Verification Emails**: 24-hour expiry tokens for account verification
- **Password Reset**: 1-hour expiry tokens for secure password reset
- **Dark Mode Support**: Responsive email templates with theme support

### Advanced Features

#### Custom Validation Patterns

- **Username Validation**: Alphanumeric + dashes/underscores, 3-20 characters
- **Email Validation**: Comprehensive regex with detailed error messages
- **Password Security**: Minimum 6 characters with confirmation requirements
- **Preference Validation**: Strict Zod schemas with enum validation

#### Authentication Flow

- **Dual Login**: Username OR email acceptance
- **Context-Aware Errors**: Different error messages per authentication context
- **Account Security**: Automatic lockout with clear user guidance
- **Session Management**: HTTP-only cookies with proper expiration

#### Access Control Patterns

```typescript
// Users can only access their own data
read: ({ req: { user } }) => {
  if (user?.collection === 'admins') return true
  if (user?.collection === 'users') return { id: { equals: user.id } }
  return false
}
```

## Current Tasks

### ✅ Completed Features

- **Authentication System**: Complete user registration, login, password reset/change
- **Theme System**: Light/dark/system theme support with persistence
- **User Preferences**: Guest and authenticated user preference management
- **Component Library**: Comprehensive UI components with Radix integration

### 🚧 Upcoming Tasks

- **Revisit themes (color palette)**: Refine visual design
- **Add typing test relevant data fields to User collection**: Prepare for test results storage
- **Statistics dashboard for admins**: Administrative reporting features

## important-instruction-reminders

Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (\*.md) or README files. Only create documentation files if explicitly requested by the User.

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
- **[TypeThree Analysis](./docs/TYPETHREE-ANALYSIS.md)** - Analysis of previous typing test implementation for MaxType development
- **[Typing Test Implementation Plan](./docs/TYPING-TEST-IMPLEMENTATION.md)** - Complete 12-task implementation roadmap with session-based breakdown

## User Preferences System

- **Default Values**: English, QWERTY, 30 seconds, show keyboard, system theme
- **Guest Storage**: localStorage with validation and migration
- **Authenticated Storage**: PayloadCMS user preferences field (group type)
- **Migration**: Automatic guest-to-user preference migration on login

## Access Patterns

- Users can only read/update/delete their own data
- Admins have full access to all collections
- Public signup enabled, self-service account deletion

## Missing/Future Features

### Core Typing Test Features (Implementation Planned)

- **Typing Test Engine**: The main typing test functionality (based on TypeThree analysis)
- **Statistics Tracking**: WPM, accuracy, error tracking for authenticated users
- **Test Results Storage**: Database storage for user performance history
- **Text Content**: Word lists, custom text support, different languages
- **Real-time Feedback**: Visual keyboard highlighting, error indicators
- **Progress Tracking**: Charts, historical data, personal bests

**Implementation Strategy**: Migrate and modernize the existing TypeThree implementation

- High-precision timing system using `performance.now()`
- TailwindCSS styling integration with MaxType's OKLCH color system
- PayloadCMS User collection integration for result persistence
- Enhanced accessibility and mobile support
- Multi-layout keyboard support (6 layouts: QWERTY, DVORAK, AZERTY, etc.)

See **[TypeThree Analysis](./docs/TYPETHREE-ANALYSIS.md)** for detailed migration plan.

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

- **Authentication System**: Complete user registration, login, password reset/change, account deletion
- **Theme System**: Light/dark/system theme support with persistence
- **User Preferences**: Guest and authenticated user preference management
- **Component Library**: Comprehensive UI components with Radix integration
- **Typing Test Foundation** (Task 1): PayloadCMS collections, data models, statistics engine, text type system

#### Task 1 Detailed Completion Summary:

**New Files Created**:

- `src/collections/TypingTestResults.ts` - Comprehensive typing test results collection
- `src/lib/statistics.ts` - Statistics computation utility for anonymous users
- `src/lib/__tests__/statistics.test.ts` - 17 comprehensive statistics tests
- `src/lib/__tests__/text-security.test.ts` - Security validation tests for custom text
- `src/components/ui/textarea.tsx` - shadcn/ui Textarea component

**Key Files Enhanced**:

- `src/collections/Users.ts` - Added simplified typing statistics and text type preferences
- `src/lib/validation.ts` - Added TypingTestResultSchema and UserStatsSchema
- `src/components/ui/PreferenceFormFields.tsx` - Added text type selector with custom text area
- `src/lib/utils.ts` - Added XSS security sanitization functions
- `src/payload-types.ts` - Auto-generated TypeScript types updated

**Features Implemented**:

- ✅ Complete TypingTestResults collection with comprehensive metrics tracking
- ✅ Anonymous user session support with privacy-compliant statistics
- ✅ 5 text types: words, sentences, paragraphs, punctuation, custom text
- ✅ Security sanitization for custom text input (XSS prevention)
- ✅ User preferences UI with text type selection and custom text area
- ✅ PayloadCMS-compatible simplified user statistics (resolved login issues)
- ✅ Comprehensive test coverage (142 tests total)
- ✅ Production-ready build with zero linting errors

### 🚧 Upcoming Tasks (17-Session Implementation Plan)

**Complete typing test implementation via clean rewrite with advanced analytics** - See [Implementation Plan](./docs/TYPING-TEST-IMPLEMENTATION.md)

**Phase 1: Foundation & Data Setup**

- ✅ Task 1: PayloadCMS Collections Setup (TypingTestResults + Users) - **COMPLETED**
- Task 2: Word Data and Content Management
- Task 3: Core Algorithms and Utilities

**Phase 2: Core Components**

- Task 4: High-Precision Timer System
- Task 5: Text Display and Highlighting Engine
- Task 6: Input Handling and Keyboard Events

**Phase 3: Advanced Features**

- Task 7: Visual Keyboard Component
- Task 8: Results and Scoring System
- Task 9: User Statistics and History Tracking

**Phase 4: Integration & Polish**

- Task 10: Authentication Integration
- Task 11: Mobile Responsiveness and Accessibility
- Task 12: Testing Coverage and Performance Optimization

**Phase 5: Advanced Features & Analytics**

- Task 13: Leaderboard System
- Task 14: Admin Analytics Dashboard
- Task 15: Anonymous User Session Management

**Phase 6: Language & Localization Enhancements**

- Task 16: Enhanced Language Support Implementation (6 languages with special characters)
- Task 17: Advanced Keyboard Layout System (8 layouts with language correlations)

**Other Tasks**:

- **Revisit themes (color palette)**: Refine visual design to match typing test UI

## important-instruction-reminders

Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (\*.md) or README files. Only create documentation files if explicitly requested by the User.

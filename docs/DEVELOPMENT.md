# Development Guidelines & Standards

## Development Environment

- **Package Manager**: pnpm (required, see engines in package.json)
- **Node Version**: ^18.20.2 || >=20.9.0
- **Key Scripts**:
  - `pnpm dev` - Development server
  - `pnpm test` - Run Jest tests
  - `pnpm test:watch` - Watch mode testing
  - `pnpm lint` - ESLint checking
  - `pnpm build` - Production build

## Code Patterns & Conventions

- **Import Aliases**: Use `@/` for src/ directory imports (configured in tsconfig.json)
- **Error Handling**: User-friendly messages, no technical "Value must be unique" errors
- **Validation**: All user inputs validated with Zod schemas before processing
- **State Management**: React hooks for local state, custom hooks for complex logic
- **API Calls**: Always include `credentials: 'include'` for PayloadCMS API calls
- **TypeScript**: Strict mode enabled, prefer explicit typing over `any`

## Code Quality & Linting

### ESLint Configuration

MaxType uses a sophisticated ESLint setup with custom rules for optimal developer experience:

```javascript
// eslint.config.mjs
const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      '@typescript-eslint/ban-ts-comment': 'warn', // Allow @ts-ignore with warnings
      '@typescript-eslint/no-empty-object-type': 'warn', // Flexible object typing
      '@typescript-eslint/no-explicit-any': 'warn', // Discourage but allow 'any'
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
          argsIgnorePattern: '^_', // Allow _unused parameters
          varsIgnorePattern: '^_', // Allow _unused variables
          destructuredArrayIgnorePattern: '^_', // Allow [_unused, used]
          caughtErrorsIgnorePattern: '^(_|ignore)', // Allow catch (_error)
        },
      ],
    },
  },
]
```

#### ESLint Philosophy

- **Warning-Based Approach**: Uses `warn` instead of `error` for better developer experience
- **Flexibility**: Allows necessary TypeScript escape hatches when needed
- **Unused Variable Patterns**: Smart unused variable detection with naming conventions
- **Next.js Integration**: Full Next.js and TypeScript rule integration

### Prettier Integration

Prettier is integrated via Claude Code hooks for automatic formatting:

```json
// .claude/settings.json
{
  "hooks": {
    "PostToolUse": "prettier --write ${file}"
  }
}
```

#### Formatting Standards

- **Automatic Formatting**: Files auto-formatted on save via Claude Code
- **Consistent Style**: Ensures consistent code style across the project
- **Integration**: Works seamlessly with ESLint for comprehensive code quality

## Project Scaffolding & Configuration

### Shadcn/UI Integration

MaxType integrates with Shadcn/UI for consistent component architecture:

```json
// components.json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/(frontend)/styles.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

#### Shadcn/UI Features

- **New York Style**: Clean, modern component styling
- **RSC Support**: React Server Components compatibility
- **TypeScript First**: Full TypeScript integration
- **Custom Base Color**: Neutral base with custom color palette
- **CSS Variables**: Theme-aware CSS custom properties
- **Lucide Icons**: Consistent icon library integration

#### Component Integration Patterns

```typescript
// Shadcn/UI components follow consistent patterns
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Custom components extend Shadcn/UI patterns
import { MessageAlert } from '@/components/ui/MessageAlert'
import { ThemeSelect } from '@/components/ui/ThemeSelect'
```

#### Available UI Components

- **Form Components**: Button, Input, Label, Select, Switch, Checkbox
- **Layout Components**: Card, Popover, Alert (MessageAlert)
- **Custom Components**: ThemeSelect, UserMenu, Header, Footer
- **Theme Integration**: All components support light/dark themes automatically

#### Icon Libraries Integration

- **Primary**: Lucide React (consistent modern icons)
- **Secondary**: React Bootstrap Icons (specific use cases)
- **Usage Pattern**: Import specific icons to optimize bundle size

```typescript
import { Settings, Sun, Moon, Monitor } from 'lucide-react'
import { ExclamationTriangleFill } from 'react-bootstrap-icons'
```

### PostCSS Configuration

```javascript
// postcss.config.mjs
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

#### Build Pipeline

- **TailwindCSS 4.0**: Latest TailwindCSS with PostCSS integration
- **Optimized Bundle**: Automatic CSS purging and optimization
- **Development Mode**: Fast rebuild times with efficient caching

### TypeScript Configuration

```json
// tsconfig.json (key sections)
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "paths": {
      "@/*": ["./src/*"],
      "@payload-config": ["./src/payload.config.ts"]
    }
  }
}
```

#### TypeScript Features

- **Strict Mode**: Maximum type safety enabled
- **Modern Target**: ES2022 for optimal performance
- **Path Mapping**: Clean imports with `@/` alias
- **PayloadCMS Integration**: Direct payload config imports

## PayloadCMS Collections

### Admins Collection (`src/collections/Admins.ts`)

Simple administrative user collection with minimal configuration:

```typescript
import type { CollectionConfig } from 'payload'

export const Admins: CollectionConfig = {
  slug: 'admins',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'username',
      type: 'text',
      required: true,
      unique: true,
    },
  ],
}
```

#### Admin Features

- **Separate Authentication**: Independent from regular users
- **Full CMS Access**: Complete CRUD permissions across all collections
- **Admin Panel Access**: Access to PayloadCMS admin interface at `/admin`
- **Username Field**: Additional username field beyond default email
- **Email as Title**: Uses email for display in admin interface

#### Admin vs User Distinction

- **Admins**: CMS management, full data access, admin panel access
- **Users**: Application users, restricted data access, frontend-only interaction
- **Security**: Completely separate authentication systems prevent privilege escalation

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

## Advanced Development Patterns

### Dependency Management

#### Package Manager Requirements

```json
{
  "engines": {
    "node": "^18.20.2 || >=20.9.0",
    "pnpm": "^10"
  },
  "pnpm": {
    "onlyBuiltDependencies": ["sharp"]
  }
}
```

#### Key Dependencies

- **Framework**: Next.js 15.1.5 with App Router
- **PayloadCMS**: 3.27.0 with MongoDB adapter
- **UI Components**: Radix UI primitives with Class Variance Authority
- **Styling**: TailwindCSS 4.0.12 with CSS variables
- **Forms**: React Hook Form 7.54.2 with Zod 3.24.2 validation
- **Testing**: Jest 30.0.5 with React Testing Library
- **TypeScript**: 5.7.3 with strict mode

#### Development Dependencies

- **Code Quality**: ESLint 9.21.0 with Next.js 15.1.5 config
- **Formatting**: Prettier 3.5.3 with Claude Code integration
- **Testing**: Jest Environment jsdom 30.0.5, React Testing Library 16.3.0
- **Type Safety**: @types packages for all major dependencies
- **Build Tools**: Cross-env 7.0.3 for consistent NODE_OPTIONS

### Performance Optimization

#### Bundle Optimization

```bash
# Cross-env for consistent NODE_OPTIONS across platforms
NODE_OPTIONS=--no-deprecation next build
```

#### Build Performance

- **Incremental Builds**: TypeScript incremental compilation enabled
- **Module Resolution**: Bundler mode for optimal tree-shaking
- **Sharp Integration**: Optimized image processing with native binaries
- **Dependency Isolation**: Only built dependencies specified in pnpm config

### Import Patterns & Code Organization

#### Import Alias Strategy

```typescript
// Absolute imports with consistent patterns
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/lib/auth'
import { LoginSchema } from '@/lib/validation'
import config from '@payload-config'
```

#### File Naming Conventions

- **Components**: PascalCase (e.g., `LoginForm.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.ts`)
- **Utilities**: camelCase (e.g., `utils.ts`)
- **Types**: PascalCase with `types` suffix (e.g., `auth.types.ts`)
- **Tests**: Same as source with `.test.ts` suffix

#### Module Organization Principles

- **Single Responsibility**: Each file has one clear purpose
- **Barrel Exports**: Use index files for clean public APIs
- **Type Co-location**: Types defined near their usage
- **Test Co-location**: Tests in `__tests__` directories

## Environment & Configuration

### Environment Variable Management

- **Environment Variables**: Next.js loads `.env.local` (secrets) then `.env` (defaults) automatically
- **PayloadCMS URL**: `NEXT_PUBLIC_CMS_URL` for client-side API calls
- **Database**: MongoDB connection via `DATABASE_URI`
- **Email**: Nodemailer configuration with SMTP settings
- **Development**: Cross-env used for NODE_OPTIONS=--no-deprecation

### Build Configuration

```javascript
// next.config.mjs - Key configurations
const nextConfig = {
  // Security headers for all routes
  async headers() {
    /* comprehensive security headers */
  },

  // PayloadCMS integration
  experimental: {
    reactCompiler: false, // PayloadCMS compatibility
  },
}

export default withPayload(nextConfig)
```

### Development Tools Integration

#### VS Code Configuration

```json
// .vscode/settings.json (recommended)
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": false, // Claude Code handles formatting
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

#### Git Configuration

```gitignore
# Key ignores for MaxType
.env*.local
/media
*.tsbuildinfo
coverage/
.next/
```

## Git & Development Workflow

- **Main Branch**: `main` (use for PRs)
- **Current State**: Clean working directory
- **Recent Work**: Authentication features, email verification, forgot password functionality

## Claude Code Configuration

- **Sub-Agents**: testing-expert, build-deployment-specialist, payloadcms-expert
- **Hooks**: Prettier auto-formatting on file save (PostToolUse hook)
- **Settings**: `.claude/settings.json` configures hooks and project-specific behavior

## Implementation Guidelines

### When Adding New Features

1. **Follow TDD**: Write tests first, then implement
2. **Use Existing Patterns**:
   - Zod schemas for validation
   - Custom hooks for complex state
   - PayloadCMS collections for data storage
   - Radix UI components for consistency
3. **Error Handling**: Always provide user-friendly error messages
4. **TypeScript**: Maintain strict typing, generate types from Zod schemas
5. **Testing**: Aim for comprehensive test coverage like existing auth features

### Integration Points

- **User Preferences**: Use existing `usePreferences()` hook for settings
- **Authentication**: Leverage existing auth system for user features
- **Database**: Add new collections following Users/Admins patterns
- **Validation**: Extend existing validation.ts with new Zod schemas
- **Components**: Follow existing component patterns in src/components/ui/

## Essential Utility Functions

### Core Utilities (src/lib/utils.ts)

- **`cn(...inputs)`**: TailwindCSS class merging utility (clsx + tailwind-merge)
- **`isValidEmail(value)`**: Robust email validation with comprehensive regex
- **`isEmailInput(input)`**: Determines if input should be treated as email vs username
- **`getAuthErrorMessage(status, response, context)`**: Context-aware error message conversion
  - Supports: 'login', 'signup', 'forgot-password', 'reset-password' contexts
  - Converts technical API errors into user-friendly messages
  - Handles rate limiting, verification, account lock scenarios
- **`fetchGlobalData(slug)`**: Fetch PayloadCMS global data

## API & Network Patterns

### PayloadCMS API Calls

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

### Environment Variables

- **Client-Side**: `NEXT_PUBLIC_CMS_URL` - PayloadCMS API base URL
- **Server-Side**:
  - `DATABASE_URI` - MongoDB connection string
  - `PAYLOAD_SECRET` - PayloadCMS secret key
  - `PAYLOAD_PUBLIC_SERVER_URL` - Public server URL for emails
  - `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS` - SMTP configuration

## Performance & Security Considerations

### Security Best Practices

- **Input Validation**: All inputs validated with Zod schemas on both client and server
- **Authentication**: HTTP-only cookies prevent XSS attacks
- **Rate Limiting**: Built into PayloadCMS auth (5 attempts, 15-minute lockout)
- **Email Verification**: Required for new accounts
- **Password Requirements**: Minimum 6 characters, maximum 50 characters
- **CSRF Protection**: PayloadCMS handles CSRF tokens automatically

### Performance Patterns

- **Client-Side Validation**: Zod schemas provide immediate feedback
- **Loading States**: Always show loading indicators during API calls
- **Error Boundaries**: Graceful error handling with fallback messages
- **Optimistic Updates**: Not currently implemented but could be added

## Common Gotchas & Best Practices

### Things to Remember

- **Always use `credentials: 'include'`** for PayloadCMS API calls
- **Use `getAuthErrorMessage()`** instead of displaying raw API errors
- **Validate with Zod first**, then make API calls
- **Handle loading states** in all async operations
- **Use search params** for success messages after redirects
- **Follow the established error handling patterns**
- **Use `cn()` utility** for all className merging

### Common Mistakes to Avoid

- Don't forget to set loading states to false in finally blocks
- Don't use raw error messages from APIs - always process with `getAuthErrorMessage()`
- Don't skip input validation - always use Zod schemas
- Don't hardcode API URLs - use environment variables
- Don't forget `credentials: 'include'` for authenticated routes

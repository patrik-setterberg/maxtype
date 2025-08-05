# Component Architecture Documentation

## Overview

MaxType follows a consistent component architecture using Radix UI primitives with TailwindCSS styling and comprehensive TypeScript typing.

## Component Patterns

- **Location**: All UI components in src/components/ui/
- **Styling**: TailwindCSS with Radix UI primitives
- **Forms**: React Hook Form + Zod validation + custom error handling
- **Standard Components**: Button, Input, Label, Select, Switch, Checkbox (Radix-based)
- **Auth Components**: LoginForm, SignupForm, ForgotPasswordForm, ResetPasswordForm
- **Layout**: Header, Footer, and layout components

## Component Architecture

- **Radix Primitives**: Form, Button, Input, Select, Switch, Checkbox, Label
- **Class Variance Authority**: Used for component variants
- **Tailwind Merge**: Utility for merging Tailwind classes
- **Lucide React Icons**: Icon library
- **React Bootstrap Icons**: Additional icon set

## Key Components

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

## Form & State Management Patterns

### Standard Form Pattern

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

### Success Message Patterns

- **URL Search Params**: Use `?verified=true`, `?reset=true` for post-action success messages
- **useSearchParams**: Check URL params in useEffect for displaying success states
- **Consistent Messaging**: Success states handled at page level, not form component level

## Error Handling System

- **ErrorAlert Component**: Consistent error display with destructive variant
- **Context-Aware Messages**: Different error messages based on authentication flow
- **User-Friendly Language**: "The username/email or password you entered is incorrect" vs technical errors
- **Server Error Handling**: Graceful degradation for 500+ status codes

## Accessibility

Always keep accessibility in mind when developing new features.

- Use semantic HTML
- Ensure keyboard navigation works
- Ensure appropriate ARIA attributes are included

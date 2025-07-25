import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'username',
  },
  auth: {
    maxLoginAttempts: 5,        // Lock account after 5 failed login attempts
    lockTime: 15 * 60 * 1000,   // Unlock after 15 minutes (in milliseconds)
  },
  access: {
    // Allow public user creation (signup)
    create: () => true,
    // Only allow users to read their own data or admins to read all
    read: ({ req: { user } }) => {
      if (user?.collection === 'admins') return true
      if (user?.collection === 'users') return { id: { equals: user.id } }
      return false
    },
    // Users can update their own data, admins can update all
    update: ({ req: { user } }) => {
      if (user?.collection === 'admins') return true
      if (user?.collection === 'users') return { id: { equals: user.id } }
      return false
    },
    // Only admins can delete users
    delete: ({ req: { user } }) => user?.collection === 'admins',
  },
  fields: [
    // Email added by default
    {
      name: 'username',
      type: 'text',
      required: true,
      unique: true,
      validate: (value: string | string[] | null | undefined) => {
        if (typeof value === 'string') {
          const isValid = /^[a-zA-Z0-9_-]+$/.test(value)
          if (!isValid) {
            return 'Username must contain only letters, numbers, dashes, or underscores'
          }
          if (value.length < 3 || value.length > 20) {
            return 'Username must be between 3 and 20 characters'
          }
          if (/[-_]{2,}/.test(value)) {
            return 'Username must not have consecutive dashes or underscores'
          }
          return true
        }
        return 'Invalid value'
      },
    },
    {
      name: 'preferences',
      type: 'group',
      fields: [
        {
          name: 'language',
          type: 'select',
          options: [
            { label: 'English', value: 'en' },
            { label: 'Spanish', value: 'es' },
            { label: 'French', value: 'fr' },
            { label: 'German', value: 'de' },
            { label: 'Swedish', value: 'sv' },
          ],
          required: true,
          defaultValue: 'en',
        },
        {
          name: 'keyboardLayout',
          type: 'select',
          options: [
            { label: 'QWERTY', value: 'qwerty' },
            { label: 'AZERTY', value: 'azerty' },
            { label: 'DVORAK', value: 'dvorak' },
            { label: 'COLEMAK', value: 'colemak' },
          ],
          required: true,
          defaultValue: 'qwerty',
        },
        {
          name: 'testDuration',
          type: 'select',
          options: [
            { label: '30 seconds', value: '30' },
            { label: '60 seconds', value: '60' },
            { label: '120 seconds', value: '120' },
          ],
          required: true,
          defaultValue: '30',
        },
        {
          name: 'showKeyboard',
          type: 'checkbox',
          label: 'Show Keyboard',
          required: true,
          defaultValue: true,
        },
      ],
    },
  ],
}

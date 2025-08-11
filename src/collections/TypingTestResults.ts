import type { CollectionConfig } from 'payload'

export const TypingTestResults: CollectionConfig = {
  slug: 'typing-test-results',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'wpm', 'accuracy', 'language', 'testDuration', 'createdAt'],
    listSearchableFields: ['user', 'sessionId', 'language'],
  },
  access: {
    // Allow creation for both authenticated and anonymous users
    create: () => true,
    // Users can only read their own results, admins can read all
    read: ({ req: { user } }) => {
      if (user?.collection === 'admins') return true
      if (user?.collection === 'users') return { user: { equals: user.id } }
      // Allow anonymous users to read their session results
      return false // Anonymous access handled via API endpoints with session validation
    },
    // Prevent updates - results are immutable once created
    update: () => false,
    // Only admins can delete results
    delete: ({ req: { user } }) => {
      return user?.collection === 'admins'
    },
  },
  fields: [
    // User association (optional for anonymous users)
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      index: true,
      admin: {
        description: 'Associated user account (null for anonymous users)',
      },
    },
    // Session ID for anonymous user tracking
    {
      name: 'sessionId',
      type: 'text',
      required: false,
      index: true,
      admin: {
        description: 'Unique session identifier for anonymous users',
        readOnly: true,
      },
    },
    // Test configuration
    {
      name: 'testConfig',
      type: 'group',
      fields: [
        {
          name: 'language',
          type: 'select',
          required: true,
          options: [
            { label: 'English', value: 'en' },
            { label: 'Spanish', value: 'es' },
            { label: 'French', value: 'fr' },
            { label: 'German', value: 'de' },
            { label: 'Swedish', value: 'sv' },
            { label: 'Portuguese', value: 'pt' },
          ],
          index: true,
        },
        {
          name: 'keyboardLayout',
          type: 'select',
          required: true,
          options: [
            { label: 'QWERTY (US English)', value: 'qwerty_us' },
            { label: 'QWERTY (Swedish)', value: 'qwerty_sv' },
            { label: 'AZERTY (French)', value: 'azerty_fr' },
            { label: 'QWERTZ (German)', value: 'qwertz_de' },
            { label: 'QWERTY (Spanish)', value: 'qwerty_es' },
            { label: 'QWERTY (Portuguese)', value: 'qwerty_pt' },
            { label: 'DVORAK (US)', value: 'dvorak_us' },
            { label: 'COLEMAK', value: 'colemak' },
          ],
        },
        {
          name: 'testDuration',
          type: 'select',
          required: true,
          options: [
            { label: '30 seconds', value: '30' },
            { label: '60 seconds', value: '60' },
            { label: '120 seconds', value: '120' },
          ],
          index: true,
        },
        {
          name: 'showKeyboard',
          type: 'checkbox',
          required: true,
          defaultValue: true,
        },
        {
          name: 'textType',
          type: 'select',
          required: true,
          options: [
            { label: 'Random Words', value: 'words' },
            { label: 'Random Sentences', value: 'sentences' },
            { label: 'Full Paragraphs', value: 'paragraphs' },
            { label: 'Punctuation Practice', value: 'punctuation' },
            { label: 'Custom Text', value: 'custom' },
          ],
          defaultValue: 'words',
          index: true,
          admin: {
            description: 'Type of text content used for the typing test',
          },
        },
        {
          name: 'textSource',
          type: 'text',
          required: false,
          admin: {
            description:
              'Source attribution for the text content (e.g., "Shakespeare Hamlet", "Top 1000 Words", "User Imported")',
          },
        },
        {
          name: 'textContentHash',
          type: 'text',
          required: false,
          admin: {
            description: 'Hash of the actual text content for consistency analysis',
            readOnly: true,
          },
        },
      ],
    },
    // Core performance metrics
    {
      name: 'results',
      type: 'group',
      fields: [
        {
          name: 'wpm',
          type: 'number',
          required: true,
          min: 0,
          max: 300, // Reasonable upper limit for WPM
          admin: {
            description: 'Words per minute (gross WPM)',
          },
          index: true,
        },
        {
          name: 'netWpm',
          type: 'number',
          required: true,
          min: 0,
          max: 300,
          admin: {
            description: 'Net words per minute (adjusted for errors)',
          },
          index: true,
        },
        {
          name: 'accuracy',
          type: 'number',
          required: true,
          min: 0,
          max: 100,
          admin: {
            description: 'Accuracy percentage (0-100)',
          },
          index: true,
        },
        {
          name: 'consistency',
          type: 'number',
          required: true,
          min: 0,
          max: 100,
          admin: {
            description: 'Consistency percentage based on timing variance',
          },
        },
      ],
    },
    // Detailed character and word statistics
    {
      name: 'statistics',
      type: 'group',
      fields: [
        {
          name: 'totalCharacters',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            description: 'Total characters typed',
          },
        },
        {
          name: 'correctCharacters',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            description: 'Number of correctly typed characters',
          },
        },
        {
          name: 'incorrectCharacters',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            description: 'Number of incorrectly typed characters',
          },
        },
        {
          name: 'totalWords',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            description: 'Total words in the test text',
          },
        },
        {
          name: 'correctWords',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            description: 'Number of correctly typed words',
          },
        },
        {
          name: 'incorrectWords',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            description: 'Number of incorrectly typed words',
          },
        },
        {
          name: 'extraCharacters',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            description: 'Extra characters typed beyond the test text',
          },
        },
        {
          name: 'missedCharacters',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            description: 'Characters missed/skipped in the test text',
          },
        },
      ],
    },
    // Error analysis for improvement suggestions
    {
      name: 'errorAnalysis',
      type: 'group',
      fields: [
        {
          name: 'incorrectWordsList',
          type: 'array',
          required: false,
          fields: [
            {
              name: 'word',
              type: 'text',
              required: true,
            },
            {
              name: 'typed',
              type: 'text',
              required: true,
            },
            {
              name: 'position',
              type: 'number',
              required: true,
              min: 0,
            },
          ],
          admin: {
            description: 'List of words that were typed incorrectly',
          },
        },
        {
          name: 'commonMistakes',
          type: 'array',
          required: false,
          fields: [
            {
              name: 'character',
              type: 'text',
              required: true,
              maxLength: 1,
            },
            {
              name: 'typedAs',
              type: 'text',
              required: true,
              maxLength: 1,
            },
            {
              name: 'frequency',
              type: 'number',
              required: true,
              min: 1,
            },
          ],
          admin: {
            description: 'Common character substitution errors',
          },
        },
      ],
    },
    // Timing and performance data
    {
      name: 'timingData',
      type: 'group',
      fields: [
        {
          name: 'actualDuration',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            description: 'Actual test duration in milliseconds',
          },
        },
        {
          name: 'pausedDuration',
          type: 'number',
          required: true,
          min: 0,
          defaultValue: 0,
          admin: {
            description: 'Total time paused during test (ms)',
          },
        },
        {
          name: 'keystrokeTimings',
          type: 'json',
          required: false,
          admin: {
            description: 'Detailed keystroke timing data for analysis',
            condition: () => false, // Hide from admin UI
          },
        },
      ],
    },
    // Personal best detection
    {
      name: 'isPersonalBest',
      type: 'group',
      fields: [
        {
          name: 'wpmPB',
          type: 'checkbox',
          required: false,
          defaultValue: false,
          admin: {
            description: 'Personal best WPM for this configuration',
          },
        },
        {
          name: 'accuracyPB',
          type: 'checkbox',
          required: false,
          defaultValue: false,
          admin: {
            description: 'Personal best accuracy for this configuration',
          },
        },
        {
          name: 'consistencyPB',
          type: 'checkbox',
          required: false,
          defaultValue: false,
          admin: {
            description: 'Personal best consistency for this configuration',
          },
        },
      ],
    },
    // Metadata for analytics and debugging
    {
      name: 'metadata',
      type: 'group',
      fields: [
        {
          name: 'userAgent',
          type: 'text',
          required: false,
          admin: {
            description: 'User agent string for device/browser analytics',
            readOnly: true,
          },
        },
        {
          name: 'ipAddress',
          type: 'text',
          required: false,
          admin: {
            description: 'IP address (anonymized for privacy)',
            readOnly: true,
          },
        },
        {
          name: 'testTextHash',
          type: 'text',
          required: false,
          admin: {
            description: 'Hash of the test text used (for consistency analysis)',
            readOnly: true,
          },
        },
        {
          name: 'version',
          type: 'text',
          required: false,
          defaultValue: '1.0.0',
          admin: {
            description: 'Typing test engine version',
            readOnly: true,
          },
        },
      ],
    },
  ],
  // TODO: Add database indexes after types are generated
  // Indexes will be added programmatically for optimal query performance
}

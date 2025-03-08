import type { CollectionConfig } from 'payload'

import { Form } from '../blocks/Form'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Page',
    plural: 'Pages',
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'blocks',
      type: 'blocks',
      blocks: [Form],
    },
    // Add additional fields here as needed.
  ],
  access: {
    read: () => true, // Allow read access to everyone
  },
}

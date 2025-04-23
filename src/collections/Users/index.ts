import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: () => true,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['firstName', 'lastName', 'email'],
    useAsTitle: 'email',
  },
  auth: {
    verify: false,
    maxLoginAttempts: 5,
    lockTime: 600000,
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['user'],
      options: [
        {
          value: 'admin',
          label: 'Admin',
        },
        {
          value: 'user',
          label: 'User',
        },
      ],
    },
    {
      name: 'password',
      type: 'text',
      hidden: true,
    },
  ],
  timestamps: true,
}

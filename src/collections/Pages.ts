import type { CollectionConfig } from 'payload/types'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true, // อนุญาตให้อ่านได้โดยไม่ต้อง authenticate
  },
  // ... rest of the config
} 
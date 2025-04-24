import type { CollectionConfig } from 'payload'
import { slugField } from '@/fields/slug'
// Remove block imports
// import { Banner } from '@/blocks/Banner/index' 
// import { Content } from '@/blocks/Content/index'
// import { MediaBlock } from '@/blocks/MediaBlock/index'
// import { CallToAction } from '@/blocks/CallToAction/index'
// import { ArchiveBlock } from '@/blocks/ArchiveBlock/index'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  access: {
    read: () => true, // อนุญาตให้อ่านได้โดยไม่ต้อง authenticate
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    // Restore the 'content' richText field
    {
      name: 'content',
      type: 'richText',
    },
    // Remove the 'layout' blocks field
    // {
    //   name: 'layout',
    //   label: 'Page Layout',
    //   type: 'blocks',
    //   minRows: 1,
    //   blocks: [
    //     Banner, 
    //     Content,
    //     MediaBlock,
    //     CallToAction,
    //     ArchiveBlock,
    //   ],
    // },
    ...slugField('title'),
  ],
  // ... rest of the config
} 
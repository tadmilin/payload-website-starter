import type { CollectionConfig } from 'payload'

export const Consultations: CollectionConfig = {
  slug: 'consultations',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'phone', 'propertyType', 'createdAt'],
    group: 'Content',
  },
  access: {
    read: () => true,
    create: () => true,
    update: ({ req }) => req.user?.roles?.includes('admin'),
    delete: ({ req }) => req.user?.roles?.includes('admin'),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'ชื่อ / Name',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'อีเมล / Email',
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      label: 'เบอร์โทรศัพท์ / Phone',
    },
    {
      name: 'propertyType',
      type: 'select',
      required: true,
      options: [
        {
          label: 'บ้าน / Home',
          value: 'home',
        },
        {
          label: 'ธุรกิจ / Business',
          value: 'business',
        },
      ],
      defaultValue: 'home',
      label: 'ประเภทที่อยู่อาศัย / Property Type',
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'ข้อความ / Message',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        {
          label: 'รอดำเนินการ / Pending',
          value: 'pending',
        },
        {
          label: 'ติดต่อแล้ว / Contacted',
          value: 'contacted',
        },
        {
          label: 'เสร็จสิ้น / Completed',
          value: 'completed',
        },
      ],
      defaultValue: 'pending',
      admin: {
        position: 'sidebar',
      },
      label: 'สถานะ / Status',
    },
  ],
  timestamps: true,
}

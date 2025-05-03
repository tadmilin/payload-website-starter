import React from 'react'
import { PayloadAdminWithoutLayout } from '@payloadcms/next/layouts'
import type { AdminProps } from 'payload/config'

// Component นี้จะถูกใช้แทน Root component ของ Payload Admin
// โดยไม่มีการสร้าง HTML tags ที่ซ้ำซ้อน
export const AdminWithoutHTMLLayout: React.FC<AdminProps> = (props) => {
  return <PayloadAdminWithoutLayout {...props} />
}

// ตั้งค่า default exports เพื่อให้ Payload ใช้ component นี้
export default {
  Root: AdminWithoutHTMLLayout,
}

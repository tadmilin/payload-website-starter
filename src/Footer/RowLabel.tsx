'use client'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

// กำหนด type ที่ต้องการแทนการนำเข้าจาก payload-types
type NavItem = {
  link?: {
    label?: string
    type?: 'custom' | 'reference'
    url?: string
    newTab?: boolean
  }
}

export const RowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NavItem>()

  const label = data?.data?.link?.label
    ? `Nav item ${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}: ${data?.data?.link?.label}`
    : 'Row'

  return <div>{label}</div>
}

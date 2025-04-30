import { HeaderClient } from './Component.client'
import React from 'react'

// กำหนด type HeaderData และสร้างข้อมูลตัวอย่าง
type HeaderData = {
  navItems: {
    link: {
      type: 'custom' | 'reference'
      label: string
      url: string
      newTab?: boolean
    }
  }[]
}

export async function Header() {
  // ใช้ข้อมูล hard-coded แทนการดึงจาก global
  const headerData: HeaderData = {
    navItems: [
      {
        link: {
          type: 'custom',
          label: 'หน้าแรก',
          url: '/',
        },
      },
      {
        link: {
          type: 'custom',
          label: 'สินค้า',
          url: '/shop',
        },
      },
      {
        link: {
          type: 'custom',
          label: 'บทความ',
          url: '/posts',
        },
      },
      {
        link: {
          type: 'custom',
          label: 'ติดต่อเรา',
          url: '/contact-us',
        },
      },
    ],
  }

  return <HeaderClient data={headerData} />
}

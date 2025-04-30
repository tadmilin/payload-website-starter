import Link from 'next/link'
import React from 'react'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

// กำหนด type สำหรับ footer ให้ตรงกับ CMSLinkType
type FooterNavItem = {
  link: {
    type: 'custom' | 'reference' | null
    label: string | null
    url?: string | null
    newTab?: boolean | null
  }
}

interface FooterData {
  navItems: FooterNavItem[]
}

export async function Footer() {
  // ใช้ข้อมูล hard-coded แทนการดึงจาก global
  const footerData: FooterData = {
    navItems: [
      {
        link: {
          type: 'custom',
          label: 'หน้าแรก',
          url: '/',
          newTab: null,
        },
      },
      {
        link: {
          type: 'custom',
          label: 'Admin',
          url: '/admin',
          newTab: null,
        },
      },
    ],
  }

  const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto border-t border-border bg-black dark:bg-card text-white">
      <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        <Link className="flex items-center" href="/">
          <Logo />
        </Link>

        <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
          <ThemeSelector />
          <nav className="flex flex-col md:flex-row gap-4">
            {navItems.map(({ link }, i) => {
              return <CMSLink className="text-white" key={i} {...link} />
            })}
          </nav>
        </div>
      </div>
    </footer>
  )
}

'use client'

import React from 'react'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'
import { CMSLink } from '@/components/Link'

// กำหนด type ที่ต้องการแทนการนำเข้าจาก payload-types
type CustomHeader = {
  navItems?: {
    link?: {
      type?: 'custom' | 'reference'
      label?: string
      url?: string
      newTab?: boolean
    }
  }[]
}

export const HeaderNav: React.FC<{ data: CustomHeader }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex gap-3 items-center">
      {navItems.map(({ link }, i) => {
        return <CMSLink key={i} {...link} appearance="link" />
      })}
      <Link href="/search">
        <span className="sr-only">Search</span>
        <SearchIcon className="w-5 text-primary" />
      </Link>
    </nav>
  )
}

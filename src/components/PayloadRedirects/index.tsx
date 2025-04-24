import type React from 'react'
import type { Page, Post } from '@/payload-types'
import type { Config } from 'src/payload-types'

import { getCachedDocument } from '@/utilities/getDocument'
import { getCachedRedirects } from '@/utilities/getRedirects'
import { notFound, redirect } from 'next/navigation'

interface Props {
  disableNotFound?: boolean
  url: string
}

// สร้าง interface สำหรับ Redirect ที่แยกออกมาจาก DataFromCollectionSlug
interface RedirectShape {
  from: string;
  to?: {
    url?: string;
    reference?: {
      relationTo?: string;
      value?: string | { slug?: string };
    };
  };
}

// Type สำหรับ Collection ที่ได้รับการสนับสนุน
type ValidCollection = keyof Config['collections'];
const validCollections: ValidCollection[] = ['pages', 'posts', 'users', 'media', 'categories'];

/* This component helps us with SSR based dynamic redirects */
export const PayloadRedirects: React.FC<Props> = async ({ disableNotFound, url }) => {
  try {
    const redirects = await getCachedRedirects()()

    // ตรวจสอบคุณสมบัติของ redirect โดยไม่ใช้ type predicate
    const redirectItem = redirects.find((redirect) => {
      return redirect && typeof redirect === 'object' && 'from' in redirect && redirect.from === url
    })

    if (redirectItem && typeof redirectItem === 'object' && 'to' in redirectItem) {
      const to = redirectItem.to

      if (to && typeof to === 'object' && 'url' in to && to.url && typeof to.url === 'string') {
        redirect(to.url)
      }

      let redirectUrl: string | undefined

      if (to && typeof to === 'object' && 'reference' in to && 
          to.reference && typeof to.reference === 'object' && 
          'relationTo' in to.reference && to.reference.relationTo && 
          'value' in to.reference && to.reference.value) {
        
        const relationTo = to.reference.relationTo as string
        
        // ตรวจสอบว่า relationTo เป็น collection ที่รองรับหรือไม่
        if (validCollections.includes(relationTo as ValidCollection)) {
          const value = to.reference.value

          if (typeof value === 'string') {
            const collection = relationTo as ValidCollection
            const id = value

            const document = (await getCachedDocument(collection, id)()) as Page | Post
            redirectUrl = `${relationTo !== 'pages' ? `/${relationTo}` : ''}/${document?.slug}`
          } else if (typeof value === 'object' && value !== null && 'slug' in value) {
            redirectUrl = `${relationTo !== 'pages' ? `/${relationTo}` : ''}/${value.slug || ''}`
          }

          if (redirectUrl) redirect(redirectUrl)
        }
      }
    }
  } catch (error) {
    console.error('Error in PayloadRedirects:', error)
    // ในกรณีที่มีข้อผิดพลาด (เช่น redirects collection ไม่มีอยู่) เราจะไม่ทำอะไร
  }

  if (disableNotFound) return null

  notFound()
}

import type { Metadata } from 'next'
import type { SlugParams } from '@/types/app-router'
import type { RequiredDataFromCollectionSlug } from 'payload'

import React, { cache } from 'react'
import { draftMode } from 'next/headers'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { homeStatic } from '@/endpoints/seed/home-static'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'

/**
 * สร้าง static paths สำหรับหน้าต่างๆ
 */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const payload = await getPayload({ config: configPromise })
    const pages = await payload.find({
      collection: 'pages',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: {
        slug: true,
      },
    })

    // กรองเฉพาะหน้าที่มี slug และไม่ใช่หน้า home
    const params = pages.docs
      ?.filter((doc) => {
        return doc.slug !== 'home' && doc.slug !== undefined && doc.slug !== null
      })
      .map(({ slug }) => {
        return { slug: slug || '' }
      })

    return params || []
  } catch (error) {
    console.error('Error in generateStaticParams:', error)
    return []
  }
}

/**
 * Component สำหรับแสดงหน้าตาม slug
 */
export default async function Page({ params }: { params: SlugParams }): Promise<JSX.Element> {
  const draft = (await draftMode()).isEnabled === true
  const { slug = 'home' } = params
  const url = '/' + slug

  let page: RequiredDataFromCollectionSlug<'pages'> | null = null

  // ดึงข้อมูลหน้าจาก Payload CMS
  page = await queryPageBySlug({
    slug,
  })

  // สำหรับการพัฒนา: ใช้ข้อมูลตัวอย่างถ้าไม่พบหน้า home
  if (!page && slug === 'home') {
    page = homeStatic
  }

  // ถ้าไม่พบหน้า ให้แสดง redirects
  if (!page) {
    return <PayloadRedirects url={url} />
  }

  // แยกข้อมูล hero และ layout จากหน้า
  const hero = 'hero' in page ? page.hero : undefined
  const layout = 'layout' in page && Array.isArray(page.layout) ? page.layout : []

  return (
    <article className="pt-16 pb-24">
      <PageClient />
      {/* สนับสนุนการ redirect สำหรับหน้าที่ถูกต้อง */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      {hero && typeof hero === 'object' && <RenderHero {...hero} />}
      {Array.isArray(layout) && <RenderBlocks blocks={layout} />}
    </article>
  )
}

/**
 * สร้าง metadata สำหรับหน้า
 */
export async function generateMetadata({ params }: { params: SlugParams }): Promise<Metadata> {
  const { slug = 'home' } = params
  const page = await queryPageBySlug({
    slug,
  })

  return generateMeta({ doc: page })
}

/**
 * ฟังก์ชัน cache สำหรับดึงข้อมูลหน้าจาก slug
 */
const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

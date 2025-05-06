/**
 * Type definitions สำหรับข้อมูลที่เกี่ยวข้องกับ Payload CMS
 */

import type { Page, Post, Media, User } from '@/payload-types'

/**
 * PayloadCollection interface สำหรับอ้างอิงประเภทคอลเลกชันที่มีอยู่ใน Payload
 */
export interface PayloadCollections {
  pages: Page
  posts: Post
  media: Media
  users: User
}

/**
 * CollectionSlug type สำหรับอ้างอิงชื่อคอลเลกชันทั้งหมด
 */
export type CollectionSlug = keyof PayloadCollections

/**
 * PayloadCollection<T> interface สำหรับกำหนดผลลัพธ์การค้นหาจาก Payload
 */
export interface PayloadCollection<T> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

/**
 * PayloadError interface สำหรับการจัดการ error จาก Payload API
 */
export interface PayloadError {
  name: string
  message: string
  data?: unknown
  status?: number
}

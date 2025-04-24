import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

export async function getRedirects(depth = 1) {
  try {
    const payload = await getPayload({ config: configPromise })

    // ตรวจสอบว่า redirects collection มีอยู่หรือไม่
    // ใช้ Object.keys แทน .map เนื่องจาก collections เป็น Record ไม่ใช่ Array
    const collections = Object.keys(payload.collections)

    if (!collections.includes('redirects')) {
      console.warn('Collection "redirects" not found in Payload config')
      return []
    }

    const { docs: redirects } = await payload.find({
      collection: 'redirects' as any,
      depth,
      limit: 0,
      pagination: false,
    })

    return redirects
  } catch (error) {
    console.error('Error fetching redirects:', error)
    return []
  }
}

/**
 * Returns a unstable_cache function mapped with the cache tag for 'redirects'.
 *
 * Cache all redirects together to avoid multiple fetches.
 */
export const getCachedRedirects = () =>
  unstable_cache(async () => getRedirects(), ['redirects'], {
    tags: ['redirects'],
  })

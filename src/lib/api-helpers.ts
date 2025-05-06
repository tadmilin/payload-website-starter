/**
 * Utility functions สำหรับการจัดการ API request และ response
 */
import type { PayloadError } from '@/types/payload'

/**
 * จัดการ API error
 */
export class ApiError extends Error {
  status: number
  data?: unknown

  constructor(message: string, status: number = 500, data?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }

  /**
   * แปลง response จาก fetch เป็น ApiError
   */
  static async fromResponse(response: Response): Promise<ApiError> {
    let data: unknown

    try {
      data = await response.json()
    } catch (e) {
      data = await response.text()
    }

    let message = response.statusText

    if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') {
      message = data.message
    }

    return new ApiError(message, response.status, data)
  }
}

/**
 * สร้าง fetch options พร้อม headers ที่จำเป็น
 */
export function createFetchOptions(options: RequestInit = {}): RequestInit {
  const headers = new Headers(options.headers || {})

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json')
  }

  // เพิ่ม credentials เพื่อรองรับ cookies สำหรับ authentication
  return {
    ...options,
    headers,
    credentials: 'include',
  }
}

/**
 * ทำ API request ด้วย fetch และจัดการ error
 */
export async function apiRequest<T = unknown>(url: string, options: RequestInit = {}): Promise<T> {
  const fetchOptions = createFetchOptions(options)

  try {
    const response = await fetch(url, fetchOptions)

    if (!response.ok) {
      throw await ApiError.fromResponse(response)
    }

    // สำหรับ response ที่ไม่มีข้อมูล (204 No Content)
    if (response.status === 204) {
      return null as T
    }

    // สำหรับ method HEAD หรือ OPTIONS
    if (options.method === 'HEAD' || options.method === 'OPTIONS') {
      return null as T
    }

    return (await response.json()) as T
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    if (error instanceof Error) {
      throw new ApiError(`Network error: ${error.message}`, 0)
    }

    throw new ApiError('Unknown error occurred', 500)
  }
}

/**
 * สร้าง URL สำหรับ API request
 */
export function createApiUrl(
  path: string,
  params?: Record<string, string | number | boolean | null | undefined>,
): string {
  const url = new URL(
    path,
    typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_SERVER_URL,
  )

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.append(key, String(value))
      }
    })
  }

  return url.toString()
}

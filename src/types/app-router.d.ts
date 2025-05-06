/**
 * Type definitions for Next.js App Router
 * ไฟล์นี้รวม type ที่จำเป็นสำหรับ Next.js App Router
 */

/**
 * PageProps interface สำหรับ App Router
 */
declare interface PageProps<T = Record<string, string>> {
  params: T
  searchParams?: { [key: string]: string | string[] | undefined }
}

/**
 * Generic params สำหรับหน้าที่มี slug parameter
 */
export interface SlugParams {
  slug: string
}

/**
 * Generic params สำหรับหน้าที่มี pageNumber parameter
 */
export interface PageNumberParams {
  pageNumber: string
}

/**
 * Page component interface สำหรับ App Router
 */
export interface PageComponent<T = Record<string, string>> {
  (props: PageProps<T>): Promise<JSX.Element> | JSX.Element
}

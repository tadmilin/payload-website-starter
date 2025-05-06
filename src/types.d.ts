// ไฟล์นี้กำหนด types ที่จำเป็นสำหรับ NextJS App Router

// กำหนด type สำหรับ NextJS PageProps
declare interface PageProps {
  params: { [key: string]: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}

// เพิ่ม override เพื่อแก้ไขปัญหา Promise type
interface PageProps {
  params: { [key: string]: string }
}

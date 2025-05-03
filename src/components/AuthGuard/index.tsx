'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/AuthProvider'

interface AuthGuardProps {
  children: React.ReactNode
  fallbackPath?: string
  requiredRoles?: string[]
}

/**
 * คอมโพเนนต์สำหรับป้องกันการเข้าถึงหน้าที่ต้องล็อกอินก่อน
 * จะตรวจสอบว่าผู้ใช้ล็อกอินแล้วหรือไม่ ถ้ายังไม่ล็อกอิน จะเปลี่ยนเส้นทางไปยังหน้า login
 * สามารถระบุ roles ที่อนุญาตให้เข้าถึงได้ ถ้าผู้ใช้ไม่มี role ที่กำหนด จะไม่อนุญาตให้เข้าถึง
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  fallbackPath = '/login',
  requiredRoles = [],
}) => {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // ถ้ากำลังโหลดข้อมูลผู้ใช้ รอจนกว่าจะเสร็จ
    if (isLoading) return

    // ถ้าไม่ได้ล็อกอิน นำไปยังหน้าล็อกอิน
    if (!isAuthenticated) {
      router.replace(fallbackPath)
      return
    }

    // ถ้ามีการระบุ roles ที่อนุญาต
    if (requiredRoles.length > 0 && user) {
      // ตรวจสอบว่าผู้ใช้มี role ที่อนุญาตหรือไม่
      const hasRequiredRole = requiredRoles.some((role) => user.roles?.includes(role))
      if (!hasRequiredRole) {
        // ถ้าไม่มี role ที่อนุญาต นำไปยังหน้าหลัก
        router.replace('/')
      }
    }
  }, [isAuthenticated, isLoading, router, fallbackPath, requiredRoles, user])

  // แสดง loading หรือไม่แสดงอะไรเลยระหว่างกำลังตรวจสอบการล็อกอิน
  if (isLoading || !isAuthenticated) {
    return <div className="flex items-center justify-center h-screen">กำลังโหลด...</div>
  }

  // ถ้ามีการระบุ roles และผู้ใช้ไม่มี role ที่อนุญาต
  if (
    requiredRoles.length > 0 &&
    user &&
    !requiredRoles.some((role) => user.roles?.includes(role))
  ) {
    return (
      <div className="flex items-center justify-center h-screen">ไม่มีสิทธิ์เข้าถึงหน้านี้</div>
    )
  }

  // ถ้าล็อกอินแล้วและมี role ที่อนุญาต แสดงเนื้อหา
  return <>{children}</>
}

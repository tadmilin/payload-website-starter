'use client'

import React, { createContext, useState, useContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthVerificationService } from '@/services/AuthVerificationService'

// กำหนดประเภทข้อมูลผู้ใช้
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  roles: string[]
  [key: string]: any // สำหรับข้อมูลอื่นๆ ที่อาจมี
}

// กำหนดประเภทของ context
interface AuthContextType {
  isLoading: boolean
  isAuthenticated: boolean
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

// สร้าง context สำหรับการจัดการ authentication
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// สร้าง provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const router = useRouter()

  // โหลดข้อมูลผู้ใช้จาก localStorage เมื่อคอมโพเนนต์ถูกโหลด
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (typeof window !== 'undefined') {
          const storedToken = localStorage.getItem('payloadToken')
          const storedUser = localStorage.getItem('user')

          if (storedToken && storedUser) {
            setToken(storedToken)
            setUser(JSON.parse(storedUser))
            setIsAuthenticated(true)
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        // หากเกิดข้อผิดพลาด (เช่น JSON ไม่ถูกต้อง) ให้ล้างข้อมูลที่เก็บไว้
        localStorage.removeItem('payloadToken')
        localStorage.removeItem('user')
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // ฟังก์ชันสำหรับล็อกอิน
  const login = async (email: string, password: string) => {
    console.log('Starting login process for email:', email)
    setIsLoading(true)
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      // ดึง error message ที่แท้จริงจาก response
      const errorMessage =
        data.message ||
        (Array.isArray(data.errors) && data.errors.length > 0 && data.errors[0].message) ||
        data.error ||
        ''

      if (!response.ok) {
        console.log('Login response error:', response.status, JSON.stringify(data, null, 2))

        // ตรวจสอบ UnverifiedEmail จาก error message ที่แท้จริง
        if (
          response.status === 403 &&
          ((data.type && data.type === 'UnverifiedEmail') ||
            (data.name && data.name === 'UnverifiedEmail') ||
            (errorMessage && errorMessage.toLowerCase().includes('verify')))
        ) {
          console.log('UnverifiedEmail condition matched')

          // ใช้ AuthVerificationService เพื่อจัดการกรณีอีเมลยังไม่ได้ยืนยัน
          const verificationResult = AuthVerificationService.handleUnverifiedUser(email, 'login')

          // สร้าง error object ที่มีข้อมูลเพิ่มเติม
          const verificationError = AuthVerificationService.createVerificationError(
            verificationResult.message,
            email,
            {
              verificationAction: verificationResult.action,
              redirectUrl: verificationResult.redirectUrl,
            },
          )

          console.log('Created verification error object:', verificationError)
          throw verificationError
        }

        // กรณีรหัสผ่านผิด หรือไม่พบอีเมล
        if (
          response.status === 401 ||
          data.message?.includes('incorrect') ||
          data.message?.includes('Invalid credentials') ||
          data.message?.includes('password')
        ) {
          const error = new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
          error.name = 'InvalidCredentials'
          throw error
        }

        // กรณีไม่พบบัญชีผู้ใช้
        if (data.message?.includes('not found') || data.message?.includes('no user')) {
          const error = new Error('ไม่พบบัญชีผู้ใช้นี้ในระบบ')
          error.name = 'UserNotFound'
          throw error
        }

        // กรณีข้อผิดพลาดทั่วไป (ถ้าไม่ใช่ UnverifiedEmail)
        console.log('Creating generic error')
        const error = new Error(data.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ')
        error.name = 'LoginError'
        throw error
      }

      // บันทึกข้อมูลใน localStorage
      localStorage.setItem('payloadToken', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      // อัพเดตสถานะใน context
      setToken(data.token)
      setUser(data.user)
      setIsAuthenticated(true)
    } catch (error: any) {
      console.error('Login error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack?.split('\n').slice(0, 3).join('\n'),
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // ฟังก์ชันสำหรับออกจากระบบ
  const logout = () => {
    // ลบข้อมูลออกจาก localStorage
    localStorage.removeItem('payloadToken')
    localStorage.removeItem('user')

    // รีเซ็ตสถานะ
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)

    // นำผู้ใช้ไปยังหน้าล็อกอิน
    router.push('/login')
    router.refresh()
  }

  // ฟังก์ชันสำหรับรีเฟรชข้อมูลผู้ใช้
  const refreshUser = async () => {
    if (!token) return

    try {
      const response = await fetch('/api/users/me', {
        method: 'GET',
        headers: {
          Authorization: `JWT ${token}`,
        },
      })

      if (!response.ok) {
        // ถ้า token หมดอายุหรือไม่ถูกต้อง
        if (response.status === 401) {
          logout()
          return
        }
        throw new Error('ไม่สามารถรีเฟรชข้อมูลผู้ใช้ได้')
      }

      const data = await response.json()
      // อัพเดตข้อมูลผู้ใช้
      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))
    } catch (error) {
      console.error('Error refreshing user data:', error)
    }
  }

  const contextValue: AuthContextType = {
    isLoading,
    isAuthenticated,
    user,
    token,
    login,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

// สร้าง hook สำหรับเข้าถึง context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

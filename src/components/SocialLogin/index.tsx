'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

interface SocialLoginProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export const SocialLogin: React.FC<SocialLoginProps> = ({ onSuccess, onError }) => {
  const router = useRouter()

  const handleGoogleLogin = async () => {
    try {
      // ในอนาคต: เปลี่ยนเป็น URL ของ API สำหรับล็อกอินด้วย Google
      window.location.href = '/api/auth/google'
    } catch (error) {
      console.error('Google login error:', error)
      onError?.('เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google')
    }
  }

  const handleFacebookLogin = async () => {
    try {
      // ในอนาคต: เปลี่ยนเป็น URL ของ API สำหรับล็อกอินด้วย Facebook
      window.location.href = '/api/auth/facebook'
    } catch (error) {
      console.error('Facebook login error:', error)
      onError?.('เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Facebook')
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-[#0a1925] text-gray-400">หรือเข้าสู่ระบบด้วย</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-2.5 px-4 border border-gray-700 rounded-md bg-[#162431] hover:bg-[#1c2e3e] transition-colors flex items-center justify-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
            <path
              fill="#FFC107"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            />
            <path
              fill="#FF3D00"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            />
            <path
              fill="#4CAF50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            />
            <path
              fill="#1976D2"
              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            />
          </svg>
          <span className="text-white text-sm">Google</span>
        </button>

        <button
          type="button"
          onClick={handleFacebookLogin}
          className="w-full py-2.5 px-4 border border-gray-700 rounded-md bg-[#162431] hover:bg-[#1c2e3e] transition-colors flex items-center justify-center space-x-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="#3b5998"
          >
            <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
          </svg>
          <span className="text-white text-sm">Facebook</span>
        </button>
      </div>
    </div>
  )
}

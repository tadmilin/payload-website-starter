'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      // ดึง token จาก URL
      const tokenFromUrl = searchParams?.get('token');
      if (tokenFromUrl) {
        setToken(tokenFromUrl);
        console.log('[RESET PASSWORD] Token from URL:', tokenFromUrl.substring(0, 10) + '...');
        console.log('[RESET PASSWORD] Token length:', tokenFromUrl.length);
      } else {
        setError('ไม่พบรหัสสำหรับรีเซ็ตรหัสผ่าน โปรดตรวจสอบลิงก์ในอีเมลของคุณอีกครั้ง');
      }
    } catch (e) {
      setError('เกิดข้อผิดพลาดในการอ่าน token โปรดลองใหม่หรือติดต่อผู้ดูแลระบบ');
      console.error('[RESET PASSWORD] Error processing token:', e);
    }
  }, [searchParams]);

  const validatePassword = (password: string): string | true => {
    if (password.length < 8) {
      return 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร';
    }
    if (!/[A-Z]/.test(password)) {
      return 'รหัสผ่านต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว';
    }
    if (!/[a-z]/.test(password)) {
      return 'รหัสผ่านต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว';
    }
    if (!/[0-9]/.test(password)) {
      return 'รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว';
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return 'รหัสผ่านต้องมีอักขระพิเศษอย่างน้อย 1 ตัว';
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // ตรวจสอบว่ามี token หรือไม่
    if (!token) {
      setError('ไม่พบรหัสสำหรับรีเซ็ตรหัสผ่าน');
      setLoading(false);
      return;
    }

    // ตรวจสอบความซับซ้อนของรหัสผ่าน
    const passwordValidation = validatePassword(newPassword);
    if (passwordValidation !== true) {
      setError(passwordValidation);
      setLoading(false);
      return;
    }

    // ตรวจสอบว่ารหัสผ่านตรงกันหรือไม่
    if (newPassword !== confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      setLoading(false);
      return;
    }

    try {
      console.log('[RESET PASSWORD] กำลังส่งคำขอรีเซ็ตรหัสผ่าน...');

      // กำหนดเส้นทาง API ที่จะใช้รีเซ็ตรหัสผ่าน
      const baseUrl = window.location.origin;
      const resetPasswordURL = `${baseUrl}/api/reset-password`;

      console.log('[RESET PASSWORD] ข้อมูลสำคัญ:');
      console.log('- Origin:', window.location.origin);
      console.log('- API URL:', resetPasswordURL);
      console.log('- Token length:', token.length);

      // สร้าง AbortController สำหรับยกเลิก request หากใช้เวลานานเกินไป
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 วินาที timeout

      try {
        // สร้าง request body
        const requestBody = JSON.stringify({
          token: token,
          password: newPassword,
        });

        console.log('[RESET PASSWORD] กำลังส่งคำขอไปยังเซิร์ฟเวอร์...');

        // ส่งคำขอไปยัง API endpoint
        const response = await fetch(resetPasswordURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Cache-Control': 'no-cache',
          },
          body: requestBody,
          credentials: 'same-origin',
          cache: 'no-store',
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        console.log('[RESET PASSWORD] ได้รับการตอบกลับจากเซิร์ฟเวอร์:', {
          status: response.status,
          statusText: response.statusText,
          contentType: response.headers.get('Content-Type'),
        });

        // แปลง response เป็น JSON
        const responseData = await response.json().catch((err) => {
          console.error('[RESET PASSWORD] ไม่สามารถแปลง response เป็น JSON:', err);
          return null;
        });

        console.log('[RESET PASSWORD] ข้อมูล response:', responseData);

        // ตรวจสอบสถานะการตอบกลับ
        if (!response.ok) {
          console.error('[RESET PASSWORD] การรีเซ็ตรหัสผ่านล้มเหลว:', responseData);

          if (responseData?.message) {
            throw new Error(responseData.message);
          } else {
            throw new Error('เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน กรุณาลองใหม่อีกครั้ง');
          }
        }

        // รีเซ็ตรหัสผ่านสำเร็จ
        console.log('[RESET PASSWORD] รีเซ็ตรหัสผ่านสำเร็จ');
        setSuccess(true);

        // นำผู้ใช้ไปยังหน้าล็อกอินหลังจาก 3 วินาที
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } catch (fetchError: any) {
        clearTimeout(timeoutId);

        // ตรวจสอบว่าเป็น timeout หรือไม่
        if (fetchError.name === 'AbortError') {
          throw new Error('การเชื่อมต่อใช้เวลานานเกินไป กรุณาลองใหม่อีกครั้ง');
        }

        throw fetchError;
      }
    } catch (error: any) {
      console.error('[RESET PASSWORD] Error:', error);

      // จัดการข้อความ error ที่เฉพาะเจาะจงมากขึ้น
      if (error.message.includes('fetch') || error.message.includes('network')) {
        setError(
          'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตและลองใหม่อีกครั้ง',
        );
      } else if (error.message.includes('token') || error.message.includes('หมดอายุ')) {
        setError('รหัสยืนยันไม่ถูกต้องหรือหมดอายุแล้ว กรุณาขอรีเซ็ตรหัสผ่านใหม่');
      } else {
        setError(error.message || 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#01121f] flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#0a1925] p-8 rounded-lg border border-gray-800">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-xl mr-1">☀️</span>
            <span className="text-sm tracking-wider font-bold">SOLARLAA</span>
          </Link>
        </div>

        <h1 className="text-2xl font-semibold mb-6 text-white text-center">รีเซ็ตรหัสผ่าน</h1>

        {success ? (
          <div className="bg-green-900/20 text-green-400 p-4 rounded-md text-sm border border-green-900/50 mb-6">
            <p>รีเซ็ตรหัสผ่านสำเร็จ!</p>
            <p className="mt-2">คุณสามารถใช้รหัสผ่านใหม่ในการเข้าสู่ระบบได้ทันที</p>
            <p className="mt-2 text-sm">กำลังนำคุณไปยังหน้าเข้าสู่ระบบ...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-900/20 text-red-400 p-4 rounded-md text-sm border border-red-900/50 mb-4">
                {error}
                {error.includes('หมดอายุ') || error.includes('ไม่ถูกต้อง') ? (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => router.push('/forgot-password')}
                      className="text-blue-400 underline hover:text-blue-300 text-sm"
                    >
                      ขอรหัสรีเซ็ตใหม่
                    </button>
                    <div className="text-xs text-gray-400 mt-2">
                      รหัสสำหรับรีเซ็ตรหัสผ่านจะหมดอายุภายใน 24 ชั่วโมง หรือเมื่อถูกใช้ไปแล้ว
                      <br />
                      กรุณาขอรหัสใหม่หากลิงก์หมดอายุหรือถูกใช้ไปแล้ว
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="newPassword" className="block text-sm font-medium text-white/90">
                รหัสผ่านใหม่
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-3 py-2 bg-[#162736] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="รหัสผ่านใหม่ของคุณ"
              />
              <p className="text-xs text-gray-400 mt-1">
                รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร และประกอบด้วยตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก
                ตัวเลข และอักขระพิเศษ
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/90">
                ยืนยันรหัสผ่านใหม่
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-[#162736] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="ยืนยันรหัสผ่านใหม่ของคุณ"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 ${
                loading
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
              } text-white rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition`}
            >
              {loading ? 'กำลังดำเนินการ...' : 'รีเซ็ตรหัสผ่าน'}
            </button>

            <div className="flex items-center justify-center mt-5">
              <Link
                href="/login"
                className="text-sm text-blue-400 hover:text-blue-300 focus:outline-none focus:underline transition"
              >
                กลับไปยังหน้าเข้าสู่ระบบ
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

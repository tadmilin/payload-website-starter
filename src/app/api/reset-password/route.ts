/**
 * API route สำหรับการ reset password
 */
import { type NextRequest } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { withCors } from '@/lib/cors';
import { ApiError } from '@/lib/api-helpers';

/**
 * สำหรับตรวจสอบว่ารหัสผ่านใหม่ถูกต้องตามหลักเกณฑ์หรือไม่
 */
function validatePassword(password: string): boolean {
  // ตรวจสอบความยาวของรหัสผ่าน (อย่างน้อย 8 ตัวอักษร)
  if (password.length < 8) {
    return false;
  }

  // ตรวจสอบว่ามีทั้งตัวพิมพ์ใหญ่และตัวพิมพ์เล็ก
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);

  // ตรวจสอบว่ามีตัวเลข
  const hasNumber = /[0-9]/.test(password);

  // ตรวจสอบว่ามีอักขระพิเศษ
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
}

/**
 * ฟังก์ชัน POST handler แบบเป็นขั้นเป็นตอน
 */
export const POST = withCors(async (request: NextRequest) => {
  try {
    console.log('[RESET PASSWORD] ได้รับคำขอรีเซ็ตรหัสผ่าน');

    // อ่านข้อมูล JSON จาก request
    let requestData;
    try {
      requestData = await request.json();
      console.log('[RESET PASSWORD] ข้อมูลที่ได้รับ:', {
        token: requestData.token
          ? `${requestData.token.substring(0, 10)}... (length: ${requestData.token?.length || 0})`
          : 'ไม่พบ token',
        password: requestData.password ? 'มีการส่งรหัสผ่าน' : 'ไม่มีการส่งรหัสผ่าน',
      });
    } catch (jsonError) {
      console.error('[RESET PASSWORD] ไม่สามารถอ่านข้อมูล JSON จาก request:', jsonError);
      return Response.json(
        {
          success: false,
          message: 'ไม่สามารถอ่านข้อมูล JSON จาก request ได้',
        },
        { status: 400 },
      );
    }

    const { token, password } = requestData;

    // ตรวจสอบว่ามี token และ password หรือไม่
    if (!token || !password) {
      console.error('[RESET PASSWORD] ไม่พบ token หรือรหัสผ่าน:', {
        hasToken: !!token,
        hasPassword: !!password,
      });
      return Response.json(
        {
          success: false,
          message: 'Token และรหัสผ่านใหม่จำเป็นต้องระบุ',
        },
        { status: 400 },
      );
    }

    // ตรวจสอบรหัสผ่านใหม่
    if (!validatePassword(password)) {
      console.warn('[RESET PASSWORD] รหัสผ่านไม่ตรงตามเงื่อนไข');
      return Response.json(
        {
          success: false,
          message:
            'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร และประกอบด้วยตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก ตัวเลข และอักขระพิเศษ',
        },
        { status: 400 },
      );
    }

    console.log('[RESET PASSWORD] กำลังเชื่อมต่อกับ Payload CMS');

    // เชื่อมต่อกับ Payload CMS
    const payload = await getPayload({ config: configPromise });

    // ดำเนินการรีเซ็ตรหัสผ่าน
    try {
      console.log('[RESET PASSWORD] เริ่มกระบวนการรีเซ็ตรหัสผ่าน');

      await payload.resetPassword({
        collection: 'users',
        data: {
          token,
          password,
        },
        overrideAccess: true,
      });

      console.log('[RESET PASSWORD] รีเซ็ตรหัสผ่านสำเร็จ');

      return Response.json(
        {
          success: true,
          message: 'รีเซ็ตรหัสผ่านสำเร็จ',
        },
        { status: 200 },
      );
    } catch (payloadError) {
      console.error('[RESET PASSWORD] เกิดข้อผิดพลาดจาก Payload:', payloadError);

      // จัดการกับข้อผิดพลาดจาก Payload
      if (payloadError instanceof Error) {
        const errorMessage = payloadError.message || 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน';

        // ตรวจสอบข้อความเฉพาะสำหรับ token ไม่ถูกต้องหรือหมดอายุ
        if (
          errorMessage.includes('token') ||
          errorMessage.includes('Token') ||
          errorMessage.includes('invalid') ||
          errorMessage.includes('expired')
        ) {
          return Response.json(
            {
              success: false,
              message: 'รหัสยืนยันไม่ถูกต้องหรือหมดอายุแล้ว กรุณาขอรีเซ็ตรหัสผ่านใหม่',
            },
            { status: 400 },
          );
        }

        return Response.json(
          {
            success: false,
            message: errorMessage,
          },
          { status: 400 },
        );
      }

      return Response.json(
        {
          success: false,
          message: 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุในการรีเซ็ตรหัสผ่าน',
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('[RESET PASSWORD] เกิดข้อผิดพลาดทั่วไป:', error);

    if (error instanceof ApiError) {
      return Response.json(
        {
          success: false,
          message: error.message,
        },
        { status: error.status },
      );
    }

    return Response.json(
      {
        success: false,
        message: 'เกิดข้อผิดพลาดที่ไม่คาดคิด',
      },
      { status: 500 },
    );
  }
});

// สำหรับ GET request
export const GET = withCors(async (request: NextRequest) => {
  return Response.json(
    {
      message: 'Endpoint นี้รองรับเฉพาะ POST method สำหรับการรีเซ็ตรหัสผ่าน',
    },
    { status: 405 },
  );
});

// Export handler สำหรับ OPTIONS request (preflight)
export const OPTIONS = withCors((request: NextRequest) => {
  return new Response(null, { status: 204 });
});

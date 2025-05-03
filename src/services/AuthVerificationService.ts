/**
 * AuthVerificationService - บริการจัดการสถานะการยืนยันผู้ใช้
 *
 * บริการนี้จัดการสถานะการยืนยันอีเมลของผู้ใช้และกำหนดการตอบสนองต่อสถานะนั้น
 * สร้างตามแนวทางผสมผสานที่ยืดหยุ่นเพื่อรองรับการต่อยอดในอนาคต
 */
export class AuthVerificationService {
  /**
   * ตรวจสอบสถานะการยืนยันของผู้ใช้
   * @param userData ข้อมูลผู้ใช้จากระบบ
   * @returns ข้อมูลสถานะการยืนยัน
   */
  static checkVerificationStatus(userData: any) {
    return {
      verified: userData._verified || userData.verified || false,
      email: userData.email,
    }
  }

  /**
   * จัดการกับกรณีผู้ใช้ยังไม่ได้ยืนยันตัวตน
   * @param email อีเมลของผู้ใช้
   * @param context บริบทที่เกิดขึ้น (login/register)
   * @returns การดำเนินการที่ควรทำ
   */
  static handleUnverifiedUser(email: string, context: 'login' | 'register' | string = 'login') {
    // บันทึกข้อมูลใน session storage สำหรับใช้ในหน้ายืนยันอีเมล
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pendingVerification', email)
      sessionStorage.setItem('verificationSource', context)
    }

    // ตัดสินใจดำเนินการตามบริบท
    switch (context) {
      case 'login':
        return {
          action: 'notification',
          message: 'กรุณายืนยันตัวตนที่ email ที่สมัครไว้',
          redirectUrl: `/verify-email?email=${encodeURIComponent(email)}&source=login`,
        }

      case 'register':
        return {
          action: 'redirect',
          message: 'กรุณายืนยันอีเมลเพื่อเริ่มใช้งานบัญชีของคุณ',
          redirectUrl: `/verify-email?email=${encodeURIComponent(email)}&source=register`,
        }

      default:
        return {
          action: 'notification',
          message: 'กรุณายืนยันอีเมลของคุณ',
          redirectUrl: `/verify-email?email=${encodeURIComponent(email)}`,
        }
    }
  }

  /**
   * ส่งอีเมลยืนยันใหม่
   * @param email อีเมลที่ต้องการส่งอีเมลยืนยันใหม่
   * @returns ผลการดำเนินการ
   */
  static async resendVerification(email: string) {
    try {
      const response = await fetch('/api/users/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'ไม่สามารถส่งอีเมลยืนยันได้')
      }

      return {
        success: true,
        message: 'ส่งอีเมลยืนยันใหม่เรียบร้อยแล้ว โปรดตรวจสอบกล่องจดหมายของคุณ',
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'ไม่สามารถส่งอีเมลยืนยันได้ โปรดลองอีกครั้งภายหลัง',
      }
    }
  }

  /**
   * สร้าง error object ที่มีข้อมูลเพิ่มเติมสำหรับจัดการกรณีอีเมลยังไม่ได้ยืนยัน
   * @param message ข้อความแจ้งเตือน
   * @param email อีเมลที่เกี่ยวข้อง
   * @param info ข้อมูลเพิ่มเติม
   * @returns error object ที่มีข้อมูลเพิ่มเติม
   */
  static createVerificationError(message: string, email: string, info: any = {}) {
    const error = new Error(message)
    error.name = 'UnverifiedEmail'
    // เพิ่มข้อมูลที่จำเป็นใน error object
    Object.assign(error, { email, ...info })
    return error
  }
}

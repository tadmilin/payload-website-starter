// ภาษาที่รองรับ
export const locales = ['en', 'th']
export const defaultLocale = 'th' // ตั้งค่าเริ่มต้นเป็นภาษาไทย

// dictionary สำหรับการแปล
const translations: Record<string, Record<string, string>> = {
  th: {
    home: 'หน้าหลัก',
    simulator: 'จำลองการติดตั้ง',
    shop: 'ร้านค้า',
    monitor: 'ติดตามระบบ',
    login: 'เข้าสู่ระบบ',
    solar_title: 'โซล่าเซลล์เพื่อบ้านของคุณ',
    solar_desc: 'ผลิตไฟฟ้าจากแสงอาทิตย์ ประหยัดพลังงาน ลดค่าไฟฟ้า',
    start_simulation: 'เริ่มจำลองการติดตั้ง',
    view_products: 'ดูสินค้าทั้งหมด',
    energy_saving_stats: 'สถิติการประหยัดพลังงาน',
    total_electricity: 'พลังงานไฟฟ้าทั้งหมด',
    total_consumption: 'การใช้พลังงานทั้งหมด',
    total_projects: 'โครงการทั้งหมด',
    total_capacity: 'กำลังการผลิตทั้งหมด'
  },
  en: {
    home: 'Home',
    simulator: 'Simulator',
    shop: 'Shop',
    monitor: 'Monitor',
    login: 'Login',
    solar_title: 'Solar Cell for Your Home',
    solar_desc: 'Generate electricity from sunlight, save energy, reduce electricity bills',
    start_simulation: 'Start Simulation',
    view_products: 'View All Products',
    energy_saving_stats: 'Energy Saving Statistics',
    total_electricity: 'Total Electricity',
    total_consumption: 'Total Consumption',
    total_projects: 'Total Projects',
    total_capacity: 'Total Capacity'
  }
}

// ฟังก์ชันสำหรับแปลข้อความ
export function translate(key: string, locale: string = defaultLocale): string {
  return translations[locale]?.[key] || key
} 
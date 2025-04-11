import { defaultLocale, locales, translate } from './utils/minimal-i18n'

// ส่งออกค่าให้ตรงกับ minimal-i18n
export { defaultLocale, locales, translate }

// สร้าง dummy function เพื่อให้โค้ดเดิมทำงานได้
export async function getTranslations(locale: string) {
  return {
    t: (key: string) => translate(key, locale),
    i18n: {
      language: locale,
      changeLanguage: () => Promise.resolve(),
    },
  }
}

// สร้าง dummy function สำหรับ initI18next
export const initI18next = async (locale: string) => {
  return {
    t: (key: string) => translate(key, locale),
    language: locale,
    changeLanguage: () => Promise.resolve(),
  }
} 
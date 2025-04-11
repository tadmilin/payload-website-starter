import { createInstance } from 'i18next'
import { initReactI18next } from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'

// ภาษาที่รองรับ
export const locales = ['en', 'th']
export const defaultLocale = 'th' // ตั้งค่าเริ่มต้นเป็นภาษาไทย

// สร้าง i18n instance
export const initI18next = async (locale: string, namespaces: string[]) => {
  const i18nInstance = createInstance()
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`../public/locales/${language}/${namespace}.json`),
      ),
    )
    .init({
      lng: locale,
      fallbackLng: defaultLocale,
      supportedLngs: locales,
      defaultNS: namespaces[0],
      fallbackNS: namespaces[0],
      ns: namespaces,
      preload: typeof window === 'undefined' ? locales : [],
    })

  return i18nInstance
}

// ฟังก์ชันสำหรับแปลข้อความ
export async function getTranslations(locale: string, namespaces: string[] = ['common']) {
  const i18nextInstance = await initI18next(locale, namespaces)
  return {
    t: i18nextInstance.getFixedT(locale, namespaces[0]),
    i18n: i18nextInstance,
  }
} 
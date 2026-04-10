import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpBackend from 'i18next-http-backend'
import { STORAGE_KEYS } from '@/constants'

// 获取保存的语言偏好，默认中文
const savedLocale = localStorage.getItem(STORAGE_KEYS.LOCALE) || 'zh'

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: savedLocale,
    fallbackLng: 'zh',
    ns: ['common', 'menu', 'auth'],
    defaultNS: 'common',

    backend: {
      // 按语言和命名空间加载 JSON 文件
      loadPath: '/src/i18n/locales/{{lng}}/{{ns}}.json',
    },

    interpolation: {
      escapeValue: false, // React 已默认转义
    },

    react: {
      useSuspense: true,
    },
  })

export default i18n

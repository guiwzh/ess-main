import type common from './locales/zh/common.json'
import type menu from './locales/zh/menu.json'
import type auth from './locales/zh/auth.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: {
      common: typeof common
      menu: typeof menu
      auth: typeof auth
    }
  }
}

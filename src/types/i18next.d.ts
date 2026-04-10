import 'i18next'

import type zhCommon from '../i18n/locales/zh/common.json'
import type zhMenu from '../i18n/locales/zh/menu.json'
import type zhAuth from '../i18n/locales/zh/auth.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: {
      common: typeof zhCommon
      menu: typeof zhMenu
      auth: typeof zhAuth
    }
  }
}

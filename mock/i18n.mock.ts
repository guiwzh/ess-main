import { defineMock } from 'vite-plugin-mock-dev-server'
import fs from 'node:fs'
import path from 'node:path'

/** i18n 翻译接口 Mock — 从 locales 目录读取 JSON 返回 */
export default defineMock([
  {
    url: '/api/locales/:lng/:ns.json',
    method: 'GET',
    body(request) {
      const { lng, ns } = request.params as { lng: string; ns: string }
      const filePath = path.resolve(__dirname, `../src/i18n/locales/${lng}/${ns}.json`)
      if (!fs.existsSync(filePath)) {
        return {}
      }
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    },
  },
])

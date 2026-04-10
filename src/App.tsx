import { RouterProvider } from 'react-router-dom'
import { ConfigProvider, theme as antdTheme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import enUS from 'antd/locale/en_US'
import { useAppStore } from '@/store/appStore'
import router from '@/router'

const localeMap = { zh: zhCN, en: enUS } as const

function App() {
  const { theme, locale } = useAppStore()

  return (
    <ConfigProvider
      locale={localeMap[locale]}
      theme={{
        algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#00B96B',
          borderRadius: 6,
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  )
}

export default App

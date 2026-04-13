import { useMemo } from 'react'
import { RouterProvider } from 'react-router-dom'
import { ConfigProvider, Spin, theme as antdTheme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import enUS from 'antd/locale/en_US'
import { useAppStore } from '@/store/appStore'
import { useUserStore } from '@/store/userStore'
import { useInitApp } from '@/hooks/useInitApp'
import { createAppRouter } from '@/router'

const localeMap = { zh: zhCN, en: enUS } as const

function App() {
  const { theme, locale } = useAppStore()
  const dynamicRoutes = useUserStore((s) => s.dynamicRoutes)
  const { loading, authenticated } = useInitApp()
  const router = useMemo(
    () => createAppRouter(authenticated, dynamicRoutes),
    [authenticated, dynamicRoutes],
  )

  return (
    <ConfigProvider
      locale={localeMap[locale]}
      form={{ colon: false }}
      theme={{
        algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#00B96B',
          borderRadius: 6,
        },
      }}
    >
      {authenticated && loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <RouterProvider router={router} />
      )}
    </ConfigProvider>
  )
}

export default App

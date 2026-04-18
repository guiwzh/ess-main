import ErrorBoundary from '@/components/ErrorBoundary'
import { useInitApp } from '@/hooks/useInitApp'
import { createAppRouter } from '@/router'
import { useAppStore } from '@/store/appStore'
import { useUserStore } from '@/store/userStore'
import { ConfigProvider, Spin, theme as antdTheme } from 'antd'
import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'
import { useMemo } from 'react'
import { RouterProvider } from 'react-router-dom'

const localeMap = { zh: zhCN, en: enUS } as const

const App = () => {
  const { loading, authenticated } = useInitApp()
  const { theme, locale } = useAppStore()
  const dynamicRoutes = useUserStore((s) => s.dynamicRoutes)
  const router = useMemo(
    () => createAppRouter(authenticated, dynamicRoutes),
    [authenticated, dynamicRoutes],
  )

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  )
}

export default App

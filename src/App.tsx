import ErrorBoundary from '@/components/ErrorBoundary'
import { useInitApp } from '@/hooks/useInitApp'
import { createAppRouter } from '@/router'
import { useAppStore } from '@/store/appStore'
import { useUserStore } from '@/store/userStore'
import { ConfigProvider, Spin, theme as antdTheme } from 'antd'
import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'
import { Suspense, useMemo } from 'react'
import { RouterProvider } from 'react-router-dom'
// vite-plugin-font: 全量分片，浏览器按 unicode-range 按需加载
import { css, fontFamilyFallback } from '../public/fonts/AlibabaPuHuiTi-3-65-Medium.ttf'

const localeMap = { zh: zhCN, en: enUS } as const

const CenteredSpin = () => (
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
)

const App = () => {
  const { loading, authenticated } = useInitApp()
  const theme = useAppStore((s) => s.theme)
  const locale = useAppStore((s) => s.locale)
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
            fontFamily: `"${css.family}", ${fontFamilyFallback}`,
          },
        }}
      >
        <Suspense fallback={<CenteredSpin />}>
          {authenticated && loading ? <CenteredSpin /> : <RouterProvider router={router} />}
        </Suspense>
      </ConfigProvider>
    </ErrorBoundary>
  )
}

export default App

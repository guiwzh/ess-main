import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import WujieReact from 'wujie-react'
import { Spin, Result, Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { getSubAppConfig } from './config'
import { useSubAppProps } from './props'
import { emitRouteChange } from './bus'

interface SubAppProps {
  /** 子应用名称，必须与 config 中注册的 name 一致 */
  name: string
}

/** 子应用加载超时时间 (ms) */
const LOAD_TIMEOUT = 15000

export default function SubApp({ name }: SubAppProps) {
  const { t } = useTranslation('common')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const config = getSubAppConfig(name)
  const subAppProps = useSubAppProps()
  const location = useLocation()

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
      setError(t('subAppTimeout', { name }))
    }, LOAD_TIMEOUT)

    return () => clearTimeout(timer)
  }, [name, t])

  // 主应用路由变化时，通知子应用导航到对应路径
  useEffect(() => {
    // 提取出子应用内部路径：去掉主应用前缀
    // /operation/devices → /devices, /analysis/energy-stats → /energy-stats
    const segments = location.pathname.split('/').filter(Boolean)
    if (segments.length >= 2) {
      const subPath = '/' + segments.slice(1).join('/')
      emitRouteChange(subPath)
    }
  }, [location.pathname])

  if (!config) {
    return <Result status="error" title={t('subAppNotFound')} subTitle={`${name}`} />
  }

  const handleLoadError = () => {
    setLoading(false)
    setError(t('subAppLoadError', { name }))
  }

  const handleLoading = () => {
    setLoading(false)
  }

  if (error) {
    return (
      <Result
        status="error"
        title={t('subAppError')}
        subTitle={error}
        extra={
          <Button type="primary" onClick={() => window.location.reload()}>
            {t('retry')}
          </Button>
        }
      />
    )
  }

  return (
    <Spin spinning={loading} tip={t('subAppLoading')} style={{ minHeight: 300 }}>
      <WujieReact
        name={config.name}
        url={config.url}
        alive={config.alive}
        props={subAppProps as unknown as Record<string, unknown>}
        loadError={handleLoadError}
        beforeLoad={() => handleLoading()}
      />
    </Spin>
  )
}
